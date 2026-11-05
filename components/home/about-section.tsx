import { Award, Briefcase, Code2, Download, FolderGit2, Globe2, GraduationCap, Timer } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/reveal";
import { SafeImage } from "@/components/ui/safe-image";
import { SectionHeading } from "@/components/ui/section-heading";
import { T } from "@/components/ui/translated-text";
import { getCertificates } from "@/lib/services/certificates";
import { getPublishedProjects } from "@/lib/services/projects";
import { siteConfig } from "@/lib/site-config";

const timelineIcons = {
	work: Briefcase,
	education: GraduationCap,
	exchange: Globe2,
};

export async function AboutSection() {
	const [projects, certificates] = await Promise.all([getPublishedProjects().catch(() => []), getCertificates().catch(() => [])]);

	const years = siteConfig.stats.yearsExperience;
	const resumeUrl: string = siteConfig.resumeUrl;

	const stats = [
		{
			labelKey: "about.stats.projects.label",
			descriptionKey: "about.stats.projects.description",
			value: projects.length,
			icon: FolderGit2,
			accent: "from-indigo-500/25 to-transparent",
			showPlus: true,
		},
		{
			labelKey: "about.stats.credentials.label",
			descriptionKey: "about.stats.credentials.description",
			value: certificates.length,
			icon: Award,
			accent: "from-purple-500/25 to-transparent",
			showPlus: false,
		},
		{
			labelKey: "about.stats.years.label",
			descriptionKey: "about.stats.years.description",
			value: years,
			icon: Timer,
			accent: "from-cyan-500/20 to-transparent",
			showPlus: true,
		},
	];

	return (
		<section id='about' className='section-shell scroll-mt-24 py-12 sm:py-14'>
			<Reveal>
				<SectionHeading
					eyebrow={<T k='about.eyebrow' />}
					title={
						<>
							<T k='about.titleLead' /> <span className='text-gradient'><T k='about.titleHighlight' /></span>
						</>
					}
					description={<T k='about.intro' />}
				/>
			</Reveal>

			<div className='mt-14 grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16'>
				<Reveal direction='left' distance={70}>
					<div className='space-y-6'>
						<p className='text-sm leading-relaxed text-gray-400 sm:text-base'><T k='about.background' /></p>

						<div className='relative overflow-hidden rounded-2xl border border-indigo-400/20 bg-gradient-to-br from-indigo-500/[0.07] via-transparent to-purple-500/[0.07] p-5'>
							<div className='absolute -right-4 -top-4 h-20 w-20 rounded-full bg-indigo-500/15 blur-2xl' />
							<div className='absolute -bottom-5 -left-3 h-16 w-16 rounded-full bg-purple-500/15 blur-xl' />
							<p className='relative text-sm font-medium italic leading-relaxed text-gray-300'>&ldquo;<T k='about.quote' />&rdquo;</p>
						</div>

						<div className='flex flex-wrap items-center gap-3'>
							{resumeUrl && resumeUrl !== "#" && (
								<ButtonLink href={resumeUrl} variant='primary' icon={<Download className='h-4 w-4' />} external={resumeUrl.startsWith("http")}>
									<T k='common.downloadCv' />
								</ButtonLink>
							)}
							<ButtonLink href='#projects' variant='outline' icon={<Code2 className='h-4 w-4' />}>
								<T k='common.viewProjects' />
							</ButtonLink>
							{/* <Link
                href="/#contact"
                className="group inline-flex items-center gap-1.5 text-sm text-gray-500 transition hover:text-white"
              >
                Let&apos;s work together
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link> */}
						</div>
					</div>
				</Reveal>

				<Reveal delay={0.1} direction='right' distance={70}>
					<div className='relative mx-auto flex w-full max-w-sm items-center justify-center py-4'>
						<div className='absolute h-[21rem] w-[21rem] rounded-full bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-transparent blur-3xl' />
						<div className='absolute h-[20rem] w-[20rem] animate-spin-slow rounded-full border border-dashed border-white/10' />

						<div className='group relative aspect-square w-full max-w-[21rem] rounded-full border border-white/15 bg-white/[0.04] p-2 shadow-[0_30px_90px_-40px_rgba(99,102,241,0.8)]'>
							<div className='absolute inset-2 overflow-hidden rounded-full'>
								<SafeImage src='/profile.jpg' alt={`${siteConfig.name} portrait`} sizes='(max-width: 1024px) 80vw, 336px' className='object-center transition-transform duration-700 sm:group-hover:scale-105' />
								<div className='pointer-events-none absolute inset-0 bg-gradient-to-t from-[#030014]/75 via-transparent to-transparent' />
								<div className='absolute inset-x-0 bottom-6 flex justify-center'>
									<Badge variant='green' className='gap-1.5 border-emerald-400/30 bg-[#04140f]/80 backdrop-blur'>
										<span className='h-1.5 w-1.5 rounded-full bg-emerald-400' />
										<T k='about.available' />
									</Badge>
								</div>
							</div>
						</div>
					</div>
				</Reveal>
			</div>

			<Stagger className='mt-14 grid gap-4 sm:grid-cols-3'>
				{stats.map((stat, index) => (
					<StaggerItem key={stat.labelKey} direction={index === 0 ? "left" : index === 2 ? "right" : "up"}>
						<div className='group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.05]'>
							<div className={`absolute inset-0 bg-gradient-to-br ${stat.accent} opacity-60`} />
							<div className='relative flex items-start justify-between'>
								<div className='flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06]'>
									<stat.icon className='h-4.5 w-4.5 text-white' />
								</div>
								<span className='text-3xl font-bold tracking-tight text-white'>
									{stat.value}
									{stat.value > 0 && stat.showPlus && <span className='text-indigo-400'>+</span>}
								</span>
							</div>
							<div className='relative mt-4'>
								<p className='text-xs font-semibold uppercase tracking-[0.12em] text-gray-300'><T k={stat.labelKey} /></p>
								<p className='mt-1 text-xs leading-relaxed text-gray-500'><T k={stat.descriptionKey} /></p>
							</div>
						</div>
					</StaggerItem>
				))}
			</Stagger>

			{/* <Stagger className='mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4'>
				{siteConfig.skills.map((skill, index) => {
					const Icon = skillIcons[index] ?? Code2;
					return (
						<StaggerItem
							key={skill.title}
							direction={index % 2 === 0 ? "left" : "right"}
						>
							<Card hover className='h-full p-5'>
								<div className='flex items-center gap-2.5'>
									<span className='flex h-9 w-9 items-center justify-center rounded-xl border border-indigo-400/20 bg-indigo-500/10'>
										<Icon className='h-4 w-4 text-indigo-300' />
									</span>
									<h3 className='text-sm font-semibold text-white'>{skill.title}</h3>
								</div>
								<p className='mt-3 text-xs leading-relaxed text-gray-500'>{skill.description}</p>
								<div className='mt-4 flex flex-wrap gap-1.5'>
									{skill.items.map((item) => (
										<span key={item} className='rounded-md border border-white/[0.08] bg-white/[0.035] px-2 py-1 text-[10px] text-gray-400'>
											{item}
										</span>
									))}
								</div>
							</Card>
						</StaggerItem>
					);
				})}
			</Stagger> */}

			<Reveal className='mt-16'>
				<div className='flex flex-col gap-2'>
					<p className='text-[11px] font-semibold uppercase tracking-[0.18em] text-indigo-300'><T k='about.experience.eyebrow' /></p>
					<h3 className='text-2xl font-bold tracking-tight text-white'><T k='about.experience.title' /></h3>
					<p className='max-w-xl text-xs leading-relaxed text-gray-500'><T k='about.experience.description' /></p>
				</div>

				<div className='relative mt-8 grid gap-4 lg:grid-cols-3'>
					<div className='pointer-events-none absolute left-0 right-0 top-9 hidden h-px bg-gradient-to-r from-transparent via-indigo-500/25 to-transparent lg:block' />
					{siteConfig.timeline.map((item, index) => {
						const Icon = timelineIcons[item.type as keyof typeof timelineIcons] ?? Briefcase;
						const keyBase = `about.timeline.${item.type}`;

						return (
							<Reveal key={item.title} direction={index % 2 === 0 ? "left" : "right"} distance={80} delay={index * 0.06} className='h-full'>
								<div className='group relative h-full rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.05]'>
									<div className='relative flex items-start justify-between gap-3'>
										<span className='flex h-10 w-10 items-center justify-center rounded-xl border border-indigo-400/20 bg-indigo-500/10'>
											<Icon className='h-4 w-4 text-indigo-300' />
										</span>
										<span className='rounded-full border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 text-[10px] text-gray-500'><T k={`${keyBase}.period`} /></span>
									</div>
									<h4 className='mt-4 text-sm font-semibold text-white'><T k={`${keyBase}.title`} /></h4>
									<p className='mt-0.5 text-xs font-medium text-indigo-300'><T k={`${keyBase}.organization`} /></p>
									<p className='mt-3 text-xs leading-relaxed text-gray-500'><T k={`${keyBase}.description`} /></p>
								</div>
							</Reveal>
						);
					})}
				</div>
			</Reveal>
		</section>
	);
}
