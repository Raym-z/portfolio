"use client";

import { motion } from "framer-motion";
import { Code2, Globe, User } from "lucide-react";
import { useEffect, useState } from "react";
import { GithubIcon } from "@/components/ui/brand-icons";
import { useI18n } from "@/lib/i18n/provider";

const introIcons = [Code2, User, GithubIcon];

function useTypedText(text: string, start: boolean, speed = 60) {
	const [typed, setTyped] = useState("");

	useEffect(() => {
		if (!start || !text) return;

		let index = 0;
		const timer = window.setInterval(() => {
			index += 1;
			setTyped(text.slice(0, index));
			if (index >= text.length) window.clearInterval(timer);
		}, speed);

		return () => window.clearInterval(timer);
	}, [text, start, speed]);

	return typed;
}

export function WelcomeOverlay() {
	const { t } = useI18n();
	const [host] = useState(() => (typeof window === "undefined" ? "" : window.location.host.replace(/^www\./, "")));
	const [typing, setTyping] = useState(false);

	useEffect(() => {
		const timer = window.setTimeout(() => setTyping(true), 1100);
		return () => window.clearTimeout(timer);
	}, []);

	const typed = useTypedText(host, typing);

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0, scale: 1.03, filter: "blur(10px)" }}
			transition={{ duration: 0.6, ease: "easeInOut" }}
			className='fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[#140a2f] px-4'
		>
			<div className='pointer-events-none absolute inset-0'>
				<div className='absolute left-1/2 top-1/2 h-[42rem] w-[42rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.22),transparent_62%)]' />
				<div className='absolute left-1/2 top-[38%] h-72 w-72 -translate-x-1/2 rounded-full bg-purple-600/20 blur-[110px]' />
				<div className='absolute bottom-0 right-0 h-80 w-80 rounded-full bg-indigo-600/15 blur-[120px]' />
				<div className='grid-overlay absolute inset-0 opacity-25' />
				<div className='absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(10,4,28,0.75)_100%)]' />
			</div>

			<div className='relative w-full max-w-3xl text-center'>
				<div className='flex justify-center gap-4'>
					{introIcons.map((Icon, index) => (
						<motion.div
							key={index}
							initial={{ opacity: 0, y: -18, scale: 0.85 }}
							animate={{ opacity: 1, y: 0, scale: 1 }}
							transition={{
								delay: 0.15 + index * 0.12,
								duration: 0.5,
								ease: [0.22, 1, 0.36, 1],
							}}
							className='relative'
						>
							<div className='absolute -inset-1 rounded-full bg-indigo-500/40 blur-xl' />
							<div className='relative flex h-14 w-14 items-center justify-center rounded-full border border-indigo-300/15 bg-[#251644] shadow-[0_0_30px_rgba(99,102,241,0.35)]'>
								<Icon className='h-6 w-6 text-[#e9e6f5]' />
							</div>
						</motion.div>
					))}
				</div>

				<h1 className='mt-10 text-[2.6rem] font-extrabold leading-[1.06] tracking-[-0.03em] sm:text-6xl lg:text-7xl'>
					<motion.span initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.6, ease: [0.22, 1, 0.36, 1] }} className='block text-[#f5f3ff]'>
						{t("intro.welcome")}
					</motion.span>
					<motion.span
						initial={{ opacity: 0, y: 18 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.45, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
						className='mt-1 block bg-gradient-to-r from-indigo-400 via-purple-500 to-fuchsia-400 bg-clip-text pb-1 text-transparent drop-shadow-[0_0_28px_rgba(139,92,246,0.35)]'
					>
						{t("intro.portfolio")}
					</motion.span>
				</h1>

				<motion.div
					initial={{ opacity: 0, y: 12 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.9, duration: 0.5 }}
					className='mt-12 flex items-center justify-center gap-2 text-base font-medium text-indigo-300/90 sm:text-lg'
				>
					<Globe className='h-4 w-4 sm:h-5 sm:w-5' />
					<span className='drop-shadow-[0_0_18px_rgba(139,92,246,0.9)]'>
						{typed}
						<span className='ml-0.5 inline-block h-[1.05em] w-[2px] translate-y-[2px] animate-blink rounded-full bg-indigo-300 align-middle' />
					</span>
				</motion.div>
			</div>
		</motion.div>
	);
}
