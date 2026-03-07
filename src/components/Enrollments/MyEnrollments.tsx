"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

type Enrollment = any;

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <section
      className="relative z-10 overflow-hidden pt-36 pb-16 md:pb-20 lg:pt-[170px] lg:pb-24 opacity-0 animate-[enSectionIn_.6s_ease-out_forwards]"
      style={{ marginTop: "-60px" }}
    >
      <div className="absolute left-1/2 top-0 -z-10 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]"></div>

      <div className="container">
        <div className="-mx-4 flex flex-wrap justify-center">
          <div className="w-full px-4">
            <div
              className="
                mx-auto
                w-full
                max-w-[92%]
                sm:max-w-[1100px]
                rounded-[2rem]
                border border-black/5
                bg-white/80
                p-6
                shadow-2xl
                backdrop-blur-xl
                dark:border-white/10
                dark:bg-[#0B1220]/80
                sm:p-10
                opacity-0 animate-[enCardIn_.7s_ease-out_forwards]
              "
            >
              {children}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function LoadingBlock({ text }: { text: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 opacity-0 animate-[enItemUp_.6s_ease-out_forwards]">
      <div className="flex items-center gap-2">
        <span className="h-3 w-3 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" />
        <span className="h-3 w-3 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]" />
        <span className="h-3 w-3 animate-bounce rounded-full bg-primary" />
      </div>
      <p className="text-sm font-semibold text-body-color dark:text-body-color-dark">
        {text}
      </p>
    </div>
  );
}

function Alert({
  type,
  children,
}: {
  type: "error" | "info";
  children: React.ReactNode;
}) {
  const base =
    "rounded-2xl border px-5 py-4 text-sm font-medium opacity-0 animate-[enItemUp_.6s_ease-out_forwards] flex items-center gap-3";
  
  const variant =
    type === "error"
      ? "border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400"
      : "border-blue-500/20 bg-blue-500/10 text-blue-700 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-300";

  const Icon = type === "error" ? (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
  ) : (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
  );

  return (
    <div className={`${base} ${variant}`}>
      {Icon}
      {children}
    </div>
  );
}

const MyEnrollmentsPage = () => {
  const router = useRouter();

  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token =
      typeof window === "undefined" ? null : localStorage.getItem("token");

    if (!token) {
      setError("You must sign in first.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    apiFetch(
      "https://localhost:7145/api/courses/MyCourses",
      {
        method: "GET",
      },
      router
    )
      .then(async (res) => {
        if (res.status === 404) {
          setEnrollments([]);
          return;
        }

        if (!res.ok) {
          const t = await res.text().catch(() => "");
          throw new Error(t || `Failed (${res.status})`);
        }

        const contentType = res.headers.get("content-type") || "";

        if (!contentType.includes("application/json")) {
          const t = await res.text().catch(() => "");
          const normalized = (t || "").toLowerCase();

          if (
            normalized.includes("no enroll") ||
            normalized.includes("no courses") ||
            normalized.includes("not found")
          ) {
            setEnrollments([]);
            return;
          }

          throw new Error(t || "Unexpected response");
        }

        const data = await res.json();
        const arr = Array.isArray(data) ? data : data?.items ?? [];

        if (!Array.isArray(arr)) {
          setEnrollments([]);
          return;
        }

        setEnrollments(arr);
      })
      .catch((e) => setError(e?.message || "Failed to load"))
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) {
    return (
      <>
        <Shell>
          <LoadingBlock text="Loading your educational journey..." />
        </Shell>
        <style>{`
          @keyframes enSectionIn { 0% { opacity: 0; transform: translateY(12px); } 100% { opacity: 1; transform: translateY(0); } }
          @keyframes enCardIn { 0% { opacity: 0; transform: translateY(18px) scale(0.98); } 100% { opacity: 1; transform: translateY(0) scale(1); } }
          @keyframes enItemUp { 0% { opacity: 0; transform: translateY(10px); } 100% { opacity: 1; transform: translateY(0); } }
        `}</style>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Shell>
          <div className="mb-8 text-center opacity-0 animate-[enItemUp_.6s_ease-out_forwards]">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-500">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h1 className="text-3xl font-extrabold text-black dark:text-white">
              Access Denied
            </h1>
            <p className="text-body-color dark:text-body-color-dark mt-2 text-base font-medium">
              We couldn't load your enrollments.
            </p>
          </div>

          <Alert type="error">{error}</Alert>

          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row opacity-0 animate-[enItemUp_.6s_ease-out_forwards]">
            <button
              onClick={() => router.push("/courses")}
              className="
                rounded-xl border border-black/10 bg-black/5
                px-8 py-3.5 text-sm font-bold text-black
                transition duration-300 hover:bg-black/10
                dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10
              "
            >
              Browse Courses
            </button>

            <button
              onClick={() => window.location.reload()}
              className="
                shadow-btn hover:shadow-btn-hover
                bg-primary hover:bg-primary/90
                rounded-xl px-8 py-3.5 text-sm font-bold text-white
                transition duration-300 active:scale-[0.98]
              "
            >
              Try Again
            </button>
          </div>
        </Shell>

        <style>{`
          @keyframes enSectionIn { 0% { opacity: 0; transform: translateY(12px); } 100% { opacity: 1; transform: translateY(0); } }
          @keyframes enCardIn { 0% { opacity: 0; transform: translateY(18px) scale(0.98); } 100% { opacity: 1; transform: translateY(0) scale(1); } }
          @keyframes enItemUp { 0% { opacity: 0; transform: translateY(10px); } 100% { opacity: 1; transform: translateY(0); } }
        `}</style>
      </>
    );
  }

  return (
    <>
      <Shell>
        <div className="mb-10 flex flex-col gap-6 border-b border-black/5 pb-8 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between opacity-0 animate-[enItemUp_.6s_ease-out_forwards]">
          <div>
            <div className="flex items-center gap-3">
               <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                 <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /></svg>
               </div>
               <h1 className="text-3xl font-extrabold text-black dark:text-white">
                 My Enrollments
               </h1>
            </div>
            <p className="text-body-color dark:text-body-color-dark mt-2 text-base font-medium">
              Pick up right where you left off.
            </p>
          </div>

          <button
            onClick={() => router.push("/courses")}
            className="
              inline-flex items-center justify-center gap-2
              rounded-xl border border-black/10 bg-white px-6 py-3 text-sm font-bold text-black
              shadow-sm transition duration-300 hover:bg-gray-50
              dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10
            "
          >
            Explore More
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </button>
        </div>

        {enrollments.length === 0 ? (
          <Alert type="info">You haven't enrolled in any courses yet. Start your journey today!</Alert>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {enrollments.map((en: any, index: number) => {
              const courseId =
                en?.courseId ?? en?.CourseId ?? en?.id ?? en?.Id ?? "";
              const key = String(courseId || index);
              const course = en?.course ?? en?.Course ?? en;
              const canView = Boolean(
                course?.CourseId ?? course?.courseId ?? courseId
              );

              return (
                <div
                  key={key}
                  className="
                    group
                    flex h-full flex-col
                    rounded-2xl
                    border border-black/5
                    bg-white/60
                    p-6
                    shadow-sm
                    backdrop-blur-md
                    transition-all duration-300
                    hover:-translate-y-1 hover:shadow-lg hover:border-primary/30
                    dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10 dark:hover:border-primary/50
                    opacity-0 animate-[enCardIn_.6s_ease-out_forwards]
                  "
                  style={{ animationDelay: `${100 + index * 70}ms` }}
                >
                  <div className="mb-4 flex items-center justify-between">
                    <span className="inline-flex items-center rounded-lg bg-black/5 px-2.5 py-1 text-xs font-bold text-black/70 dark:bg-white/10 dark:text-white/70">
                      {course?.categoryName ?? course?.CategoryName ?? "General"}
                    </span>
                    <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" title="Active Enrollment"></span>
                  </div>

                  <h3 className="mb-2 text-xl font-extrabold text-black transition-colors group-hover:text-primary dark:text-white line-clamp-2">
                    {course?.title ?? course?.Title ?? "Untitled Course"}
                  </h3>

                  <p className="text-body-color dark:text-body-color-dark mb-6 flex-1 text-sm line-clamp-3">
                    {course?.description ??
                      course?.Description ??
                      "No description provided for this course."}
                  </p>

                  <div className="mt-auto border-t border-black/5 pt-5 dark:border-white/10">
                    <button
                      onClick={() => {
                        const id =
                          course?.CourseId ??
                          course?.courseId ??
                          courseId ??
                          "";
                        router.push(`/courses/details/${id}`);
                      }}
                      className="
                        group/btn
                        inline-flex w-full items-center justify-center gap-2
                        rounded-xl bg-primary/10 px-5 py-3 text-sm font-bold text-primary
                        transition duration-300 hover:bg-primary hover:text-white
                        disabled:opacity-50 disabled:cursor-not-allowed
                        dark:bg-primary/20 dark:hover:bg-primary
                      "
                      disabled={!canView}
                    >
                      Continue Learning
                      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" className="transition-transform duration-300 group-hover/btn:translate-x-1"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Shell>

      <style>{`
        @keyframes enSectionIn { 0% { opacity: 0; transform: translateY(12px); } 100% { opacity: 1; transform: translateY(0); } }
        @keyframes enCardIn { 0% { opacity: 0; transform: translateY(18px) scale(0.98); } 100% { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes enItemUp { 0% { opacity: 0; transform: translateY(10px); } 100% { opacity: 1; transform: translateY(0); } }
      `}</style>
    </>
  );
};

export default MyEnrollmentsPage;