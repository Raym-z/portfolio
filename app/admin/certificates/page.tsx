import { Suspense } from "react";
import { connection } from "next/server";
import { AdminLoading } from "@/components/admin/admin-loading";
import { CertificateManager } from "@/components/admin/certificate-manager";
import { ErrorState } from "@/components/ui/states";
import { getAdminCertificates } from "@/lib/services/certificates";

async function CertificatesContent() {
  await connection();

  let certificates: Awaited<ReturnType<typeof getAdminCertificates>> = [];
  let error: string | null = null;

  try {
    certificates = await getAdminCertificates();
  } catch (cause) {
    error =
      cause instanceof Error
        ? cause.message
        : "Check your Supabase connection and RLS policies.";
  }

  if (error) {
    return (
      <ErrorState title="Could not load certificates" description={error} />
    );
  }

  return <CertificateManager certificates={certificates} />;
}

export default function AdminCertificatesPage() {
  return (
    <Suspense fallback={<AdminLoading />}>
      <CertificatesContent />
    </Suspense>
  );
}
