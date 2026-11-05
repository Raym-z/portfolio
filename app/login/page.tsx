import type { Metadata } from "next";
import { Suspense } from "react";
import { AmbientBackground } from "@/components/layout/ambient-background";
import { LoginForm } from "@/components/admin/login-form";
import { Spinner } from "@/components/ui/states";

export const metadata: Metadata = {
  title: "Admin login",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <div className="relative flex min-h-dvh items-center justify-center px-4 py-10">
      <AmbientBackground />
      <div className="absolute left-1/2 top-24 h-72 w-72 -translate-x-1/2 rounded-full bg-indigo-600/10 blur-[120px]" />
      <Suspense
        fallback={
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-4 text-sm text-gray-400">
            <Spinner /> Preparing sign in...
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
