import { Award, CheckCircle2, FolderGit2, Mail, MessageSquare, Pin, Plus, Sparkles } from "lucide-react";
import Link from "next/link";
import { connection } from "next/server";
import { AdminPageHeader } from "@/components/admin/page-header";
import { StatCard } from "@/components/admin/stat-card";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { ErrorState } from "@/components/ui/states";
import { getAdminComments } from "@/lib/services/comments-admin";
import { getAdminMessages } from "@/lib/services/messages";
import { getAdminProjects } from "@/lib/services/projects";
import { getAdminStats } from "@/lib/services/stats";
import { formatRelativeDate } from "@/lib/utils/date";

type OverviewData = {
	stats: Awaited<ReturnType<typeof getAdminStats>>;
	projects: Awaited<ReturnType<typeof getAdminProjects>>;
	comments: Awaited<ReturnType<typeof getAdminComments>>;
	messages: Awaited<ReturnType<typeof getAdminMessages>>;
};

export async function AdminOverview() {
	await connection();

	let data: OverviewData | null = null;
	let error: string | null = null;

	try {
		const [stats, projects, comments, messages] = await Promise.all([getAdminStats(), getAdminProjects(), getAdminComments(), getAdminMessages()]);

		data = { stats, projects, comments, messages };
	} catch (cause) {
		error = cause instanceof Error ? cause.message : "Check your Supabase connection and RLS policies.";
	}

	if (error || !data) {
		return <ErrorState title='Dashboard data unavailable' description={error ?? "Check your Supabase connection and RLS policies."} />;
	}

	const { stats, projects, comments, messages } = data;
	const recentProjects = projects.slice(0, 4);
	const recentComments = comments.slice(0, 4);
	const unreadMessages = messages.filter((message) => !message.read).slice(0, 3);

	return (
		<div>
			<AdminPageHeader
				icon={Sparkles}
				title='Overview'
				description='A quick snapshot of your portfolio content.'
				action={
					<ButtonLink href='/admin/projects' size='sm' icon={<Plus className='h-3.5 w-3.5' />}>
						New project
					</ButtonLink>
				}
			/>

			<div className='grid gap-3 sm:grid-cols-2 xl:grid-cols-4'>
				<StatCard label='Total projects' value={stats.totalProjects} icon={FolderGit2} href='/admin/projects' hint={`${stats.publishedProjects} published`} />
				<StatCard label='Research & credentials' value={stats.totalCertificates} icon={Award} href='/admin/certificates' accent='purple' hint='Publications and certificates' />
				<StatCard label='Comments' value={stats.totalComments} icon={MessageSquare} href='/admin/comments' accent='cyan' hint={`${stats.pinnedComments} pinned`} />
				<StatCard label='Unread messages' value={stats.unreadMessages} icon={Mail} href='/admin/messages' accent='amber' hint='Contact form submissions' />
			</div>

			<div className='mt-6 grid gap-4 xl:grid-cols-[1.1fr_0.9fr]'>
				<div className='rounded-2xl border border-white/10 bg-white/[0.025] p-5'>
					<div className='flex items-center justify-between'>
						<h2 className='text-sm font-semibold text-white'>Recent projects</h2>
						<Link href='/admin/projects' className='text-[11px] text-indigo-300 transition hover:text-indigo-200'>
							Manage all
						</Link>
					</div>
					<div className='mt-4 space-y-2'>
						{recentProjects.length === 0 ? (
							<p className='rounded-xl border border-dashed border-white/10 p-4 text-center text-xs text-gray-600'>No projects yet.</p>
						) : (
							recentProjects.map((project) => (
								<div key={project.id} className='flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.02] p-3'>
									<span className='flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-indigo-400/20 bg-indigo-500/10'>
										<FolderGit2 className='h-3.5 w-3.5 text-indigo-300' />
									</span>
									<div className='min-w-0 flex-1'>
										<p className='truncate text-xs font-medium text-white'>{project.title}</p>
										<p className='truncate text-[10px] text-gray-600'>{project.techStack.slice(0, 3).join(" · ") || "No stack"}</p>
									</div>
									{project.published ? (
										<Badge variant='green'>
											<CheckCircle2 className='h-2.5 w-2.5' />
											Live
										</Badge>
									) : (
										<Badge variant='amber'>Draft</Badge>
									)}
								</div>
							))
						)}
					</div>
				</div>

				<div className='space-y-4'>
					<div className='rounded-2xl border border-white/10 bg-white/[0.025] p-5'>
						<div className='flex items-center justify-between'>
							<h2 className='text-sm font-semibold text-white'>Recent comments</h2>
							<Link href='/admin/comments' className='text-[11px] text-indigo-300 transition hover:text-indigo-200'>
								Moderate
							</Link>
						</div>
						<div className='mt-4 space-y-2'>
							{recentComments.length === 0 ? (
								<p className='text-xs text-gray-600'>No comments yet.</p>
							) : (
								recentComments.map((comment) => (
									<div key={comment.id} className='rounded-xl border border-white/[0.07] bg-white/[0.02] p-3'>
										<div className='flex items-center gap-2'>
											<span className='truncate text-[11px] font-medium text-gray-200'>{comment.userName}</span>
											{comment.isPinned && <Pin className='h-2.5 w-2.5 text-indigo-400' />}
											<span className='ml-auto text-[9px] text-gray-600'>{formatRelativeDate(comment.createdAt)}</span>
										</div>
										<p className='mt-1 line-clamp-2 text-[10px] leading-relaxed text-gray-500'>{comment.content}</p>
									</div>
								))
							)}
						</div>
					</div>

					<div className='rounded-2xl border border-white/10 bg-white/[0.025] p-5'>
						<div className='flex items-center justify-between'>
							<h2 className='text-sm font-semibold text-white'>Inbox</h2>
							<Link href='/admin/messages' className='text-[11px] text-indigo-300 transition hover:text-indigo-200'>
								Open inbox
							</Link>
						</div>
						<div className='mt-4 space-y-2'>
							{unreadMessages.length === 0 ? (
								<p className='text-xs text-gray-600'>No unread messages.</p>
							) : (
								unreadMessages.map((message) => (
									<div key={message.id} className='rounded-xl border border-amber-400/15 bg-amber-500/[0.04] p-3'>
										<p className='truncate text-[11px] font-medium text-gray-200'>{message.name}</p>
										<p className='mt-0.5 line-clamp-1 text-[10px] text-gray-500'>{message.message}</p>
									</div>
								))
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
