export function AmbientBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[#030014]" />
      <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-purple-600/25 blur-[120px] sm:h-96 sm:w-96" />
      <div className="absolute -right-20 top-24 h-72 w-72 rounded-full bg-cyan-500/15 blur-[130px] sm:h-96 sm:w-96" />
      <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-indigo-600/20 blur-[130px] sm:h-96 sm:w-96" />
      <div className="absolute bottom-1/4 right-1/4 h-60 w-60 animate-pulse-slow rounded-full bg-fuchsia-500/10 blur-[110px]" />
      <div className="grid-overlay absolute inset-0 opacity-70" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,transparent_20%,#030014_78%)]" />
    </div>
  );
}
