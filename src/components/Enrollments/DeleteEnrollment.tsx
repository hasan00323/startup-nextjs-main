"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

type EnrollmentMeta = {
  studentName?: string;
  courseTitle?: string;
};

const DeleteEnrollmentPage = () => {
  const params = useParams();
  const id = (params?.id as string) ?? "";
  const router = useRouter();

  const token = useMemo(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
  }, []);

  const [open, setOpen] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState<EnrollmentMeta>({});

  useEffect(() => {
    if (!id) {
      router.push("/enrollments");
      return;
    }

    if (!token) {
      router.push("/signin");
      return;
    }

    try {
      const raw = localStorage.getItem("deleteEnrollmentMeta");
      if (raw) setMeta(JSON.parse(raw));
    } catch {
    }
  }, [id, token, router]);

  const close = () => {
    setOpen(false);
    router.push("/enrollments");
  };

const handleDelete = async () => {
  if (!token) {
    router.push("/signin");
    return;
  }

  setSubmitting(true);
  setError(null);

  try {
    const res = await apiFetch(
      `https://localhost:7145/api/enrollments/DeleteEnrollment?id=${encodeURIComponent(
        id
      )}`,
      {
        method: "DELETE",
      },
      router
    );

    if (!res.ok) {
      const t = await res.text().catch(() => "");
      throw new Error(t || `Failed to delete enrollment (${res.status})`);
    }

    localStorage.removeItem("deleteEnrollmentMeta");

    router.push("/enrollments");
  } catch (e: any) {
    setError(e?.message || "Failed to delete enrollment");
    setSubmitting(false);
  }
};


  return (
    <section className="relative z-10 min-h-[calc(100vh-120px)] overflow-hidden pt-28 pb-16 md:pt-36"style={{marginBottom:"100px"}}>
      <div className="container">
        <div className="mx-auto max-w-[900px]">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center text-sm text-body-color backdrop-blur-xl dark:bg-white/5 dark:text-body-color-dark">
            Preparing delete confirmation...
          </div>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
          <button
            aria-label="Close"
            onClick={close}
            className="absolute inset-0 bg-black/70 backdrop-blur-[2px]"
          />
          <div
            className="
              relative w-full max-w-[520px]
              rounded-3xl
              border border-white/15
              bg-white/10
              p-6 sm:p-8
              shadow-2xl
              backdrop-blur-2xl
              dark:bg-white/5
            "
            style={{ transform: "translateY(-12px)" }}
          >
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/15 ring-1 ring-red-500/25">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                className="text-red-500"
              >
                <path
                  d="M3 6h18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M8 6V4h8v2"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M6 6l1 16h10l1-16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
                <path
                  d="M10 11v6M14 11v6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <h3 className="text-center text-2xl font-bold text-white">
              Delete Enrollment?
            </h3>

            <p className="mt-2 text-center text-sm text-body-color dark:text-body-color-dark">
              {meta?.studentName || meta?.courseTitle ? (
                <>
                  Remove{" "}
                  <span className="font-semibold text-white">
                    {meta.studentName || "this student"}
                  </span>{" "}
                  from{" "}
                  <span className="font-semibold text-white">
                    “{meta.courseTitle || "this course"}”
                  </span>
                  . This action cannot be undone.
                </>
              ) : (
                <>
                  This action cannot be undone. Are you sure you want to delete
                  this enrollment?
                </>
              )}
            </p>

            {error && (
              <div className="mt-5 rounded-2xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {error}
              </div>
            )}

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={close}
                disabled={submitting}
                className="
                  w-full sm:w-1/2
                  rounded-2xl
                  border border-white/20
                  bg-white/10
                  px-6 py-3
                  text-sm font-semibold
                  text-white
                  shadow-sm
                  backdrop-blur-lg
                  transition
                  hover:bg-white/15 hover:border-white/30
                  disabled:opacity-60
                "
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={submitting}
                className="
                  w-full sm:w-1/2
                  rounded-2xl
                  bg-red-600
                  px-6 py-3
                  text-sm font-semibold text-white
                  shadow-lg shadow-red-600/20
                  transition
                  hover:bg-red-700
                  active:scale-[0.99]
                  disabled:opacity-60
                "
              >
                {submitting ? "Deleting..." : "Delete"}
              </button>
            </div>

            <p className="mt-5 text-center text-xs text-white/50">
              Enrollment ID: <span className="font-semibold">{id}</span>
            </p>
          </div>
        </div>
      )}
    </section>
  );
};

export default DeleteEnrollmentPage;
