"use client";

import { ChevronDown, FolderGit2 } from "lucide-react";
import { useMemo, useState } from "react";
import { ProjectCard } from "@/components/projects/project-card";
import { ProjectModal } from "@/components/projects/project-modal";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { EmptyState } from "@/components/ui/states";
import { cn } from "@/lib/utils/cn";
import type { Project } from "@/types";

const INITIAL_COUNT = 4;

export function ProjectExplorer({ projects }: { projects: Project[] }) {
	const [selected, setSelected] = useState<Project | null>(null);
	const [showAll, setShowAll] = useState(false);
	const [tech, setTech] = useState<string>("All");

	const techs = useMemo(() => {
		const counts = new Map<string, number>();
		projects.forEach((project) => {
			project.techStack.forEach((item) => {
				counts.set(item, (counts.get(item) ?? 0) + 1);
			});
		});

		return [
			"All",
			...Array.from(counts.entries())
				.sort((a, b) => b[1] - a[1])
				.slice(0, 6)
				.map(([name]) => name),
		];
	}, [projects]);

	const filtered = useMemo(() => (tech === "All" ? projects : projects.filter((project) => project.techStack.includes(tech))), [projects, tech]);

	const visible = showAll ? filtered : filtered.slice(0, INITIAL_COUNT);

	if (projects.length === 0) {
		return <EmptyState icon={FolderGit2} title='No projects published yet' description='Published projects will appear here as soon as they are added from the admin dashboard.' />;
	}

	return (
		<div className='space-y-7'>
			<div className='no-scrollbar flex gap-2 overflow-x-auto pb-1'>
				{techs.map((item) => (
					<button
						key={item}
						type='button'
						onClick={() => {
							setTech(item);
							setShowAll(false);
						}}
						className={cn(
							"shrink-0 rounded-lg border px-3 py-1.5 text-[11px] font-medium transition-all duration-200",
							tech === item ? "border-indigo-400/40 bg-indigo-500/15 text-white" : "border-white/[0.08] bg-white/[0.025] text-gray-500 hover:border-white/15 hover:text-gray-200",
						)}
					>
						{item}
					</button>
				))}
			</div>

			{visible.length === 0 ? (
				<EmptyState
					icon={FolderGit2}
					title='No projects match that filter'
					description='Try a different technology or clear the filter.'
					action={
						<Button variant='secondary' size='sm' onClick={() => setTech("All")}>
							Clear filter
						</Button>
					}
				/>
			) : (
				<div className='grid gap-5 md:grid-cols-2 xl:grid-cols-2'>
					{visible.map((project, index) => {
						const fromLeft = (Math.floor(index / 2) + (index % 2)) % 2 === 0;

						return (
							<Reveal key={project.id} direction={fromLeft ? "left" : "right"} distance={120} delay={(index % 2) * 0.08} once={false} className='h-full'>
								<ProjectCard project={project} onOpen={setSelected} />
							</Reveal>
						);
					})}
				</div>
			)}

			{filtered.length > INITIAL_COUNT && (
				<div className='flex justify-center'>
					<Button variant='secondary' size='sm' onClick={() => setShowAll((value) => !value)} icon={<ChevronDown className={cn("h-3.5 w-3.5 transition-transform", showAll && "rotate-180")} />}>
						{showAll ? "Show less" : `Show all projects`}
					</Button>
				</div>
			)}

			<ProjectModal project={selected} onClose={() => setSelected(null)} />
		</div>
	);
}
