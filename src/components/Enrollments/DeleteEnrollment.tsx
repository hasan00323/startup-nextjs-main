"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDeleteEnrollment } from "@/hooks/useEnrollments";

type EnrollmentMeta = {
  studentName?: string;
  courseTitle?: string;
};

const DeleteEnrollmentPage = () => {
  const params = useParams();
  const id = (params?.id as string) ?? "";
  const router = useRouter();
  const { submitting, error, remove } = useDeleteEnrollment(id);

  const [open, setOpen] = useState(true);
  const [meta, setMeta] = useState<EnrollmentMeta>({});

  useEffect(() => {
    if (!id) {
      router.push("/enrollments");
      return;
    }

    try {
      const raw = localStorage.getItem("deleteEnrollmentMeta");
      if (raw) setMeta(JSON.parse(raw));
    } catch {
      // Ignore parse errors
    }
  }, [id, router]);

  const close = () => {
    setOpen(false);
    router.push("/enrollments");
  };

  const handleDelete = async () => {
    const deleted = await remove();
    if (deleted) {
      localStorage.removeItem("deleteEnrollmentMeta");
      router.push("/enrollments");
    }
  };

  return (
    <section className="relative z-10 flex min-h-[80vh] items-center justify-center overflow-hidden pt-28 pb-16 opacity-0 animate-[fadeIn_.5s_ease-out_forwards]">
      {/* Background Glow */}
      <div className="absolute left-1/2 top-1/2 -z-10 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500/5 blur-[120px]"></div>

      <div className="container">
        <div className="mx-auto max-w-[900px]">
          {/* Skeleton/Placeholder background content */}
          <div className="rounded-3xl border border-black/5 bg-white/50 p-8 text-center backdrop-blur-md dark:border-white/5 dark:bg-white/5">
            <div className="mx-auto h-4 w-48 animate-pulse rounded bg-black/5 dark:bg-white/5"></div>
          </div>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
          {/* Backdrop Blur Overlay */}
          <div
            className="absolute inset-0 bg-[#0B1220]/60 backdrop-blur-md transition-opacity"
            onClick={!submitting ? close : undefined}
          />

          {/* Modal Card */}
          <div
            className="
              relative w-full max-w-[500px]
              rounded-[2.5rem]
              border border-black/5
              bg-white/90
              p-8 sm:p-10
              shadow-[0_20px_50px_rgba(0,0,0,0.2)]
              backdrop-blur-2xl
              dark:border-white/10
              dark:bg-[#151E32]/90
              opacity-0 animate-[scaleIn_.3s_ease-out_forwards]
            "
          >
            {/* Warning Icon */}
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-500/10 dark:bg-red-500/20">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-500 text-white shadow-lg shadow-red-500/30">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2m-6 5v6m4-6v6" />
                </svg>
              </div>
            </div>

            <h3 className="text-center text-2xl font-black tracking-tight text-black dark:text-white sm:text-3xl">
              Confirm Deletion
            </h3>

            <div className="mt-4 text-center">
              <p className="text-base leading-relaxed text-body-color dark:text-body-color-dark">
                {meta?.studentName || meta?.courseTitle ? (
                  <>
                    Are you sure you want to remove <br />
                    <span className="font-bold text-black dark:text-white">
                       {meta.studentName || "the student"}
                    </span>{" "}
                    from{" "}
                    <span className="font-bold text-black dark:text-white">
                      “{meta.courseTitle || "the course"}”
                    </span>
                    ?
                  </>
                ) : (
                  "Are you sure you want to delete this enrollment record?"
                )}
              </p>
              <p className="mt-3 text-sm font-medium text-red-500/80">
                This action is permanent and cannot be undone.
              </p>
            </div>

            {error && (
              <div className="mt-6 flex items-center gap-2 rounded-2xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm font-semibold text-red-600 dark:text-red-400">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                {error}
              </div>
            )}

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={close}
                disabled={submitting}
                className="
                  flex w-full items-center justify-center rounded-2xl border border-black/10 bg-white
                  px-6 py-4 text-sm font-bold text-black transition-all
                  hover:bg-gray-50 active:scale-[0.98] disabled:opacity-50
                  dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10
                  sm:w-1/2
                "
              >
                Go Back
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={submitting}
                className="
                  flex w-full items-center justify-center gap-2 rounded-2xl bg-red-600
                  px-6 py-4 text-sm font-bold text-white shadow-xl shadow-red-600/20
                  transition-all hover:bg-red-700 active:scale-[0.98]
                  disabled:opacity-70 sm:w-1/2
                "
              >
                {submitting ? (
                  <>
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeOpacity="0.3" />
                      <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Deleting...
                  </>
                ) : (
                  "Confirm Delete"
                )}
              </button>
            </div>

            <div className="mt-6 flex items-center justify-center gap-2 opacity-40">
               <span className="h-1 w-1 rounded-full bg-body-color"></span>
               <p className="text-[10px] font-bold uppercase tracking-widest text-body-color dark:text-white">
                 Ref ID: {id}
               </p>
               <span className="h-1 w-1 rounded-full bg-body-color"></span>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </section>
  );
};

export default DeleteEnrollmentPage;
