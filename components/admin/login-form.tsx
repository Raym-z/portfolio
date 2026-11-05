"use client";

import { motion } from "framer-motion";
import { AlertCircle, ArrowLeft, Eye, EyeOff, Lock, Mail, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { getBrowserClient } from "@/lib/supabase/client";
import { isSupabaseConfigured, siteConfig } from "@/lib/site-config";
import { toast } from "@/lib/utils/notify";

export function LoginForm() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const redirectTo = searchParams.get("redirect") || "/admin";

	const authError = searchParams.get("error");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(
		authError === "forbidden" ? "This account does not have admin access." : authError === "session" ? "Your session expired. Please sign in again." : null,
	);

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setError(null);

		const supabase = getBrowserClient();
		if (!supabase) {
			setError("Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your environment.");
			return;
		}

		setLoading(true);

		try {
			const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });

			if (signInError) {
				setError(signInError.message);
				return;
			}

			const { data: profile } = await supabase.from("profiles").select("role").eq("id", data.user.id).maybeSingle();

			if (profile?.role !== "admin") {
				await supabase.auth.signOut();
				setError("This account does not have admin access.");
				return;
			}

			await toast({ title: "Welcome back", text: "Loading your dashboard." });
			router.replace(redirectTo);
			router.refresh();
		} catch {
			setError("Could not sign in. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className='relative z-10 grid w-full max-w-4xl overflow-hidden rounded-3xl border border-white/10 bg-[#08081a]/85 shadow-[0_60px_160px_-60px_rgba(99,102,241,0.7)] backdrop-blur-2xl lg:grid-cols-[0.95fr_1.05fr]'
		>
			<div className='relative hidden flex-col justify-between overflow-hidden border-r border-white/[0.06] p-8 lg:flex'>
				<div className='absolute -left-16 -top-16 h-56 w-56 rounded-full bg-indigo-500/20 blur-3xl' />
				<div className='absolute -bottom-20 -right-16 h-56 w-56 rounded-full bg-purple-500/20 blur-3xl' />

				<Link href='/' className='relative inline-flex items-center gap-2.5 text-sm font-semibold text-white'>
					<span className='flex h-8 w-8 items-center justify-center rounded-xl border border-white/15 bg-gradient-to-br from-indigo-500/30 to-purple-500/20 text-[11px]'>{siteConfig.initials}</span>
					{siteConfig.name}
				</Link>

				<div className='relative'>
					<div className='flex h-12 w-12 items-center justify-center rounded-2xl border border-indigo-400/25 bg-indigo-500/15'>
						<ShieldCheck className='h-5 w-5 text-indigo-300' />
					</div>
					<h1 className='mt-5 text-3xl font-bold leading-tight tracking-tight text-white'>
						Portfolio
						<br />
						<span className='text-gradient'>control room</span>
					</h1>
					<p className='mt-3 max-w-xs text-xs leading-relaxed text-gray-500'>Manage projects, certificates, comments, and messages from one focused workspace.</p>

					<div className='mt-6 space-y-2.5'>
						{["Publish and reorder projects", "Upload certificates with previews", "Pin and moderate comments"].map((item) => (
							<div key={item} className='flex items-center gap-2 text-[11px] text-gray-400'>
								<span className='h-1.5 w-1.5 rounded-full bg-indigo-400' />
								{item}
							</div>
						))}
					</div>
				</div>

				<p className='relative text-[10px] text-gray-600'>Protected by Supabase Auth and row-level security.</p>
			</div>

			<div className='p-6 sm:p-9'>
				<div className='flex items-center justify-between'>
					<span className='inline-flex items-center gap-1.5 rounded-full border border-indigo-400/20 bg-indigo-500/10 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-indigo-300'>
						<Sparkles className='h-3 w-3' />
						Admin portal
					</span>
					<Link href='/' className='group inline-flex items-center gap-1 text-[11px] text-gray-500 transition hover:text-white'>
						<ArrowLeft className='h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5' />
						Back to site
					</Link>
				</div>

				<h2 className='mt-6 text-2xl font-bold text-white'>Welcome back</h2>
				<p className='mt-1 text-xs text-gray-500'>Sign in with your admin account to continue.</p>

				<form onSubmit={handleSubmit} className='mt-6 space-y-4'>
					<Field label='Email' required>
						<div className='relative'>
							<Mail className='pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-gray-500' />
							<Input type='email' value={email} onChange={(event) => setEmail(event.target.value)} placeholder='admin@example.com' className='pl-10' autoComplete='email' required />
						</div>
					</Field>

					<Field label='Password' required>
						<div className='relative'>
							<Lock className='pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-gray-500' />
							<Input
								type={showPassword ? "text" : "password"}
								value={password}
								onChange={(event) => setPassword(event.target.value)}
								placeholder='Enter your password'
								className='pl-10 pr-11'
								autoComplete='current-password'
								required
							/>
							<button
								type='button'
								onClick={() => setShowPassword((value) => !value)}
								className='absolute right-3 top-3.5 text-gray-500 transition hover:text-gray-300'
								aria-label={showPassword ? "Hide password" : "Show password"}
							>
								{showPassword ? <EyeOff className='h-4 w-4' /> : <Eye className='h-4 w-4' />}
							</button>
						</div>
					</Field>

					{!isSupabaseConfigured && (
						<div className='flex items-start gap-2 rounded-xl border border-amber-500/20 bg-amber-500/[0.07] p-3 text-[11px] leading-relaxed text-amber-200/80'>
							<AlertCircle className='mt-0.5 h-4 w-4 shrink-0' />
							Supabase credentials are missing. The login form is disabled until environment variables are configured.
						</div>
					)}

					{error && (
						<div className='flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-300'>
							<AlertCircle className='mt-0.5 h-4 w-4 shrink-0' />
							{error}
						</div>
					)}

					<Button type='submit' size='lg' className='w-full' loading={loading} disabled={!isSupabaseConfigured} icon={<Lock className='h-4 w-4' />}>
						{loading ? "Signing in..." : "Sign in"}
						{/* <ArrowRight className='ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5' /> */}
					</Button>
				</form>

				<p className='mt-5 text-center text-[10px] leading-relaxed text-gray-600'>
					Access is limited to accounts with the <span className='text-indigo-300'>admin</span> role in the profiles table. Unauthorized accounts are signed out automatically.
				</p>
			</div>
		</motion.div>
	);
}
