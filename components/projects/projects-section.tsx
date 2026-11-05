import { FolderGit2 } from "lucide-react";
import { ProjectExplorer } from "@/components/projects/project-explorer";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { T } from "@/components/ui/translated-text";
import { ErrorState } from "@/components/ui/states";
import { getPublishedProjects } from "@/lib/services/projects";

export async function ProjectsSection() {
	let projects = [] as Awaited<ReturnType<typeof getPublishedProjects>>;
	let error: string | null = null;

	try {
		projects = await getPublishedProjects();
	} catch (cause) {
		error = cause instanceof Error ? cause.message : "Could not load projects.";
	}

	return (
		<section id='projects' className='section-shell scroll-mt-24 py-12 sm:py-14'>
			<Reveal>
				<div className='flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between'>
					<SectionHeading
						align='left'
						eyebrow={<T k='projects.eyebrow' />}
						title={
							<>
								<T k='projects.titleLead' /> <span className='text-gradient'><T k='projects.titleHighlight' /></span>
							</>
						}
						description={<T k='projects.description' />}
					/>
					<div className='flex shrink-0 gap-2'>
						<ButtonLink href='/projects' variant='secondary' size='md' icon={<FolderGit2 className='h-4 w-4' />}>
							<T k='common.allProjects' />
						</ButtonLink>
						{/* <Link
              href="/#contact"
              className="group hidden items-center gap-1.5 text-sm text-gray-500 transition hover:text-white sm:inline-flex"
            >
              Start a project
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link> */}
					</div>
				</div>
			</Reveal>

			<div className='mt-10'>{error ? <ErrorState title={<T k='projects.errorTitle' />} description={error} /> : <ProjectExplorer projects={projects} />}</div>
		</section>
	);
}
