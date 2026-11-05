"use client";

import {
  Award,
  ImageIcon,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  adminDeleteCertificate,
  adminUploadCertificate,
} from "@/app/admin/actions";
import { AdminPageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { SafeImage } from "@/components/ui/safe-image";
import { EmptyState, Spinner } from "@/components/ui/states";
import { confirmAction, toast } from "@/lib/utils/notify";
import { cn } from "@/lib/utils/cn";
import type { Certificate } from "@/types";

export function CertificateManager({
  certificates,
}: {
  certificates: Certificate[];
}) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [issuer, setIssuer] = useState("");
  const [url, setUrl] = useState("");
  const [displayOrder, setDisplayOrder] = useState(
    String(
      certificates.reduce((max, cert) => Math.max(max, cert.displayOrder), 0) + 1,
    ),
  );
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const chooseFile = (next: File | undefined | null) => {
    if (!next) return;

    if (!next.type.startsWith("image/")) {
      setError("Please choose a valid image file.");
      return;
    }

    if (next.size > 8 * 1024 * 1024) {
      setError("Images must be smaller than 8 MB.");
      return;
    }

    if (preview) URL.revokeObjectURL(preview);
    setFile(next);
    setPreview(URL.createObjectURL(next));
    setError(null);
  };

  const reset = () => {
    if (preview) URL.revokeObjectURL(preview);
    setFile(null);
    setPreview(null);
    setTitle("");
    setIssuer("");
    setUrl("");
    setDisplayOrder(
      String(
        certificates.reduce(
          (max, cert) => Math.max(max, cert.displayOrder),
          0,
        ) + 1,
      ),
    );
    setError(null);
  };

  const handleUpload = async () => {
    setError(null);

    if (!title.trim()) {
      setError("Certificate title is required.");
      return;
    }

    if (!file) {
      setError("Please select a certificate image.");
      return;
    }

    setUploading(true);

    const result = await adminUploadCertificate(
      {
        title,
        issuer,
        url,
        displayOrder: Number(displayOrder) || 0,
      },
      file,
    );

    setUploading(false);

    if (!result.success) {
      setError(result.error);
      await toast({ title: "Upload failed", text: result.error, icon: "error" });
      return;
    }

    await toast({ title: "Certificate uploaded", text: result.message });
    reset();
    router.refresh();
  };

  const handleDelete = async (certificate: Certificate) => {
    const confirmed = await confirmAction({
      title: "Delete certificate?",
      text: `"${certificate.title}" will be permanently removed.`,
      confirmText: "Delete certificate",
    });

    if (!confirmed) return;

    setBusyId(certificate.id);
    const result = await adminDeleteCertificate(certificate.id);
    setBusyId(null);

    if (!result.success) {
      await toast({ title: "Delete failed", text: result.error, icon: "error" });
      return;
    }

    await toast({ title: "Certificate deleted", text: result.message });
    router.refresh();
  };

  return (
    <div>
      <AdminPageHeader
        icon={Award}
        title="Research & credentials"
        description={`${certificates.length} entries in the public research gallery`}
      />

      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <div className="grid gap-5 lg:grid-cols-[1fr_1.4fr]">
          <div className="space-y-3">
            <Field label="Title" required>
              <Input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="e.g. Uncovering Fake Profiles Using ML"
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Issuer / venue">
                <Input
                  value={issuer}
                  onChange={(event) => setIssuer(event.target.value)}
                  placeholder="e.g. ICoABCD 2024"
                />
              </Field>
              <Field label="Display order">
                <Input
                  type="number"
                  min={0}
                  value={displayOrder}
                  onChange={(event) => setDisplayOrder(event.target.value)}
                />
              </Field>
            </div>
            <Field label="External link" hint="optional">
              <Input
                type="url"
                value={url}
                onChange={(event) => setUrl(event.target.value)}
                placeholder="e.g. https://ieeexplore.ieee.org/document/..."
              />
            </Field>
          </div>

          <div className="space-y-3">
            <div
              onDragOver={(event) => {
                event.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(event) => {
                event.preventDefault();
                setDragOver(false);
                chooseFile(event.dataTransfer.files?.[0]);
              }}
              className={cn(
                "relative flex min-h-[150px] items-center justify-center rounded-xl border-2 border-dashed transition-all duration-300",
                dragOver
                  ? "border-indigo-400/60 bg-indigo-500/10"
                  : "border-white/12 bg-white/[0.02] hover:border-indigo-500/35 hover:bg-white/[0.04]",
              )}
            >
              {preview ? (
                <div className="relative w-full p-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={preview}
                    alt="Certificate preview"
                    className="mx-auto max-h-40 rounded-lg object-contain"
                  />
                  <button
                    type="button"
                    onClick={reset}
                    className="absolute right-2 top-2 rounded-lg bg-black/60 p-1.5 text-gray-300 backdrop-blur transition hover:text-red-400"
                    aria-label="Remove selected certificate"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <label className="flex cursor-pointer flex-col items-center gap-2 p-6 text-center">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full border border-indigo-400/20 bg-indigo-500/10">
                    <ImageIcon className="h-5 w-5 text-indigo-400" />
                  </span>
                  <span className="text-sm text-gray-300">
                    Drag &amp; drop or click to upload
                  </span>
                  <span className="text-[10px] text-gray-600">
                    PNG, JPG or WEBP · max 8 MB
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(event) => chooseFile(event.target.files?.[0])}
                  />
                </label>
              )}
            </div>

            {error && (
              <p className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-300">
                {error}
              </p>
            )}

            <div className="flex items-center justify-between gap-3">
              <p className="min-w-0 flex-1 truncate text-[10px] text-gray-600">
                {file?.name ?? "No file selected"}
              </p>
              <Button
                size="sm"
                onClick={handleUpload}
                loading={uploading}
                disabled={!file || uploading}
                icon={<Upload className="h-3.5 w-3.5" />}
              >
                {uploading ? "Uploading..." : "Upload entry"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        {certificates.length === 0 ? (
          <EmptyState
            icon={Award}
            title="No research or credentials uploaded"
            description="Upload a publication or certificate using the form above."
          />
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
            {certificates.map((certificate) => (
              <div
                key={certificate.id}
                className={cn(
                  "group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition hover:border-white/20",
                  busyId === certificate.id && "opacity-60",
                )}
              >
                <div className="relative aspect-[16/11.5] overflow-hidden bg-white/5">
                  <SafeImage
                    src={certificate.imageUrl}
                    alt={certificate.title}
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/80 via-black/10 to-transparent p-2 opacity-0 transition group-hover:opacity-100">
                    <button
                      type="button"
                      onClick={() => handleDelete(certificate)}
                      disabled={busyId === certificate.id}
                      className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-red-500/30 bg-red-500/20 px-2 py-1.5 text-[10px] text-red-200 transition hover:bg-red-500/30"
                    >
                      {busyId === certificate.id ? (
                        <Spinner className="h-3 w-3" />
                      ) : (
                        <Trash2 className="h-3 w-3" />
                      )}
                      Delete
                    </button>
                  </div>
                  <span className="absolute left-2 top-2 rounded-md border border-white/10 bg-black/50 px-1.5 py-0.5 text-[9px] text-gray-400 backdrop-blur">
                    #{certificate.displayOrder}
                  </span>
                </div>
                <div className="p-2.5">
                  <p className="truncate text-[11px] font-medium text-white">
                    {certificate.title}
                  </p>
                  <p className="truncate text-[9px] text-gray-600">
                    {certificate.issuer || "No issuer"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
