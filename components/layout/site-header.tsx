"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Lock, Menu, Sparkles, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { siteConfig } from "@/lib/site-config";
import { LocaleToggle } from "@/components/ui/locale-toggle";
import { useI18n } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils/cn";

export function SiteHeader() {
	const pathname = usePathname();
	const { t } = useI18n();
	const [scrolled, setScrolled] = useState(false);
	const [open, setOpen] = useState(false);
	const [active, setActive] = useState("home");
	const isHome = pathname === "/";

	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > 24);
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	useEffect(() => {
		if (!isHome) return;

		const sectionIds = siteConfig.nav.map((item) => item.href.slice(1));
		let frame = 0;

		const updateActiveSection = () => {
			frame = 0;
			const marker = 140;
			let current = sectionIds[0] ?? "home";

			for (const id of sectionIds) {
				const section = document.getElementById(id);
				if (!section) continue;

				if (section.getBoundingClientRect().top <= marker) current = id;
			}

			const atPageBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;

			if (atPageBottom) {
				current = sectionIds[sectionIds.length - 1] ?? current;
			}

			setActive(current);
		};

		const onScroll = () => {
			if (!frame) frame = window.requestAnimationFrame(updateActiveSection);
		};

		updateActiveSection();
		window.addEventListener("scroll", onScroll, { passive: true });
		window.addEventListener("wheel", onScroll, { passive: true });
		window.addEventListener("touchmove", onScroll, { passive: true });
		window.addEventListener("resize", onScroll);
		document.addEventListener("scroll", onScroll, {
			passive: true,
			capture: true,
		});

		return () => {
			if (frame) window.cancelAnimationFrame(frame);
			window.removeEventListener("scroll", onScroll);
			window.removeEventListener("wheel", onScroll);
			window.removeEventListener("touchmove", onScroll);
			window.removeEventListener("resize", onScroll);
			document.removeEventListener("scroll", onScroll, { capture: true });
		};
	}, [isHome]);

	useEffect(() => {
		if (open) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}

		return () => {
			document.body.style.overflow = "";
		};
	}, [open]);

	const handleAnchor = (event: React.MouseEvent<HTMLAnchorElement>, href: string) => {
		setOpen(false);
		if (!isHome) return;
		const target = document.querySelector(href);
		if (!target) return;
		event.preventDefault();
		target.scrollIntoView({ behavior: "smooth", block: "start" });
	};

	return (
		<header
			className={cn(
				"fixed inset-x-0 top-0 z-50 transition-all duration-500",
				open ? "bg-[#05051a]/95 backdrop-blur-2xl" : scrolled ? "border-b border-white/[0.06] bg-[#030014]/75 backdrop-blur-2xl" : "bg-transparent",
			)}
		>
			<div className='section-shell flex h-16 items-center justify-between gap-4'>
				<Link href='/' onClick={() => setOpen(false)} className='group flex items-center gap-2.5' aria-label={`${siteConfig.name} home`}>
					<span className='max-w-[160px] truncate text-sm font-semibold tracking-tight text-white sm:max-w-[240px]'>{siteConfig.name}</span>
				</Link>

				<nav className='hidden items-center gap-1 lg:flex'>
					{siteConfig.nav.map((item) => {
						const section = item.href.replace("#", "");
						const isActive = isHome && active === section;

						return (
							<Link key={item.href} href={isHome ? item.href : `/${item.href}`} onClick={(event) => handleAnchor(event, item.href)} className='group relative px-3 py-2 text-[13px] font-medium'>
								<span className={cn("relative z-10 transition-colors", isActive ? "text-white" : "text-gray-400 group-hover:text-white")}>{t(item.labelKey)}</span>
								<span
									className={cn(
										"absolute inset-x-2 -bottom-0.5 h-px origin-left bg-gradient-to-r from-indigo-400 to-purple-400 transition-transform duration-300",
										isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
									)}
								/>
							</Link>
						);
					})}
				</nav>

				<div className='hidden items-center gap-2 lg:flex'>
					<LocaleToggle />
					<Link
						href='/login'
						className='flex h-9 items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-3 text-xs font-medium text-gray-300 transition hover:border-indigo-400/30 hover:bg-white/[0.07] hover:text-white'
					>
						<Lock className='h-3.5 w-3.5' />
						{t("nav.admin")}
					</Link>
					<Link
						href={isHome ? "#contact" : "/#contact"}
						onClick={(event) => handleAnchor(event, "#contact")}
						className='group relative flex h-9 items-center gap-1.5 overflow-hidden rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 px-4 text-xs font-semibold text-white shadow-[0_12px_30px_-14px_rgba(99,102,241,0.9)]'
					>
						<span className='absolute inset-0 -translate-x-[130%] skew-x-[-12deg] bg-white/25 transition-transform duration-700 group-hover:translate-x-[230%]' />
						<Sparkles className='relative h-3.5 w-3.5' />
						<span className='relative'>{t("nav.letsTalk")}</span>
					</Link>
				</div>

				<div className='flex items-center gap-2 lg:hidden'>
					<LocaleToggle />
					<button
						type='button'
						onClick={() => setOpen((value) => !value)}
						aria-label={open ? t("nav.closeMenu") : t("nav.openMenu")}
						aria-expanded={open}
						className='flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-gray-300 transition hover:text-white'
					>
						{open ? <X className='h-5 w-5' /> : <Menu className='h-5 w-5' />}
					</button>
				</div>
			</div>

			<AnimatePresence>
				{open && (
					<motion.div
						initial={{ height: 0, opacity: 0 }}
						animate={{ height: "auto", opacity: 1 }}
						exit={{ height: 0, opacity: 0 }}
						transition={{ duration: 0.25, ease: "easeInOut" }}
						className='overflow-hidden border-t border-white/[0.06] bg-[#05051a]/98 lg:hidden'
					>
						<div className='section-shell space-y-1 py-5'>
							{siteConfig.nav.map((item, index) => {
								const section = item.href.replace("#", "");
								const isActive = isHome && active === section;

								return (
									<motion.div key={item.href} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }}>
										<Link
											href={isHome ? item.href : `/${item.href}`}
											onClick={(event) => handleAnchor(event, item.href)}
											className={cn(
												"flex items-center justify-between rounded-xl px-4 py-3 text-base font-medium transition",
												isActive ? "bg-indigo-500/10 text-white" : "text-gray-400 hover:bg-white/5 hover:text-white",
											)}
										>
											{t(item.labelKey)}
											{isActive && <span className='h-1.5 w-1.5 rounded-full bg-indigo-400' />}
										</Link>
									</motion.div>
								);
							})}
							<div className='mt-4 flex gap-2 border-t border-white/[0.06] pt-4'>
								<Link
									href='/login'
									onClick={() => setOpen(false)}
									className='flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] py-3 text-sm text-gray-300'
								>
									<Lock className='h-4 w-4' /> {t("nav.admin")}
								</Link>
								<Link
									href={isHome ? "#contact" : "/#contact"}
									onClick={(event) => handleAnchor(event, "#contact")}
									className='flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 py-3 text-sm font-semibold text-white'
								>
									<Sparkles className='h-4 w-4' /> {t("nav.letsTalk")}
								</Link>
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</header>
	);
}
