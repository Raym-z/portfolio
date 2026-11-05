import { Suspense } from "react";
import { connection } from "next/server";
import { AdminLoading } from "@/components/admin/admin-loading";
import { CommentManager } from "@/components/admin/comment-manager";
import { ErrorState } from "@/components/ui/states";
import { getAdminComments } from "@/lib/services/comments-admin";

async function CommentsContent() {
  await connection();

  let comments: Awaited<ReturnType<typeof getAdminComments>> = [];
  let error: string | null = null;

  try {
    comments = await getAdminComments();
  } catch (cause) {
    error =
      cause instanceof Error
        ? cause.message
        : "Check your Supabase connection and RLS policies.";
  }

  if (error) {
    return <ErrorState title="Could not load comments" description={error} />;
  }

  return <CommentManager comments={comments} />;
}

export default function AdminCommentsPage() {
  return (
    <Suspense fallback={<AdminLoading />}>
      <CommentsContent />
    </Suspense>
  );
}
