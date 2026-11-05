import { Skeleton } from "@/components/ui/states";

export default function Loading() {
  return (
    <div className="section-shell pb-20 pt-24 sm:pt-28">
      <Skeleton className="h-9 w-48" />
      <div className="mt-8 grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-4">
          <Skeleton className="h-6 w-56 rounded-full" />
          <Skeleton className="h-12 w-full max-w-lg" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <div className="flex gap-3">
            <Skeleton className="h-12 w-28 rounded-xl" />
            <Skeleton className="h-12 w-28 rounded-xl" />
          </div>
          <Skeleton className="h-32 w-full rounded-2xl" />
        </div>
        <div className="space-y-4">
          <Skeleton className="aspect-[16/10] w-full rounded-2xl" />
          <Skeleton className="h-52 w-full rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
