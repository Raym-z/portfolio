import { ArrowUpRight, Lock } from "lucide-react";
import Link from "next/link";
import { PlatformIcon } from "@/components/ui/platform-icon";
import { T } from "@/components/ui/translated-text";
import { siteConfig } from "@/lib/site-config";

const currentYear = new Date().getFullYear();

export function SiteFooter() {
	return (
		<footer className='relative mt-24 border-t border-white/[0.06]'>
			<div className='section-shell py-12'>
				<div className='grid grid-cols-[1.15fr_1fr_1fr] gap-x-3 gap-y-8 md:grid-cols-[1.4fr_1fr_1fr] md:gap-10'>
					<div className='min-w-0 max-w-sm'>
						<div className='flex items-center gap-2'>
							<span className='flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-gradient-to-br from-indigo-500/30 to-purple-500/20 text-[11px] font-bold text-white'>
								{siteConfig.initials}
							</span>
							<span className='text-[11px] font-semibold leading-tight text-white sm:text-sm'>{siteConfig.name}</span>
						</div>
						<a href={`mailto:${siteConfig.email}`} className='mt-3 inline-flex items-start gap-1 text-[10px] leading-relaxed break-all text-indigo-300 transition hover:text-indigo-200 sm:mt-4 sm:text-sm'>
							{siteConfig.email}
							<ArrowUpRight className='mt-0.5 hidden h-3 w-3 shrink-0 sm:inline' />
						</a>
					</div>

					<div className='min-w-0'>
						<p className='text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-500 sm:text-[11px] sm:tracking-[0.18em]'><T k='footer.explore' /></p>
						<div className='mt-3 grid grid-cols-1 gap-1.5 text-xs sm:mt-4 sm:text-sm md:grid-cols-2 md:gap-2'>
							{siteConfig.nav.map((item) => (
								<Link key={item.href} href={`/${item.href}`} className='text-gray-400 transition hover:text-white'>
									<T k={item.labelKey} />
								</Link>
							))}
							<Link href='/projects' className='text-gray-400 transition hover:text-white'>
								<T k='common.allProjects' />
							</Link>
						</div>
					</div>

					<div className='min-w-0'>
						<p className='text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-500 sm:text-[11px] sm:tracking-[0.18em]'><T k='footer.elsewhere' /></p>
						<div className='mt-3 space-y-2 sm:mt-4 sm:space-y-2.5'>
							{siteConfig.socials.map((social) => (
								<a key={social.platform} href={social.href} target='_blank' rel='noopener noreferrer' className='group flex items-center gap-2 text-xs text-gray-400 transition hover:text-white sm:gap-2.5 sm:text-sm'>
									<span className='flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-gray-400 transition group-hover:border-indigo-400/30 group-hover:text-indigo-300 sm:h-7 sm:w-7'>
										<PlatformIcon platform={social.platform} className='h-3 w-3 sm:h-3.5 sm:w-3.5' />
									</span>
									{social.label}
									<ArrowUpRight className='hidden h-3 w-3 opacity-0 transition group-hover:opacity-100 md:inline' />
								</a>
							))}
						</div>
					</div>
				</div>

				<div className='mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/[0.06] pt-6 text-xs text-gray-600 sm:flex-row'>
					<p>
						<T k='footer.rights' vars={{ year: currentYear, name: siteConfig.name }} />
					</p>
					<div className='flex items-center gap-4'>
						{/* <span>Built with Next.js, Supabase &amp; Tailwind CSS</span> */}
						<Link href='/login' className='inline-flex items-center gap-1 transition hover:text-gray-300'>
							<Lock className='h-3 w-3' /> <T k='nav.admin' />
						</Link>
					</div>
				</div>
			</div>
		</footer>
	);
}
