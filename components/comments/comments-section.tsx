"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  ImagePlus,
  MessageCircle,
  Pin,
  Send,
  UserCircle2,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/field";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { EmptyState, Skeleton } from "@/components/ui/states";
import {
  createComment,
  fetchComments,
  subscribeToComments,
} from "@/lib/services/comments";
import { isSupabaseConfigured } from "@/lib/site-config";
import { formatRelativeDate } from "@/lib/utils/date";
import { toast } from "@/lib/utils/notify";
import { commentSchema } from "@/lib/utils/validation";
import { cn } from "@/lib/utils/cn";
import type { Comment } from "@/types";

function Avatar({ comment }: { comment: Comment }) {
  if (comment.profileImageUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={comment.profileImageUrl}
        alt={`${comment.userName}'s avatar`}
        loading="lazy"
        className={cn(
          "h-9 w-9 rounded-full border-2 object-cover",
          comment.isPinned ? "border-indigo-400/60" : "border-indigo-400/25",
        )}
      />
    );
  }

  return (
    <span
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-full border",
        comment.isPinned
          ? "border-indigo-400/40 bg-indigo-500/25 text-indigo-200"
          : "border-white/10 bg-indigo-500/15 text-indigo-300",
      )}
    >
      <UserCircle2 className="h-4.5 w-4.5" />
    </span>
  );
}

