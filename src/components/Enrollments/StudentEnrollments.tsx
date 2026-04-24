"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useStudentEnrollments } from "@/hooks/useEnrollments";
import type { Enrollment } from "@/models/enrollment";

type SelectedEnrollment = {
  key: string;
  courseId: string;
  courseTitle: string;
};

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <section
        className="relative z-10 min-h-[80vh] overflow-hidden pt-36 pb-16 opacity-0 animate-[fadeInUp_.6s_ease-out_forwards] md:pb-20 lg:pt-[170px] lg:pb-24"
        style={{ marginTop: "-60px" }}
      >
        <div className="absolute left-1/2 top-0 -z-10 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />

        <div className="container">
          <div className="-mx-4 flex flex-wrap justify-center">
            <div className="w-full px-4">
              <div className="mx-auto w-full max-w-[92%] rounded-[2rem] border border-black/5 bg-white/80 p-6 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-[#0B1220]/80 sm:p-10 lg:max-w-[1100px]">
                {children}
              </div>
            </div>
          </div>
        </div>
      </section>
      <style>{`
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}

function LoadingState() {
  return (
    <Shell>
      <div className="flex flex-col items-center justify-center py-20 opacity-0 animate-[fadeInUp_.6s_ease-out_forwards]">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" />
          <span className="h-3 w-3 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]" />
          <span className="h-3 w-3 animate-bounce rounded-full bg-primary" />
        </div>
        <p className="mt-4 text-sm font-semibold text-body-color dark:text-body-color-dark">
          Loading student records...
        </p>
      </div>
    </Shell>
  );
}

const StudentEnrollmentsPage = () => {
  const params = useParams();
  const router = useRouter();
  const studentId = String(params?.studentId ?? "");
  const { enrollments, loading, error, deletingKey, deleteStudentCourse } =
    useStudentEnrollments(studentId);

  const [selected, setSelected] = useState<SelectedEnrollment | null>(null);

  const studentName = enrollments[0]?.studentName || "Student";
  const items = enrollments.filter((enrollment) => Boolean(enrollment.courseId));

  const openDelete = (enrollment: Enrollment, index: number) => {
    setSelected({
      key: `${studentId}-${enrollment.courseId || index}`,
      courseId: enrollment.courseId,
      courseTitle: enrollment.courseTitle || "this course",
    });
  };

  const confirmDelete = async () => {
    if (!selected) return;

    await deleteStudentCourse(selected.key, selected.courseId);
    setSelected(null);
  };

  if (loading) return <LoadingState />;

  return (
    <Shell>
      <div className="mb-8 flex flex-col gap-6 border-b border-black/5 pb-8 opacity-0 animate-[fadeInUp_.6s_ease-out_forwards] [animation-delay:100ms] dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-primary to-blue-400 text-xl font-bold text-white shadow-lg">
            {studentName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-black dark:text-white sm:text-3xl">
              {studentName}
            </h1>
            <p className="text-sm font-medium text-body-color dark:text-body-color-dark">
              Enrolled Courses Overview
            </p>
          </div>
        </div>

        <button
          onClick={() => router.push("/enrollments")}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-black/10 bg-white px-6 py-3 text-sm font-bold text-black shadow-sm transition duration-300 hover:bg-gray-50 active:scale-[0.98] dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
        >
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to List
        </button>
      </div>

      {error && (
        <div className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-sm font-medium text-red-600 opacity-0 animate-[fadeInUp_.6s_ease-out_forwards] dark:text-red-400">
          {error}
        </div>
      )}

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-black/5 bg-black/5 py-16 text-center opacity-0 animate-[fadeInUp_.6s_ease-out_forwards] [animation-delay:200ms] dark:border-white/5 dark:bg-white/5">
          <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" className="mb-4 text-black/40 dark:text-white/40">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <h3 className="text-lg font-bold text-black dark:text-white">
            No enrollments found
          </h3>
          <p className="mt-2 text-sm text-body-color dark:text-body-color-dark">
            This student is not enrolled in any courses yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((enrollment, index) => {
            const key = `${studentId}-${enrollment.courseId || index}`;
            const isDeleting = deletingKey === key;

            return (
              <div
                key={key}
                className="group flex flex-col justify-between rounded-2xl border border-black/5 bg-white/60 p-6 opacity-0 animate-[fadeInUp_.6s_ease-out_forwards] shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg dark:border-white/10 dark:bg-white/5 dark:hover:border-primary/50 dark:hover:bg-white/10"
                style={{ animationDelay: `${150 + index * 70}ms` }}
              >
                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <span className="inline-flex items-center rounded-lg bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary dark:bg-primary/20">
                      Active
                    </span>
                  </div>
                  <h3 className="mb-2 line-clamp-2 text-lg font-extrabold text-black transition-colors group-hover:text-primary dark:text-white">
                    {enrollment.courseTitle || "Untitled Course"}
                  </h3>
                  <p className="line-clamp-2 text-sm text-body-color dark:text-body-color-dark">
                    Student has access to this course&apos;s materials.
                  </p>
                </div>

                <div className="mt-6 border-t border-black/5 pt-4 dark:border-white/10">
                  <button
                    type="button"
                    onClick={() => openDelete(enrollment, index)}
                    disabled={isDeleting}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-500/10 px-5 py-2.5 text-sm font-bold text-red-600 transition duration-300 hover:bg-red-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-50 dark:bg-red-500/20 dark:text-red-400 dark:hover:bg-red-600 dark:hover:text-white"
                  >
                    {isDeleting ? "Deleting..." : "Revoke Access"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 opacity-0 animate-[fadeInUp_.3s_ease-out_forwards]">
          <div
            className="absolute inset-0 bg-[#0B1220]/60 backdrop-blur-sm transition-opacity"
            onClick={() => setSelected(null)}
          />

          <div className="relative z-10 w-full max-w-[440px] rounded-3xl border border-black/5 bg-white p-8 shadow-2xl dark:border-white/10 dark:bg-[#151E32]">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 text-red-500 dark:bg-red-500/20">
              <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>

            <h2 className="text-center text-2xl font-extrabold text-black dark:text-white">
              Revoke Enrollment?
            </h2>

            <p className="mt-3 text-center text-sm leading-relaxed text-body-color dark:text-body-color-dark">
              Are you sure you want to remove{" "}
              <span className="font-bold text-black dark:text-white">{studentName}</span>{" "}
              from{" "}
              <span className="font-bold text-black dark:text-white">
                &quot;{selected.courseTitle}&quot;
              </span>
              ?
            </p>

            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                onClick={() => setSelected(null)}
                className="rounded-xl border border-black/10 bg-white px-6 py-3.5 text-sm font-bold text-black shadow-sm transition duration-300 hover:bg-gray-50 active:scale-[0.98] dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                className="rounded-xl bg-red-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-red-500/30 transition duration-300 hover:bg-red-700 active:scale-[0.98]"
              >
                Yes, Revoke
              </button>
            </div>
          </div>
        </div>
      )}
    </Shell>
  );
};

export default StudentEnrollmentsPage;
