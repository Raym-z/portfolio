import { Suspense } from "react";
import { AdminLoading } from "@/components/admin/admin-loading";
import { AdminOverview } from "@/components/admin/overview";

export default function AdminPage() {
  return (
    <Suspense fallback={<AdminLoading />}>
      <AdminOverview />
    </Suspense>
  );
}
