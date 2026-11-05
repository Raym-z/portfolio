"use client";

import {
  Calendar,
  MessageSquare,
  Pin,
  PinOff,
  Search,
  Trash2,
  UserCircle2,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  adminDeleteComment,
  adminToggleCommentPin,
} from "@/app/admin/actions";
import { AdminPageHeader } from "@/components/admin/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/field";
import { Card } from "@/components/ui/card";
import { EmptyState, Spinner } from "@/components/ui/states";
import { confirmAction, toast } from "@/lib/utils/notify";
import { formatDate } from "@/lib/utils/date";
import { cn } from "@/lib/utils/cn";
import type { Comment } from "@/types";

export function CommentManager({ comments }: { comments: Comment[] }) {
  const router = useRouter();
  const [filter, setFilter] = useState<"all" | "pinned">("all");
  const [search, setSearch] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  const pinnedCount = comments.filter((comment) => comment.isPinned).length;

  const filtered = useMemo(() => {
    const base =
      filter === "pinned"
        ? comments.filter((comment) => comment.isPinned)
        : comments;
    const query = search.trim().toLowerCase();

    if (!query) return base;

    return base.filter(
      (comment) =>
        comment.userName.toLowerCase().includes(query) ||
        comment.content.toLowerCase().includes(query),
    );
  }, [comments, filter, search]);

  const handlePin = async (comment: Comment) => {
    setBusyId(comment.id);
    const result = await adminToggleCommentPin(comment.id, !comment.isPinned);
    setBusyId(null);

    if (!result.success) {
      await toast({ title: "Update failed", text: result.error, icon: "error" });
      return;
    }

    await toast({ title: result.message ?? "Updated" });
    router.refresh();
  };

  const handleDelete = async (comment: Comment) => {
    const confirmed = await confirmAction({
      title: "Delete comment?",
      text: `The comment from "${comment.userName}" will be permanently removed.`,
      confirmText: "Delete comment",
    });

    if (!confirmed) return;

    setBusyId(comment.id);
    const result = await adminDeleteComment(comment.id);
    setBusyId(null);

    if (!result.success) {
      await toast({ title: "Delete failed", text: result.error, icon: "error" });
      return;
    }

    await toast({ title: "Comment deleted", text: result.message });
    router.refresh();
  };

  return (
    <div>
      <AdminPageHeader
        icon={MessageSquare}
        title="Comments"
        description={`${comments.length} total · ${pinnedCount} pinned`}
        action={
          <div className="flex gap-1 rounded-xl border border-white/10 bg-white/[0.03] p-1">
            {[
              { value: "all" as const, label: "All", count: comments.length },
              { value: "pinned" as const, label: "Pinned", count: pinnedCount },
            ].map((tab) => (
              <button
                key={tab.value}
                type="button"
                onClick={() => setFilter(tab.value)}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs transition",
                  filter === tab.value
                    ? "bg-indigo-500/20 text-white"
                    : "text-gray-500 hover:text-gray-300",
                )}
              >
                {tab.label}
                <span className="rounded-full bg-white/[0.06] px-1.5 py-0.5 text-[9px] text-gray-400">
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        }
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="p-4">
          <p className="text-[10px] uppercase tracking-wider text-gray-500">
            Total
          </p>
          <p className="mt-1 text-2xl font-bold text-indigo-300">
            {comments.length}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-[10px] uppercase tracking-wider text-gray-500">
            Pinned
          </p>
          <p className="mt-1 text-2xl font-bold text-purple-300">
            {pinnedCount}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-[10px] uppercase tracking-wider text-gray-500">
            Unpinned
          </p>
          <p className="mt-1 text-2xl font-bold text-cyan-300">
            {comments.length - pinnedCount}
          </p>
        </Card>
      </div>

      <div className="relative mt-4">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by name or message..."
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
            icon={MessageSquare}
            title={search ? "No matching comments" : "No comments yet"}
            description={
              search
                ? "Try a different name or phrase."
                : "Comments submitted from the public site will appear here."
            }
          />
        ) : (
          filtered.map((comment) => (
            <div
              key={comment.id}
              className={cn(
                "relative rounded-2xl border p-4 transition-all",
                comment.isPinned
                  ? "border-indigo-400/25 bg-gradient-to-r from-indigo-500/[0.07] to-purple-500/[0.05]"
                  : "border-white/[0.08] bg-white/[0.025] hover:border-white/15",
                busyId === comment.id && "opacity-60",
              )}
            >
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-indigo-400/25 bg-indigo-500/15">
                  {comment.profileImageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={comment.profileImageUrl}
                      alt={`${comment.userName} avatar`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <UserCircle2 className="h-4.5 w-4.5 text-indigo-300" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold text-white">
                      {comment.userName}
                    </span>
                    {comment.isPinned && (
                      <Badge variant="indigo">
                        <Pin className="h-2.5 w-2.5" />
                        Pinned
                      </Badge>
                    )}
                    <span className="ml-auto flex shrink-0 items-center gap-1 text-[10px] text-gray-600">
                      <Calendar className="h-3 w-3" />
                      {formatDate(comment.createdAt)}
                    </span>
                  </div>
                  <p className="mt-1.5 text-xs leading-relaxed text-gray-400">
                    {comment.content}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handlePin(comment)}
                    disabled={busyId === comment.id}
                    title={comment.isPinned ? "Unpin comment" : "Pin comment"}
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-lg border transition",
                      comment.isPinned
                        ? "border-indigo-400/30 bg-indigo-500/15 text-indigo-300 hover:bg-indigo-500/25"
                        : "border-white/10 text-gray-500 hover:border-indigo-400/25 hover:text-indigo-300",
                    )}
                  >
                    {busyId === comment.id ? (
                      <Spinner className="h-3.5 w-3.5" />
                    ) : comment.isPinned ? (
                      <PinOff className="h-3.5 w-3.5" />
                    ) : (
                      <Pin className="h-3.5 w-3.5" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(comment)}
                    disabled={busyId === comment.id}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-gray-500 transition hover:border-red-500/25 hover:bg-red-500/10 hover:text-red-400"
                    aria-label="Delete comment"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <p className="mt-4 text-[10px] leading-relaxed text-gray-600">
        Only one comment can be pinned at a time. Pinning a new comment
        automatically unpins the previous one. Deletions are permanent.
      </p>

      <div className="mt-3 flex justify-end">
        <Button variant="secondary" size="sm" onClick={() => router.refresh()}>
          Refresh
        </Button>
      </div>
    </div>
  );
}
