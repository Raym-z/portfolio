"use client";

import { motion } from "framer-motion";
import { ArrowRight, Mail, MousePointer2, Sparkles } from "lucide-react";
import { DeveloperIllustration } from "@/components/home/developer-illustration";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { useMemo } from "react";
import { useTypewriter } from "@/hooks/use-typewriter";
import { siteConfig } from "@/lib/site-config";
import { useI18n } from "@/lib/i18n/provider";

const fadeUp = {
	hidden: { opacity: 0, y: 24 },
	visible: { opacity: 1, y: 0 },
};

export function Hero() {
	const { t, tList } = useI18n();
	const titles = useMemo(() => tList("hero.titles"), [tList]);
	const typed = useTypewriter(titles);
	const role = t("hero.role");
	const roleParts = role.split(" ");
	const lastWord = roleParts.pop() ?? role;
	const firstPart = roleParts.join(" ");

	return (
		<section id='home' className='relative flex min-h-[100svh] scroll-mt-24 items-center overflow-hidden pb-16 pt-28 sm:pt-32'>
			<div className='pointer-events-none absolute left-1/2 top-1/3 -z-10 h-64 w-64 -translate-x-1/2 rounded-full bg-indigo-500/10 blur-[110px] sm:h-96 sm:w-96' />

			<div className='section-shell grid w-full items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8'>
				<motion.div initial='hidden' animate='visible' transition={{ staggerChildren: 0.09, delayChildren: 0.1 }} className='order-1 max-w-2xl'>
					<motion.div variants={fadeUp} transition={{ duration: 0.5 }}>
						<Badge variant='indigo' className='gap-2 px-3 py-1.5 text-xs'>
							<Sparkles className='h-3.5 w-3.5 text-indigo-300' />
							{t("hero.badge")}
							<span className='ml-1 flex h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]' />
						</Badge>
					</motion.div>

					<motion.h1 variants={fadeUp} transition={{ duration: 0.6 }} className='mt-6 text-[2.75rem] font-bold leading-[1.02] tracking-[-0.035em] sm:text-6xl lg:text-[4.4rem]'>
						<span className='block text-white'>{firstPart}</span>
						<span className='block text-gradient'>{lastWord}</span>
					</motion.h1>

					<motion.div variants={fadeUp} transition={{ duration: 0.6 }} className='mt-5 flex h-7 items-center text-base text-gray-400 sm:text-lg'>
						<span className='mr-2 text-gray-600'>{t("hero.greeting")}</span>
						<span className='font-light text-gray-200'>{typed}</span>
						<span className='ml-1 h-5 w-[2px] animate-blink bg-gradient-to-t from-indigo-400 to-purple-400' />
					</motion.div>

					<motion.p variants={fadeUp} transition={{ duration: 0.6 }} className='mt-5 max-w-xl text-sm leading-relaxed text-gray-400 sm:text-base'>
						{t("hero.summary")}
					</motion.p>

					<motion.div variants={fadeUp} transition={{ duration: 0.6 }} className='mt-6 flex flex-wrap gap-2'>
						{siteConfig.hero.tech.map((tech) => (
							<span
								key={tech}
								className='rounded-full border border-white/10 bg-white/[0.045] px-3 py-1.5 text-xs text-gray-300 backdrop-blur transition hover:border-indigo-400/30 hover:bg-white/[0.07] hover:text-white'
							>
								{tech}
							</span>
						))}
					</motion.div>

					<motion.div variants={fadeUp} transition={{ duration: 0.6 }} className='mt-8 flex items-center gap-2 sm:flex-wrap sm:gap-3'>
						<ButtonLink href='#projects' size='lg' className='min-w-0 flex-1 gap-2 whitespace-nowrap px-4 text-xs sm:flex-none sm:gap-2.5 sm:px-7 sm:text-sm' icon={<ArrowRight className='h-4 w-4 transition-transform group-hover:translate-x-1' />}>
							{t("common.viewProjects")}
						</ButtonLink>
						<ButtonLink href='#contact' variant='secondary' size='lg' className='min-w-0 flex-1 gap-2 whitespace-nowrap px-4 text-xs sm:flex-none sm:gap-2.5 sm:px-7 sm:text-sm' icon={<Mail className='h-4 w-4' />}>
							{t("hero.contactMe")}
						</ButtonLink>
						{/* <Link
              href="/projects"
              className="group ml-1 inline-flex items-center gap-1.5 text-sm text-gray-500 transition hover:text-white"
            >
              Browse all
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link> */}
					</motion.div>

					{/* <motion.div variants={fadeUp} transition={{ duration: 0.6 }} className='mt-8 flex items-center gap-2.5'>
						<span className='text-[11px] uppercase tracking-[0.18em] text-gray-600'>{t("hero.findMe")}</span>
						<span className='h-px w-6 bg-white/10' />
						{siteConfig.socials.map((social) => (
							<a
								key={social.platform}
								href={social.href}
								target='_blank'
								rel='noopener noreferrer'
								aria-label={social.label}
								className='group relative flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-gray-400 transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-400/35 hover:text-white'
							>
								<span className='absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500/20 to-purple-500/20 opacity-0 blur transition group-hover:opacity-100' />
								<PlatformIcon platform={social.platform} className='relative h-4 w-4' />
							</a>
						))}
					</motion.div> */}
				</motion.div>

				<motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, delay: 0.25 }} className='order-2 lg:pl-6'>
					<DeveloperIllustration />
				</motion.div>
			</div>

			<div className='absolute bottom-6 left-1/2 hidden -translate-x-1/2 items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-gray-600 sm:flex'>
				<MousePointer2 className='h-3.5 w-3.5' />
				{t("hero.scroll")}
			</div>
		</section>
	);
}
