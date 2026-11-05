"use client";

import { motion } from "framer-motion";
import { Braces, CheckCircle2, GitBranch, Layers3, Sparkles, Terminal } from "lucide-react";
import { useI18n } from "@/lib/i18n/provider";

const codeLines = [
	{ width: "42%", color: "bg-indigo-400/80" },
	{ width: "68%", color: "bg-purple-400/70" },
	{ width: "54%", color: "bg-cyan-400/60" },
	{ width: "76%", color: "bg-white/25" },
	{ width: "36%", color: "bg-emerald-400/70" },
	{ width: "62%", color: "bg-white/20" },
	{ width: "48%", color: "bg-indigo-400/60" },
];

export function DeveloperIllustration() {
	const { t } = useI18n();

	return (
		<div className='relative mx-auto flex w-full max-w-lg items-center justify-center'>
			<div className='absolute inset-0 -z-10 flex items-center justify-center'>
				<div className='h-[24rem] w-[24rem] rounded-full bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-transparent blur-3xl sm:h-[30rem] sm:w-[30rem]' />
			</div>

			<motion.div
				aria-hidden='true'
				animate={{ rotate: 360 }}
				transition={{ repeat: Infinity, duration: 28, ease: "linear" }}
				className='absolute h-[19rem] w-[19rem] rounded-full border border-dashed border-white/10 sm:h-[26rem] sm:w-[26rem]'
			>
				<span className='absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-indigo-400 shadow-[0_0_20px_rgba(129,140,248,0.8)]' />
				<span className='absolute bottom-6 right-10 h-2 w-2 rounded-full bg-purple-400 shadow-[0_0_18px_rgba(192,132,252,0.8)]' />
			</motion.div>

			<motion.div
				initial={{ opacity: 0, y: 26 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.8, ease: "easeOut" }}
				className='relative w-[88%] rounded-2xl border border-white/12 bg-[#08081b]/90 shadow-[0_40px_120px_-40px_rgba(99,102,241,0.65)] backdrop-blur-2xl'
			>
				<div className='flex items-center justify-between border-b border-white/[0.07] px-4 py-3'>
					<div className='flex items-center gap-1.5'>
						<span className='h-2.5 w-2.5 rounded-full bg-red-400/80' />
						<span className='h-2.5 w-2.5 rounded-full bg-amber-400/80' />
						<span className='h-2.5 w-2.5 rounded-full bg-emerald-400/80' />
					</div>
					<div className='flex items-center gap-1.5 rounded-md border border-white/[0.07] bg-white/[0.03] px-2 py-1 text-[10px] text-gray-500'>
						<Braces className='h-3 w-3 text-indigo-400' />
						portfolio.tsx
					</div>
					<Terminal className='h-3.5 w-3.5 text-gray-600' />
				</div>

				<div className='space-y-2.5 p-5 sm:p-6'>
					<div className='flex items-center gap-2 text-[11px] text-gray-500'>
						<span className='text-purple-400'>const</span>
						<span className='text-cyan-300'>developer</span>
						<span className='text-gray-500'>=</span>
						<span className='text-amber-300'>{"{"}</span>
					</div>

					{codeLines.map((line, index) => (
						<motion.div key={index} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 + index * 0.08 }} className='flex items-center gap-3 pl-4'>
							<span className='w-4 text-right text-[9px] tabular-nums text-gray-700'>{index + 1}</span>
							<span className={`h-2 rounded-full ${line.color}`} style={{ width: line.width }} />
						</motion.div>
					))}

					<div className='pl-4 text-[11px] text-amber-300'>{"}"}</div>

					<div className='mt-4 flex items-center justify-between rounded-xl border border-white/[0.07] bg-white/[0.025] px-3 py-2.5'>
						<div className='flex items-center gap-2'>
							<span className='flex h-6 w-6 items-center justify-center rounded-md bg-emerald-500/15'>
								<CheckCircle2 className='h-3.5 w-3.5 text-emerald-400' />
							</span>
							<div>
								<p className='text-[10px] font-medium text-gray-200'>{t("illustration.buildPassing")}</p>
								<p className='text-[9px] text-gray-600'>main · 2s ago</p>
							</div>
						</div>
						<span className='rounded-full border border-emerald-400/20 bg-emerald-500/10 px-2 py-0.5 text-[9px] font-medium text-emerald-300'>{t("illustration.deployed")}</span>
					</div>
				</div>
			</motion.div>

			<motion.div
				initial={{ opacity: 0, x: 18 }}
				animate={{ opacity: 1, x: 0 }}
				transition={{ delay: 0.7 }}
				className='absolute -right-1 top-8 flex items-center gap-2 rounded-xl border border-white/10 bg-[#0a0a20]/90 px-3 py-2 shadow-xl backdrop-blur-xl sm:-right-4 sm:top-12'
			>
				<span className='flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/15'>
					<Layers3 className='h-3.5 w-3.5 text-indigo-300' />
				</span>
				<div>
					<p className='text-[10px] font-medium text-white'>{t("illustration.designSystems")}</p>
					<p className='text-[9px] text-gray-500'>{t("illustration.scalable")}</p>
				</div>
			</motion.div>

			<motion.div
				initial={{ opacity: 0, x: -18 }}
				animate={{ opacity: 1, x: 0 }}
				transition={{ delay: 0.9 }}
				className='absolute -left-1 -bottom-5 flex items-center gap-2 rounded-xl border border-white/10 bg-[#0a0a20]/90 px-3 py-2 shadow-xl backdrop-blur-xl sm:-left-4 sm:-bottom-6'
			>
				<span className='flex h-7 w-7 items-center justify-center rounded-lg bg-purple-500/15'>
					<GitBranch className='h-3.5 w-3.5 text-purple-300' />
				</span>
				<div>
					<p className='text-[10px] font-medium text-white'>{t("illustration.shippingWeekly")}</p>
					<p className='text-[9px] text-gray-500'>{t("illustration.iterate")}</p>
				</div>
			</motion.div>

			<motion.div
				animate={{ y: [0, -10, 0] }}
				transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
				className='absolute -top-2 right-10 flex items-center gap-1.5 rounded-full border border-indigo-400/25 bg-indigo-500/10 px-2.5 py-1 text-[10px] font-medium text-indigo-200 backdrop-blur sm:right-16'
			>
				<Sparkles className='h-3 w-3' />
				{t("illustration.available")}
			</motion.div>
		</div>
	);
}
