import { Suspense } from "react";
import { connection } from "next/server";
import { AdminLoading } from "@/components/admin/admin-loading";
import { MessageManager } from "@/components/admin/message-manager";
import { ErrorState } from "@/components/ui/states";
import { getAdminMessages } from "@/lib/services/messages";

async function MessagesContent() {
  await connection();

  let messages: Awaited<ReturnType<typeof getAdminMessages>> = [];
  let error: string | null = null;

  try {
    messages = await getAdminMessages();
  } catch (cause) {
    error =
      cause instanceof Error
        ? cause.message
        : "Check your Supabase connection and RLS policies.";
  }

  if (error) {
    return <ErrorState title="Could not load messages" description={error} />;
  }

  return <MessageManager messages={messages} />;
}

export default function AdminMessagesPage() {
  return (
    <Suspense fallback={<AdminLoading />}>
      <MessagesContent />
    </Suspense>
  );
}
