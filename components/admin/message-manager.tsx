"use client";

import {
  Calendar,
  CheckCheck,
  Mail,
  MailOpen,
  Reply,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  adminDeleteMessage,
  adminToggleMessageRead,
} from "@/app/admin/actions";
import { AdminPageHeader } from "@/components/admin/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/field";
import { EmptyState, Spinner } from "@/components/ui/states";
import { confirmAction, toast } from "@/lib/utils/notify";
import { formatDate } from "@/lib/utils/date";
import { cn } from "@/lib/utils/cn";
import type { ContactMessage } from "@/types";

export function MessageManager({ messages }: { messages: ContactMessage[] }) {
  const router = useRouter();
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [search, setSearch] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  const unreadCount = messages.filter((message) => !message.read).length;

  const filtered = useMemo(() => {
    const base =
      filter === "unread"
        ? messages.filter((message) => !message.read)
        : filter === "read"
          ? messages.filter((message) => message.read)
          : messages;

    const query = search.trim().toLowerCase();
    if (!query) return base;

    return base.filter(
      (message) =>
        message.name.toLowerCase().includes(query) ||
        message.email.toLowerCase().includes(query) ||
        message.message.toLowerCase().includes(query),
    );
  }, [messages, filter, search]);

  const toggleRead = async (message: ContactMessage) => {
    setBusyId(message.id);
    const result = await adminToggleMessageRead(message.id, !message.read);
    setBusyId(null);

    if (!result.success) {
      await toast({ title: "Update failed", text: result.error, icon: "error" });
      return;
    }

    router.refresh();
  };

  const remove = async (message: ContactMessage) => {
    const confirmed = await confirmAction({
      title: "Delete message?",
      text: `The message from "${message.name}" will be permanently removed.`,
      confirmText: "Delete message",
    });

    if (!confirmed) return;

    setBusyId(message.id);
    const result = await adminDeleteMessage(message.id);
    setBusyId(null);

    if (!result.success) {
      await toast({ title: "Delete failed", text: result.error, icon: "error" });
      return;
    }

    await toast({ title: "Message deleted", text: result.message });
    router.refresh();
  };

  return (
    <div>
      <AdminPageHeader
        icon={Mail}
        title="Messages"
        description={`${messages.length} total · ${unreadCount} unread`}
        action={
          <div className="flex gap-1 rounded-xl border border-white/10 bg-white/[0.03] p-1">
            {[
              { value: "all" as const, label: "All" },
              { value: "unread" as const, label: "Unread" },
              { value: "read" as const, label: "Read" },
            ].map((tab) => (
              <button
                key={tab.value}
                type="button"
                onClick={() => setFilter(tab.value)}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-xs transition",
                  filter === tab.value
                    ? "bg-indigo-500/20 text-white"
                    : "text-gray-500 hover:text-gray-300",
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        }
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="p-4">
          <p className="text-[10px] uppercase tracking-wider text-gray-500">
            Inbox
          </p>
          <p className="mt-1 text-2xl font-bold text-indigo-300">
            {messages.length}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-[10px] uppercase tracking-wider text-gray-500">
            Unread
          </p>
          <p className="mt-1 text-2xl font-bold text-amber-300">{unreadCount}</p>
        </Card>
        <Card className="p-4">
          <p className="text-[10px] uppercase tracking-wider text-gray-500">
            Read
          </p>
          <p className="mt-1 text-2xl font-bold text-emerald-300">
            {messages.length - unreadCount}
          </p>
        </Card>
      </div>

      <div className="relative mt-4">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search messages, names, or emails..."
          className="pl-10 pr-10"
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="mt-4 space-y-2.5">
        {filtered.length === 0 ? (
          <EmptyState
            icon={Mail}
            title={search ? "No matching messages" : "Inbox is empty"}
            description={
              search
                ? "Try a different name, email, or phrase."
                : "Messages from the contact form will appear here."
            }
          />
        ) : (
          filtered.map((message) => (
            <div
              key={message.id}
              className={cn(
                "rounded-2xl border p-4 transition",
                message.read
                  ? "border-white/[0.08] bg-white/[0.02]"
                  : "border-amber-400/20 bg-amber-500/[0.035]",
                busyId === message.id && "opacity-60",
              )}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-lg border",
                      message.read
                        ? "border-white/10 bg-white/[0.04] text-gray-500"
                        : "border-amber-400/20 bg-amber-500/10 text-amber-300",
                    )}
                  >
                    {message.read ? (
                      <MailOpen className="h-4 w-4" />
                    ) : (
                      <Mail className="h-4 w-4" />
                    )}
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-white">
                      {message.name}
                    </p>
                    <a
                      href={`mailto:${message.email}`}
                      className="text-[10px] text-indigo-300 transition hover:text-indigo-200"
                    >
                      {message.email}
                    </a>
                  </div>
                  {!message.read && <Badge variant="amber">New</Badge>}
                </div>

                <span className="flex items-center gap-1 text-[10px] text-gray-600">
                  <Calendar className="h-3 w-3" />
                  {formatDate(message.createdAt)}
                </span>
              </div>

              <p className="mt-3 whitespace-pre-line text-xs leading-relaxed text-gray-400">
                {message.message}
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-white/[0.07] pt-3">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => toggleRead(message)}
                  disabled={busyId === message.id}
                  icon={
                    busyId === message.id ? (
                      <Spinner className="h-3 w-3" />
                    ) : message.read ? (
                      <Mail className="h-3 w-3" />
                    ) : (
                      <CheckCheck className="h-3 w-3" />
                    )
                  }
                >
                  {message.read ? "Mark unread" : "Mark read"}
                </Button>
                <a
                  href={`mailto:${message.email}?subject=Re:%20Your%20message&body=Hi%20${encodeURIComponent(
                    message.name,
                  )},`}
                  className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-indigo-400/25 bg-indigo-500/[0.08] px-3 text-xs text-indigo-200 transition hover:bg-indigo-500/15"
                >
                  <Reply className="h-3 w-3" />
                  Reply
                </a>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => remove(message)}
                  disabled={busyId === message.id}
                  icon={<Trash2 className="h-3 w-3" />}
                  className="ml-auto"
                >
                  Delete
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-3 flex justify-end">
        <Button variant="secondary" size="sm" onClick={() => router.refresh()}>
          Refresh
        </Button>
      </div>
    </div>
  );
}
