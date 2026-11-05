"use client";

import { AlertCircle, ArrowUpRight, CheckCircle2, Clock, Copy, Mail, MapPin, MessageSquare, Send, Sparkles, User } from "lucide-react";
import { useState } from "react";
import { submitContactMessage } from "@/app/actions/contact";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/field";
import { PlatformIcon } from "@/components/ui/platform-icon";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { siteConfig, isSupabaseConfigured } from "@/lib/site-config";
import { toast } from "@/lib/utils/notify";

export function ContactSection() {
	const [form, setForm] = useState({ name: "", email: "", message: "", website: "" });
	const [pending, setPending] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [copied, setCopied] = useState(false);

	const update = (key: keyof typeof form) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		setForm((current) => ({ ...current, [key]: event.target.value }));
	};

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setError(null);
		setPending(true);

		try {
			const result = await submitContactMessage(form);

			if (!result.success) {
				setError(result.error);
				await toast({ title: "Message not sent", text: result.error, icon: "error" });
				return;
			}

			setForm({ name: "", email: "", message: "", website: "" });
			await toast({
				title: "Message sent",
				text: result.message ?? "I'll get back to you soon.",
			});
		} catch {
			setError("Could not send your message. Please try again.");
		} finally {
			setPending(false);
		}
	};

	const copyEmail = async () => {
		try {
			await navigator.clipboard.writeText(siteConfig.email);
			setCopied(true);
			window.setTimeout(() => setCopied(false), 1800);
			await toast({ title: "Email copied", text: siteConfig.email });
		} catch {
			await toast({
				title: "Could not copy email",
				text: siteConfig.email,
				icon: "error",
			});
		}
	};

	return (
		<section id='contact' className='section-shell scroll-mt-24 py-12 sm:py-14'>
			<Reveal>
				<SectionHeading
					eyebrow='Contact'
					title={
						<>
							Let&apos;s build something <span className='text-gradient'>worth using</span>
						</>
					}
					description="Have a project, a role, or an idea worth exploring? Send a message and I'll reply as soon as I can."
				/>
			</Reveal>

			<div className='mt-10 grid gap-5 lg:grid-cols-[1.05fr_0.95fr]'>
				<Reveal direction='left' distance={80} className='min-w-0'>
					<div className='rounded-2xl border border-white/10 bg-white/[0.035] p-5 backdrop-blur-xl sm:p-7'>
						<div className='flex items-start justify-between gap-4'>
							<div>
								<h3 className='text-lg font-semibold text-white'>Send a message</h3>
								<p className='mt-1 text-xs text-gray-500'>I usually reply within one business day.</p>
							</div>
							<span className='flex h-9 w-9 items-center justify-center rounded-xl border border-indigo-400/20 bg-indigo-500/10'>
								<MessageSquare className='h-4 w-4 text-indigo-300' />
							</span>
						</div>

						<form onSubmit={handleSubmit} className='mt-6 space-y-4'>
							<div className='grid gap-4 sm:grid-cols-2'>
								<Field label='Your name' required>
									<div className='relative'>
										<User className='pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-gray-500' />
										<Input value={form.name} onChange={update("name")} placeholder='Your Name' className='pl-10' autoComplete='name' required />
									</div>
								</Field>
								<Field label='Your email' required>
									<div className='relative'>
										<Mail className='pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-gray-500' />
										<Input type='email' value={form.email} onChange={update("email")} placeholder='you@company.com' className='pl-10' autoComplete='email' required />
									</div>
								</Field>
							</div>

							<Field label='Message' required hint={`${form.message.length}/2000`}>
								<Textarea
									value={form.message}
									onChange={update("message")}
									placeholder='Tell me a little about the project, timeline, and what success looks like...'
									rows={6}
									maxLength={2000}
									required
								/>
							</Field>

							<div className='hidden' aria-hidden='true'>
								<label>
									Website
									<input tabIndex={-1} autoComplete='off' value={form.website} onChange={update("website")} />
								</label>
							</div>

							{error && (
								<div className='flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-300'>
									<AlertCircle className='mt-0.5 h-4 w-4 shrink-0' />
									<p>{error}</p>
								</div>
							)}

							{!isSupabaseConfigured && (
								<div className='flex items-start gap-2 rounded-xl border border-amber-500/20 bg-amber-500/[0.07] p-3 text-[11px] leading-relaxed text-amber-200/80'>
									<AlertCircle className='mt-0.5 h-4 w-4 shrink-0' />
									The form needs Supabase credentials. Until then, use the email button on the right.
								</div>
							)}

							<Button type='submit' className='w-full' size='lg' loading={pending} disabled={!isSupabaseConfigured} icon={<Send className='h-4 w-4' />}>
								{pending ? "Sending..." : "Send message"}
							</Button>
						</form>
					</div>
				</Reveal>

				<div className='min-w-0 space-y-5'>
					<Reveal delay={0.06} direction='right' distance={80}>
						<div className='relative overflow-hidden rounded-2xl border border-indigo-400/20 bg-gradient-to-br from-indigo-500/[0.12] via-[#08081b] to-purple-500/[0.09] p-5 sm:p-6'>
							<div className='absolute -right-10 -top-10 h-32 w-32 rounded-full bg-indigo-500/20 blur-3xl' />
							<div className='relative'>
								<Badge variant='green' className='gap-1.5'>
									<span className='h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400' />
									Available for work
								</Badge>
								<h3 className='mt-4 text-xl font-semibold text-white'>Prefer email?</h3>
								<p className='mt-2 text-xs leading-relaxed text-gray-400'>Reach out directly and I&apos;ll get back to you from a real inbox, not a no-reply address.</p>

								<div className='mt-5 flex items-center gap-2 rounded-xl border border-white/10 bg-black/25 p-2 pl-4'>
									<span className='min-w-0 flex-1 truncate text-sm text-gray-200'>{siteConfig.email}</span>
									<button
										type='button'
										onClick={copyEmail}
										className='flex h-8 shrink-0 items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-2.5 text-[10px] text-gray-300 transition hover:bg-white/[0.08] hover:text-white'
									>
										{copied ? <CheckCircle2 className='h-3.5 w-3.5 text-emerald-400' /> : <Copy className='h-3.5 w-3.5' />}
										{copied ? "Copied" : "Copy"}
									</button>
								</div>

								<div className='mt-3 flex flex-wrap gap-2'>
									<a
										href={`mailto:${siteConfig.email}`}
										className='group inline-flex h-10 items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 px-4 text-xs font-semibold text-white transition hover:brightness-110'
									>
										<Mail className='h-4 w-4' />
										Email me
										<ArrowUpRight className='h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5' />
									</a>
									<span className='inline-flex h-10 items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.03] px-3 text-[11px] text-gray-400'>
										<Clock className='h-3.5 w-3.5 text-indigo-300' />
										Replies in &lt; 24h
									</span>
								</div>
							</div>
						</div>
					</Reveal>

					<Reveal delay={0.12} direction='right' distance={80}>
						<div className='rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6'>
							<div className='flex items-center justify-between'>
								<h3 className='text-sm font-semibold text-white'>Find me elsewhere</h3>
								<Sparkles className='h-4 w-4 text-purple-400' />
							</div>
							<div className='mt-4 grid gap-2 sm:grid-cols-2'>
								{siteConfig.socials.map((social) => (
									<a
										key={social.platform}
										href={social.href}
										target='_blank'
										rel='noopener noreferrer'
										aria-label={`Open ${social.label} — ${social.handle}`}
										title='Opens in a new tab'
										className='group flex items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.025] p-3 transition hover:border-indigo-400/30 hover:bg-white/[0.05]'
									>
										<span className='flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-gray-400 transition group-hover:text-indigo-300'>
											<PlatformIcon platform={social.platform} className='h-4 w-4' />
										</span>
										<span className='min-w-0 flex-1'>
											<span className='block truncate text-xs font-medium text-gray-200'>{social.label}</span>
											<span className='mt-0.5 block truncate font-mono text-[10px] text-indigo-300/80'>{social.handle}</span>
										</span>
										{/* <span className='min-w-0 flex-1'>
											<span className='block truncate text-xs font-medium text-gray-200'>{social.label}</span>
											<span className='block text-[10px] text-gray-600'></span>
										</span> */}
										<ArrowUpRight className='h-3.5 w-3.5 text-gray-600 transition group-hover:text-white' />
									</a>
								))}
							</div>

							<div className='mt-4 flex items-center gap-2 border-t border-white/[0.07] pt-4 text-[11px] text-gray-500'>
								<MapPin className='h-3.5 w-3.5 text-indigo-400' />
								{siteConfig.location}
							</div>
						</div>
					</Reveal>
				</div>
			</div>
		</section>
	);
}