function CommentItem({ comment }: { comment: Comment }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className={cn(
        "group rounded-xl border p-4 transition-all duration-300 hover:-translate-y-0.5",
        comment.isPinned
          ? "border-indigo-400/30 bg-gradient-to-r from-indigo-500/10 to-purple-500/10"
          : "border-white/[0.08] bg-white/[0.03] hover:border-white/15 hover:bg-white/[0.045]",
      )}
    >
      {comment.isPinned && (
        <div className="mb-3 flex items-center gap-1.5 text-indigo-300">
          <Pin className="h-3 w-3" />
          <span className="text-[9px] font-semibold uppercase tracking-[0.16em]">
            Pinned comment
          </span>
        </div>
      )}
      <div className="flex items-start gap-3">
        <Avatar comment={comment} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2">
              <p className="truncate text-sm font-medium text-white">
                {comment.userName}
              </p>
              {comment.isPinned && (
                <Badge variant="indigo" className="shrink-0 text-[9px]">
                  Admin
                </Badge>
              )}
            </div>
            <span className="shrink-0 text-[10px] text-gray-500">
              {formatRelativeDate(comment.createdAt)}
            </span>
          </div>
          <p className="mt-1 break-words text-xs leading-relaxed text-gray-400">
            {comment.content}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export function CommentsSection() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    try {
      const data = await fetchComments();
      setComments(data);
      setError(null);
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Could not load comments.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void load();
    }, 0);

    const unsubscribe = subscribeToComments(() => {
      void load();
    });

    return () => {
      window.clearTimeout(timer);
      unsubscribe();
    };
  }, [load]);

  useEffect(() => {
    return () => {
      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    };
  }, [avatarPreview]);

  const handleAvatar = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setFormError("Please choose a valid image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setFormError("Profile image must be smaller than 5 MB.");
      return;
    }

    if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
    setFormError(null);
  };

  const clearAvatar = () => {
    if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    setAvatarFile(null);
    setAvatarPreview(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    const parsed = commentSchema.safeParse({
      userName: name,
      content: message,
    });

    if (!parsed.success) {
      setFormError(parsed.error.issues[0]?.message ?? "Please check the form.");
      return;
    }

    if (!isSupabaseConfigured) {
      setFormError(
        "Comments are not connected yet. Add your Supabase credentials to enable posting.",
      );
      return;
    }

    setSubmitting(true);

    try {
      const created = await createComment({
        userName: parsed.data.userName,
        content: parsed.data.content,
        avatarFile,
      });

      setComments((current) => {
        const without = current.filter((item) => item.id !== created.id);
        return [created, ...without].sort((a, b) => {
          if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        });
      });

      setName("");
      setMessage("");
      clearAvatar();
      await toast({
        title: "Comment posted",
        text: "Thanks for joining the conversation.",
      });
    } catch (cause) {
      setFormError(
        cause instanceof Error ? cause.message : "Could not post your comment.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const pinned = comments.filter((comment) => comment.isPinned);
  const regular = comments.filter((comment) => !comment.isPinned);

  return (
    <section id="comments" className="section-shell scroll-mt-24 py-12 sm:py-14">
      <Reveal>
        <SectionHeading
          eyebrow="Guestbook"
          title={
            <>
              Leave a <span className="text-gradient">note</span>
            </>
          }
          description="Have a question, a project idea, or just want to say hello? Drop a comment below — pinned notes appear at the top."
        />
      </Reveal>

      <div className="mt-10 grid gap-5 lg:grid-cols-[1fr_0.9fr]">
        <Reveal direction="left" distance={80} className="min-w-0">
          <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5 backdrop-blur-xl sm:p-6">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-indigo-400/20 bg-indigo-500/15">
                <MessageCircle className="h-4 w-4 text-indigo-300" />
              </span>
              <div>
                <h3 className="text-sm font-semibold text-white">
                  Write a comment
                </h3>
                <p className="text-[11px] text-gray-500">
                  Be respectful. Comments are public.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <Field label="Name" required hint={`${name.length}/40`}>
                <Input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  maxLength={40}
                  placeholder="Your name"
                  autoComplete="name"
                  required
                />
              </Field>

              <Field label="Message" required hint={`${message.length}/500`}>
                <Textarea
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  maxLength={500}
                  rows={4}
                  placeholder="Share a thought, question, or hello..."
                  required
                />
              </Field>

              <div className="space-y-1.5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-indigo-300/70">
                  Profile photo <span className="text-gray-600">(optional)</span>
                </p>
                {avatarPreview ? (
                  <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={avatarPreview}
                      alt="Avatar preview"
                      className="h-12 w-12 rounded-full border-2 border-indigo-400/40 object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs text-gray-300">
                        {avatarFile?.name}
                      </p>
                      <p className="text-[10px] text-gray-600">Max 5 MB</p>
                    </div>
                    <button
                      type="button"
                      onClick={clearAvatar}
                      className="rounded-lg p-1.5 text-gray-500 transition hover:bg-red-500/10 hover:text-red-400"
                      aria-label="Remove photo"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-indigo-400/30 bg-indigo-500/[0.05] px-4 py-3 text-xs text-indigo-300 transition hover:border-indigo-400/60 hover:bg-indigo-500/10"
                  >
                    <ImagePlus className="h-4 w-4" />
                    Choose a profile photo
                  </button>
                )}
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatar}
                />
              </div>

              {formError && (
                <div className="flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-300">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <p>{formError}</p>
                </div>
              )}

              {!isSupabaseConfigured && (
                <div className="flex items-start gap-2 rounded-xl border border-amber-500/20 bg-amber-500/[0.07] p-3 text-[11px] leading-relaxed text-amber-200/80">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  Comments are showing demo data. Connect Supabase to enable
                  posting and realtime updates.
                </div>
              )}

              <Button
                type="submit"
                size="md"
                className="w-full"
                loading={submitting}
                icon={<Send className="h-4 w-4" />}
                disabled={!isSupabaseConfigured}
              >
                {submitting ? "Posting..." : "Post comment"}
              </Button>
            </form>
          </div>
        </Reveal>

        <Reveal delay={0.1} direction="right" distance={80} className="relative min-w-0">
          <div className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.025] p-5 backdrop-blur-xl sm:p-6 lg:absolute lg:inset-0 lg:h-full">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-white">
                <MessageCircle className="h-4 w-4 text-indigo-300" />
                Comments
                <span className="text-indigo-400">({comments.length})</span>
              </h3>
              <span className="flex items-center gap-1.5 text-[10px] text-gray-600">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                Realtime
              </span>
            </div>

            {error && (
              <div className="mt-4 flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-300">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            <div className="mt-4 max-h-[34rem] space-y-3 overflow-y-auto pr-1 lg:min-h-0 lg:max-h-none lg:flex-1">
              {loading ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <Skeleton key={index} className="h-24 w-full" />
                ))
              ) : comments.length === 0 ? (
                <EmptyState
                  icon={MessageCircle}
                  title="No comments yet"
                  description="Be the first to leave a note."
                />
              ) : (
                <AnimatePresence initial={false}>
                  {pinned.map((comment) => (
                    <CommentItem key={comment.id} comment={comment} />
                  ))}
                  {regular.map((comment) => (
                    <CommentItem key={comment.id} comment={comment} />
                  ))}
                </AnimatePresence>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
