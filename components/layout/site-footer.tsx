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
				<div className='grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]'>
					<div className='max-w-sm'>
						<div className='flex items-center gap-2.5'>
							<span className='flex h-8 w-8 items-center justify-center rounded-xl border border-white/15 bg-gradient-to-br from-indigo-500/30 to-purple-500/20 text-[11px] font-bold text-white'>
								{siteConfig.initials}
							</span>
							<span className='text-sm font-semibold text-white'>{siteConfig.name}</span>
						</div>
						{/* <p className="mt-4 text-sm leading-relaxed text-gray-500">
              {siteConfig.tagline}
            </p> */}
						<a href={`mailto:${siteConfig.email}`} className='mt-4 inline-flex items-center gap-1.5 text-sm text-indigo-300 transition hover:text-indigo-200'>
							{siteConfig.email}
							<ArrowUpRight className='h-3.5 w-3.5' />
						</a>
					</div>

					<div>
						<p className='text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-500'><T k='footer.explore' /></p>
						<div className='mt-4 grid grid-cols-2 gap-2 text-sm'>
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

					<div>
						<p className='text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-500'><T k='footer.elsewhere' /></p>
						<div className='mt-4 space-y-2.5'>
							{siteConfig.socials.map((social) => (
								<a key={social.platform} href={social.href} target='_blank' rel='noopener noreferrer' className='group flex items-center gap-2.5 text-sm text-gray-400 transition hover:text-white'>
									<span className='flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-gray-400 transition group-hover:border-indigo-400/30 group-hover:text-indigo-300'>
										<PlatformIcon platform={social.platform} className='h-3.5 w-3.5' />
									</span>
									{social.label}
									<ArrowUpRight className='h-3 w-3 opacity-0 transition group-hover:opacity-100' />
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
