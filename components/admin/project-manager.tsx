"use client";

import {
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  Eye,
  EyeOff,
  FolderGit2,
  ImageIcon,
  Pencil,
  Plus,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  adminCreateProject,
  adminDeleteProject,
  adminMoveProject,
  adminToggleProject,
  adminUpdateProject,
} from "@/app/admin/actions";
import { AdminPageHeader } from "@/components/admin/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, Input, Switch, Textarea } from "@/components/ui/field";
import { Modal } from "@/components/ui/modal";
import { SafeImage } from "@/components/ui/safe-image";
import { EmptyState, Spinner } from "@/components/ui/states";
import { confirmAction, toast } from "@/lib/utils/notify";
import { cn } from "@/lib/utils/cn";
import type { Project, ProjectInput } from "@/types";

type FormValues = {
  title: string;
  description: string;
  techStack: string;
  features: string;
  liveUrl: string;
  githubUrl: string;
  displayOrder: string;
};

function splitList(value: string) {
  return Array.from(
    new Set(
      value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    ),
  );
}

function ProjectForm({
  project,
  nextOrder,
  onClose,
  onSaved,
}: {
  project: Project | null;
  nextOrder: number;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [values, setValues] = useState<FormValues>({
    title: project?.title ?? "",
    description: project?.description ?? "",
    techStack: project?.techStack.join(", ") ?? "",
    features: project?.features.join(", ") ?? "",
    liveUrl: project?.liveUrl ?? "",
    githubUrl: project?.githubUrl ?? "",
    displayOrder: String(project?.displayOrder ?? nextOrder),
  });
  const [published, setPublished] = useState(project?.published ?? true);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(
    project?.thumbnailUrl ?? null,
  );
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (blobUrl) URL.revokeObjectURL(blobUrl);
    };
  }, [blobUrl]);

  const set = (key: keyof FormValues) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => setValues((current) => ({ ...current, [key]: event.target.value }));

  const handleFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please choose a valid image file.");
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setError("Images must be smaller than 8 MB.");
      return;
    }

    if (blobUrl) URL.revokeObjectURL(blobUrl);
    const url = URL.createObjectURL(file);
    setThumbnail(file);
    setBlobUrl(url);
    setPreview(url);
    setError(null);
  };

  const clearSelectedFile = () => {
    if (blobUrl) URL.revokeObjectURL(blobUrl);
    setThumbnail(null);
    setBlobUrl(null);
    setPreview(project?.thumbnailUrl ?? null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setPending(true);

    const input: ProjectInput = {
      title: values.title,
      description: values.description,
      thumbnailUrl: project?.thumbnailUrl ?? null,
      techStack: splitList(values.techStack),
      features: splitList(values.features),
      liveUrl: values.liveUrl.trim() || null,
      githubUrl: values.githubUrl.trim() || null,
      published,
      displayOrder: Number(values.displayOrder) || 0,
    };

    try {
      const result = project
        ? await adminUpdateProject(project.id, input, thumbnail)
        : await adminCreateProject(input, thumbnail);

      if (!result.success) {
        setError(result.error);
        await toast({
          title: project ? "Update failed" : "Could not create project",
          text: result.error,
          icon: "error",
        });
        return;
      }

      await toast({
        title: project ? "Project updated" : "Project created",
        text: result.message,
      });
      onSaved();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4 p-5 sm:p-6">
        <Field label="Project title" required>
          <Input
            value={values.title}
            onChange={set("title")}
            placeholder="e.g. Orbit Analytics Dashboard"
            required
          />
        </Field>

        <Field label="Description" required>
          <Textarea
            value={values.description}
            onChange={set("description")}
            rows={4}
            placeholder="What does this project do? What problem does it solve?"
            required
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Tech stack" hint="Comma separated">
            <Input
              value={values.techStack}
              onChange={set("techStack")}
              placeholder="Next.js, TypeScript, Supabase"
            />
          </Field>
          <Field label="Key features" hint="Comma separated">
            <Input
              value={values.features}
              onChange={set("features")}
              placeholder="Realtime updates, Admin dashboard"
            />
          </Field>
          <Field label="Live URL">
            <Input
              type="url"
              value={values.liveUrl}
              onChange={set("liveUrl")}
              placeholder="https://your-project.com"
            />
          </Field>
          <Field label="GitHub URL">
            <Input
              type="url"
              value={values.githubUrl}
              onChange={set("githubUrl")}
              placeholder="https://github.com/user/repo"
            />
          </Field>
        </div>

        <div className="grid items-end gap-4 sm:grid-cols-[1fr_1.6fr]">
          <Field label="Display order" hint="Lower shows first">
            <Input
              type="number"
              min={0}
              max={9999}
              value={values.displayOrder}
              onChange={set("displayOrder")}
            />
          </Field>

          <div className="space-y-1.5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-indigo-300/70">
              Thumbnail
            </p>
            <div className="flex items-center gap-3 rounded-xl border border-dashed border-white/15 bg-[#0d0d22] p-3">
              <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-white/5">
                {preview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={preview}
                    alt="Project thumbnail preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-gray-600">
                    <ImageIcon className="h-4 w-4" />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px] text-gray-300 transition hover:bg-white/[0.08]">
                  <Upload className="h-3 w-3" />
                  {preview ? "Replace image" : "Upload image"}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFile}
                  />
                </label>
                <p className="mt-1 text-[10px] text-gray-600">
                  PNG, JPG or WEBP. Max 8 MB.
                </p>
              </div>
              {thumbnail && (
                <button
                  type="button"
                  onClick={clearSelectedFile}
                  className="rounded-lg p-1.5 text-gray-500 transition hover:bg-red-500/10 hover:text-red-400"
                  aria-label="Remove selected image"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        <Switch
          checked={published}
          onChange={setPublished}
          label="Published"
          description="Published projects appear on the public website."
        />

        {error && (
          <p className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-300">
            {error}
          </p>
        )}
      </div>

      <div className="flex justify-end gap-2 border-t border-white/[0.07] px-5 py-4 sm:px-6">
        <Button type="button" variant="secondary" size="sm" onClick={onClose}>
          Cancel
        </Button>
        <Button
          type="submit"
          size="sm"
          loading={pending}
          icon={<Upload className="h-3.5 w-3.5" />}
        >
          {pending ? "Saving..." : project ? "Update project" : "Create project"}
        </Button>
      </div>
    </form>
  );
}

export function ProjectManager({ projects }: { projects: Project[] }) {
  const router = useRouter();
  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const finish = (message?: string) => {
    router.refresh();
    if (message) void toast({ title: message });
  };

  const handleDelete = async (project: Project) => {
    const confirmed = await confirmAction({
      title: "Delete project?",
      text: `"${project.title}" will be permanently removed.`,
      confirmText: "Delete project",
    });

    if (!confirmed) return;

    setBusyId(project.id);
    const result = await adminDeleteProject(project.id);
    setBusyId(null);

    if (!result.success) {
      await toast({ title: "Delete failed", text: result.error, icon: "error" });
      return;
    }

    finish(result.message);
  };

  const handleToggle = async (project: Project) => {
    setBusyId(project.id);
    const result = await adminToggleProject(project.id, !project.published);
    setBusyId(null);

    if (!result.success) {
      await toast({ title: "Update failed", text: result.error, icon: "error" });
      return;
    }

    finish(result.message);
  };

  const handleMove = async (project: Project, direction: "up" | "down") => {
    setBusyId(project.id);
    const result = await adminMoveProject(project.id, direction);
    setBusyId(null);

    if (!result.success) {
      await toast({ title: "Could not reorder", text: result.error, icon: "error" });
      return;
    }

    finish(result.message);
  };

  const nextOrder =
    projects.reduce((max, project) => Math.max(max, project.displayOrder), 0) + 1;

  return (
    <div>
      <AdminPageHeader
        icon={FolderGit2}
        title="Projects"
        description={`${projects.length} total · ${projects.filter((p) => p.published).length} published`}
        action={
          <Button
            size="sm"
            onClick={() => setCreateOpen(true)}
            icon={<Plus className="h-3.5 w-3.5" />}
          >
            New project
          </Button>
        }
      />

      {projects.length === 0 ? (
        <EmptyState
          icon={FolderGit2}
          title="No projects yet"
          description="Create your first project. You can save it as a draft and publish later."
          action={
            <Button
              size="sm"
              onClick={() => setCreateOpen(true)}
              icon={<Plus className="h-3.5 w-3.5" />}
            >
              New project
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-3">
          {projects.map((project, index) => (
            <div
              key={project.id}
              className={cn(
                "group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition-all duration-300 hover:border-white/20",
                busyId === project.id && "opacity-70",
              )}
            >
              <div className="relative aspect-[16/9] overflow-hidden bg-white/5">
                <SafeImage
                  src={project.thumbnailUrl}
                  alt={project.title}
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute left-3 top-3">
                  {project.published ? (
                    <Badge variant="green">
                      <CheckCircle2 className="h-2.5 w-2.5" />
                      Published
                    </Badge>
                  ) : (
                    <Badge variant="amber">Draft</Badge>
                  )}
                </div>
                <div className="absolute right-3 top-3 flex gap-1">
                  <button
                    type="button"
                    onClick={() => handleMove(project, "up")}
                    disabled={index === 0 || busyId === project.id}
                    className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/15 bg-black/50 text-gray-300 backdrop-blur transition hover:text-white disabled:opacity-30"
                    aria-label="Move project up"
                  >
                    <ArrowUp className="h-3 w-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMove(project, "down")}
                    disabled={index === projects.length - 1 || busyId === project.id}
                    className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/15 bg-black/50 text-gray-300 backdrop-blur transition hover:text-white disabled:opacity-30"
                    aria-label="Move project down"
                  >
                    <ArrowDown className="h-3 w-3" />
                  </button>
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <h2 className="text-sm font-semibold text-white">
                    {project.title}
                  </h2>
                  <span className="shrink-0 rounded-md border border-white/10 bg-white/[0.04] px-1.5 py-0.5 text-[9px] text-gray-500">
                    #{project.displayOrder}
                  </span>
                </div>
                <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-gray-500">
                  {project.description}
                </p>
                <div className="mt-3 flex flex-wrap gap-1">
                  {project.techStack.slice(0, 4).map((tech) => (
                    <span
                      key={tech}
                      className="rounded-md border border-indigo-400/15 bg-indigo-500/[0.07] px-1.5 py-0.5 text-[9px] text-indigo-200"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="mt-4 flex items-center gap-1.5 border-t border-white/[0.07] pt-3">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleToggle(project)}
                    disabled={busyId === project.id}
                    icon={
                      project.published ? (
                        <EyeOff className="h-3 w-3" />
                      ) : (
                        <Eye className="h-3 w-3" />
                      )
                    }
                  >
                    {project.published ? "Unpublish" : "Publish"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditing(project)}
                    disabled={busyId === project.id}
                    icon={<Pencil className="h-3 w-3" />}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(project)}
                    disabled={busyId === project.id}
                    icon={
                      busyId === project.id ? (
                        <Spinner className="h-3 w-3" />
                      ) : (
                        <Trash2 className="h-3 w-3" />
                      )
                    }
                    className="ml-auto"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Add new project"
        description="Published projects appear on the public site immediately."
        size="lg"
      >
        {createOpen && (
          <ProjectForm
            project={null}
            nextOrder={nextOrder}
            onClose={() => setCreateOpen(false)}
            onSaved={() => {
              setCreateOpen(false);
              router.refresh();
            }}
          />
        )}
      </Modal>

      <Modal
        open={Boolean(editing)}
        onClose={() => setEditing(null)}
        title="Edit project"
        description={editing?.title}
        size="lg"
      >
        {editing && (
          <ProjectForm
            project={editing}
            nextOrder={nextOrder}
            onClose={() => setEditing(null)}
            onSaved={() => {
              setEditing(null);
              router.refresh();
            }}
          />
        )}
      </Modal>
    </div>
  );
}
