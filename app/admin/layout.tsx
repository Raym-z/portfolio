import { Suspense } from "react";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import { AmbientBackground } from "@/components/layout/ambient-background";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { Spinner } from "@/components/ui/states";
import { getCurrentProfile } from "@/lib/services/auth";

export const instant = false;

export const metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

async function AdminShell({ children }: { children: React.ReactNode }) {
  await connection();

  const profile = await getCurrentProfile();

  if (!profile) {
    redirect("/login?error=session");
  }

  if (profile.role !== "admin") {
    redirect("/login?error=forbidden");
  }

  return (
    <div className="flex min-h-dvh flex-col text-white lg:flex-row">
      <AdminSidebar profile={profile} />
      <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
    </div>
  );
}

function AdminFallback() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-[#030014]">
      <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-sm text-gray-400">
        <Spinner />
        Checking access...
      </div>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-dvh bg-[#030014]">
      <AmbientBackground />
      <div className="relative z-10">
        <Suspense fallback={<AdminFallback />}>
          <AdminShell>{children}</AdminShell>
        </Suspense>
      </div>
    </div>
  );
}
