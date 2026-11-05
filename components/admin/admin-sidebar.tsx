"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Award, ChevronRight, ExternalLink, FolderGit2, LayoutDashboard, LogOut, Mail, Menu, MessageSquare, UserCircle2, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { adminSignOut } from "@/app/admin/actions";
import { cn } from "@/lib/utils/cn";
import type { Profile } from "@/types";

const navItems = [
	{ href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
	{ href: "/admin/projects", label: "Projects", icon: FolderGit2 },
	{ href: "/admin/certificates", label: "Research", icon: Award },
	{ href: "/admin/comments", label: "Comments", icon: MessageSquare },
	{ href: "/admin/messages", label: "Messages", icon: Mail },
];

export function AdminSidebar({ profile }: { profile: Profile }) {
	const pathname = usePathname();
	const [open, setOpen] = useState(false);
	const [pending, startTransition] = useTransition();

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

	const isActive = (href: string, exact?: boolean) => (exact ? pathname === href : pathname.startsWith(href));

	const content = (
		<div className='flex h-full flex-col gap-6 p-5'>
			<Link href='/admin' className='flex items-center gap-3 px-1'>
				<span className='relative flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 bg-[#030014] text-indigo-400'>
					<span className='absolute -inset-0.5 -z-10 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 opacity-50 blur' />
					<LayoutDashboard className='h-4 w-4' />
				</span>
				<span>
					<span className='block text-sm font-semibold text-white'>Dashboard</span>
					<span className='block text-[10px] text-gray-500'>Admin panel</span>
				</span>
			</Link>

			<div className='flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-500/10 px-3 py-2'>
				<span className='h-1.5 w-1.5 animate-pulse rounded-full bg-indigo-400' />
				<span className='text-[10px] font-medium text-indigo-300'>Portfolio manager</span>
			</div>

			<nav className='flex-1 space-y-1'>
				<p className='mb-2 px-3 text-[9px] uppercase tracking-[0.2em] text-gray-600'>Menu</p>
				{navItems.map((item) => {
					const active = isActive(item.href, item.exact);
					return (
						<Link
							key={item.href}
							href={item.href}
							onClick={() => setOpen(false)}
							className={cn(
								"flex items-center gap-3 rounded-xl border px-3 py-2.5 text-sm font-medium transition-all duration-200",
								active ? "border-indigo-500/30 bg-gradient-to-r from-indigo-500/20 to-purple-500/10 text-white" : "border-transparent text-gray-400 hover:bg-white/5 hover:text-gray-200",
							)}
						>
							<item.icon className={cn("h-4 w-4 shrink-0", active ? "text-indigo-400" : "")} />
							{item.label}
							{active && <span className='ml-auto h-1.5 w-1.5 rounded-full bg-indigo-400' />}
						</Link>
					);
				})}
			</nav>

			<div className='space-y-3 border-t border-white/[0.07] pt-4'>
				<div className='flex items-center gap-2.5 rounded-xl border border-white/[0.07] bg-white/[0.025] p-3'>
					<span className='flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500/30 to-purple-500/20 text-[10px] font-semibold text-white'>
						{profile.fullName
							? profile.fullName
									.split(" ")
									.map((part) => part[0])
									.join("")
									.slice(0, 2)
									.toUpperCase()
							: "AD"}
					</span>
					<div className='min-w-0 flex-1'>
						<p className='truncate text-[11px] font-medium text-white'>{profile.fullName || "Administrator"}</p>
						<p className='truncate text-[9px] text-gray-500'>{profile.email ?? "admin"}</p>
					</div>
					<UserCircle2 className='h-4 w-4 shrink-0 text-indigo-400' />
				</div>

				<Link href='/' target='_blank' className='flex items-center gap-3 rounded-xl px-3 py-2 text-xs text-gray-500 transition hover:bg-white/5 hover:text-white'>
					<ExternalLink className='h-4 w-4' />
					View website
					<ChevronRight className='ml-auto h-3.5 w-3.5' />
				</Link>

				<button
					type='button'
					disabled={pending}
					onClick={() => startTransition(() => adminSignOut())}
					className='flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs text-gray-500 transition hover:bg-red-500/5 hover:text-red-400 disabled:opacity-60'
				>
					<LogOut className='h-4 w-4' />
					{pending ? "Signing out..." : "Sign out"}
				</button>
			</div>
		</div>
	);

	return (
		<>
			<aside className='sticky top-0 hidden h-dvh w-60 shrink-0 border-r border-white/[0.07] bg-white/[0.02] backdrop-blur-xl lg:block'>{content}</aside>

			<div className='sticky top-0 z-40 flex items-center justify-between gap-3 border-b border-white/[0.07] bg-[#05051a]/90 px-4 py-3 backdrop-blur-xl lg:hidden'>
				<button type='button' onClick={() => setOpen(true)} className='flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-gray-400' aria-label='Open navigation'>
					<Menu className='h-4 w-4' />
				</button>
				<span className='text-sm font-medium text-white'>Dashboard</span>
				<Link href='/' className='flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-gray-400' aria-label='View website'>
					<ExternalLink className='h-4 w-4' />
				</Link>
			</div>

			<AnimatePresence>
				{open && (
					<div className='fixed inset-0 z-[70] lg:hidden'>
						<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className='absolute inset-0 bg-black/70 backdrop-blur-sm' onClick={() => setOpen(false)} />
						<motion.aside
							initial={{ x: "-100%" }}
							animate={{ x: 0 }}
							exit={{ x: "-100%" }}
							transition={{ type: "spring", stiffness: 320, damping: 32 }}
							className='relative h-full w-64 border-r border-white/[0.07] bg-[#08081a]'
						>
							<button type='button' onClick={() => setOpen(false)} className='absolute right-3 top-3 rounded-lg p-1.5 text-gray-500 hover:text-white' aria-label='Close navigation'>
								<X className='h-4 w-4' />
							</button>
							{content}
						</motion.aside>
					</div>
				)}
			</AnimatePresence>
		</>
	);
}
