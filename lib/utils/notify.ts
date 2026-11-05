"use client";

type ToastIcon = "success" | "error" | "info" | "warning" | "question";

type ToastOptions = {
  title: string;
  text?: string;
  icon?: ToastIcon;
};

function theme() {
  return {
    background: "#0a0a1a",
    color: "#e9e6f5",
    confirmButtonColor: "#6366f1",
    cancelButtonColor: "#1f2937",
  };
}

export async function toast({ title, text, icon = "success" }: ToastOptions) {
  const { default: Swal } = await import("sweetalert2");

  return Swal.fire({
    title,
    text,
    icon,
    ...theme(),
    timer: icon === "error" ? undefined : 2600,
    timerProgressBar: icon !== "error",
    showConfirmButton: icon === "error",
  });
}

export async function confirmAction({
  title,
  text,
  confirmText = "Delete",
  icon = "warning",
}: {
  title: string;
  text?: string;
  confirmText?: string;
  icon?: ToastIcon;
}) {
  const { default: Swal } = await import("sweetalert2");

  const result = await Swal.fire({
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: "Cancel",
    reverseButtons: true,
    focusCancel: true,
    ...theme(),
  });

  return result.isConfirmed;
}

export async function loadingToast(title: string) {
  const { default: Swal } = await import("sweetalert2");

  Swal.fire({
    title,
    allowOutsideClick: false,
    allowEscapeKey: false,
    showConfirmButton: false,
    ...theme(),
    didOpen: () => {
      Swal.showLoading();
    },
  });
}

export async function closeToast() {
  const { default: Swal } = await import("sweetalert2");
  Swal.close();
}
