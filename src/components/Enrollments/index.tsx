"use client";

import Link from "next/link";
import SingleEnrollment from "../../components/Enrollments/SingleEnrollment";
import { useAllEnrollments } from "@/hooks/useEnrollments";

export default function EnrollmentsPage() {
  const { enrollments, loading, error } = useAllEnrollments();

  return (
    <>
      <section className="relative z-10 min-h-screen overflow-hidden pt-28 pb-16 md:pt-36 md:pb-20 lg:pt-[160px] lg:pb-28 opacity-0 animate-[enPageIn_0.6s_ease-out_forwards]">
        
        {/* Glow Effect الخلفي */}
        <div className="absolute left-1/2 top-0 -z-10 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-primary/10 blur-[150px]"></div>

        <div className="container">
          
          {/* Header Section */}
          <div className="mx-auto mb-8 max-w-[1200px] flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between opacity-0 animate-[enItemUp_0.6s_ease-out_forwards] [animation-delay:120ms]">
            <div className="opacity-0 animate-[enItemUp_0.6s_ease-out_forwards] [animation-delay:180ms]">
              <h1 className="text-3xl font-extrabold tracking-tight text-black dark:text-white sm:text-4xl">
                Enrollments Management
              </h1>
              <p className="mt-2 text-sm font-medium text-body-color dark:text-body-color-dark">
                View, manage, and create new course enrollments for students.
              </p>
            </div>

            <div className="flex items-center gap-3 opacity-0 animate-[enItemUp_0.6s_ease-out_forwards] [animation-delay:240ms]">
              <Link
                href="/enrollments/create"
                className="
                  inline-flex items-center justify-center gap-2 rounded-xl
                  bg-primary px-6 py-3.5 text-sm font-bold text-white
                  shadow-lg shadow-primary/30 transition-all duration-300
                  hover:-translate-y-1 hover:bg-primary/90 active:scale-[0.98]
                "
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-lg leading-none">
                  +
                </span>
                Create Enrollment
              </Link>
            </div>
          </div>

          {/* Main Dashboard Card */}
          <div
            className="
              mx-auto max-w-[1200px]
              rounded-[2rem] border border-black/5
              bg-white/80 shadow-2xl backdrop-blur-xl
              dark:border-white/10 dark:bg-[#0B1220]/80
              opacity-0 animate-[enCardIn_0.7s_ease-out_forwards] [animation-delay:200ms]
            "
          >
            {/* Card Header */}
            <div className="flex flex-col gap-4 border-b border-black/5 px-6 py-5 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between sm:px-8 opacity-0 animate-[enItemUp_0.6s_ease-out_forwards] [animation-delay:260ms]">
              <div className="flex items-center gap-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary dark:bg-primary/20">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  </svg>
                </span>
                <div>
                  <h2 className="text-lg font-bold text-black dark:text-white">
                    All Records
                  </h2>
                  <p className="text-sm font-medium text-body-color dark:text-body-color-dark">
                    {loading ? "Counting..." : `Total: ${enrollments.length} enrollment(s)`}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-green-500/20 bg-green-50 px-3 py-1 text-xs font-bold text-green-700 dark:border-green-500/30 dark:bg-green-500/10 dark:text-green-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></span>
                  Live Sync
                </span>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-6 sm:p-8">
              {loading && (
                <div className="flex flex-col items-center justify-center py-20 opacity-0 animate-[enFade_0.45s_ease-out_forwards]">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" />
                    <span className="h-3 w-3 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]" />
                    <span className="h-3 w-3 animate-bounce rounded-full bg-primary" />
                  </div>
                  <p className="mt-4 text-sm font-semibold text-body-color dark:text-body-color-dark">
                    Fetching data...
                  </p>
                </div>
              )}

              {!loading && error && (
                <div className="rounded-2xl border border-red-500/30 bg-red-50 px-6 py-5 text-center dark:bg-red-500/10 opacity-0 animate-[enItemUp_0.6s_ease-out_forwards]">
                  <p className="font-semibold text-red-600 dark:text-red-400 mb-4">{error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="inline-flex items-center rounded-xl bg-red-600 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-red-700 active:scale-95"
                  >
                    Try Again
                  </button>
                </div>
              )}

              {!loading && !error && enrollments.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-center opacity-0 animate-[enItemUp_0.6s_ease-out_forwards]">
                  <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-black/5 dark:bg-white/5">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-black/40 dark:text-white/40">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-black dark:text-white">
                    No enrollments found
                  </h3>
                  <p className="mt-2 text-sm text-body-color dark:text-body-color-dark">
                    It looks like there are no active enrollments in the system.
                  </p>
                  <Link
                    href="/enrollments/create"
                    className="mt-6 inline-flex rounded-xl border border-black/10 bg-white px-6 py-2.5 text-sm font-bold text-black shadow-sm transition hover:bg-gray-50 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
                  >
                    Add the first one
                  </Link>
                </div>
              )}

              {!loading && !error && enrollments.length > 0 && (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {enrollments.map((enrollment, index) => {
                    const key = String(
                      enrollment.id ||
                        enrollment.enrollmentId ||
                        `${enrollment.studentId || "student"}-${
                          enrollment.courseId || "course"
                        }-${index}`
                    );

                    return (
                      <div
                        key={key}
                        className="opacity-0 animate-[enCardIn_0.65s_ease-out_forwards]"
                        style={{ animationDelay: `${120 + index * 70}ms` }}
                      >
                        {/* افترضت أن SingleEnrollment مكون منفصل لديك. 
                          إذا أردت، يمكنني أيضاً تزويدك بالكود المحدث للـ SingleEnrollment ليتطابق مع الثيم.
                        */}
                        <SingleEnrollment enrollment={enrollment} />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes enPageIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes enCardIn {
          0% { opacity: 0; transform: translateY(20px) scale(0.98); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes enItemUp {
          0% { opacity: 0; transform: translateY(12px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes enFade {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          * {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>
    </>
  );
}
