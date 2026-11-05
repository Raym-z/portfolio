import { Spinner } from "@/components/ui/states";

export default function Loading() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-[#030014]">
      <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-sm text-gray-400">
        <Spinner />
        Loading...
      </div>
    </div>
  );
}
