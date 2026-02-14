"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import SingleEnrollment from "../../components/Enrollments/SingleEnrollment";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

export default function EnrollmentsPage() {
  const router = useRouter();

  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const token = useMemo(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
  }, []);

 useEffect(() => {
  if (!token) {
    router.push("/signin");
    return;
  }

  setLoading(true);
  setError(null);

  apiFetch(
    "https://localhost:7145/api/enrollments/GetAllEnrollments",
    {
      method: "GET",
    },
    router
  )
    .then(async (res) => {
      if (!res.ok) {
        const t = await res.text().catch(() => "");
        throw new Error(t || `Failed (${res.status})`);
      }

      const data = await res.json();

      if (!Array.isArray(data)) {
        console.log("GetAllEnrollments returned:", data);
        throw new Error("API did not return an array");
      }

      setEnrollments(data);
    })
    .catch((e) => setError(e?.message || "Something went wrong"))
    .finally(() => setLoading(false));
}, [token, router]);

  return (
    <section className="relative z-10 overflow-hidden pt-28 pb-16 md:pt-36 md:pb-20 lg:pt-[160px] lg:pb-28">
      <div className="container">
        {/* Top Row */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-black dark:text-white sm:text-4xl">
              Enrollments
            </h1>
            <p className="mt-2 text-sm text-body-color dark:text-body-color-dark">
              Manage enrollments and create new ones easily.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/enrollments/create"
              className="
                ease-in-up shadow-btn hover:shadow-btn-hover
                bg-primary hover:bg-primary/90
                inline-flex items-center justify-center
                rounded-2xl
                px-5 py-3
                text-sm font-semibold text-white
                transition duration-300
                active:scale-[0.99]
              "
            >
              <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/15">
                +
              </span>
              Create Enrollment
            </Link>
          </div>
        </div>

        {/* Glass Wrapper Card */}
        <div
          className="
            rounded-3xl
            border border-white/15
            bg-white/10
            shadow-two
            backdrop-blur-xl
            dark:border-white/10
            dark:bg-white/5
          "
        >
          {/* Card Header */}
          <div className="flex flex-col gap-2 border-b border-white/10 px-5 py-4 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between sm:px-7">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-primary/15 text-primary dark:bg-white/10 dark:text-white">
                {/* simple icon */}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M7 7h10M7 12h10M7 17h10"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <div>
                <p className="text-sm font-semibold text-black dark:text-white">
                  All Enrollments
                </p>
                <p className="text-xs text-body-color dark:text-body-color-dark">
                  {loading ? "Loading..." : `${enrollments.length} record(s)`}
                </p>
              </div>
            </div>

            {/* Right small actions (optional later: search/filter) */}
            <div className="flex items-center gap-2">
              <span className="hidden rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-black/80 backdrop-blur-md dark:border-white/10 dark:bg-white/5 dark:text-white/80 sm:inline-block">
                Secure
              </span>
            </div>
          </div>

          {/* Card Body */}
          <div className="px-5 py-6 sm:px-7">
            {/* Loading */}
            {loading && (
              <div className="flex items-center justify-center py-16">
                <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-5 py-4 backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white/80 dark:border-white/20 dark:border-t-white" />
                  <p className="text-sm font-medium text-black/80 dark:text-white/80">
                    Loading enrollments...
                  </p>
                </div>
              </div>
            )}

            {/* Error */}
            {!loading && error && (
              <div className="rounded-2xl border border-red-500/25 bg-red-500/10 px-5 py-4 text-sm text-red-600 dark:text-red-400">
                {error}
              </div>
            )}

            {/* Empty */}
            {!loading && !error && enrollments.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="mb-4 rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M7 7h10M7 12h6M7 17h10"
                      stroke="currentColor"
                      className="text-body-color dark:text-body-color-dark"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <p className="text-base font-semibold text-black dark:text-white">
                  No enrollments yet
                </p>
                <p className="mt-1 text-sm text-body-color dark:text-body-color-dark">
                  Create your first enrollment to get started.
                </p>
                
              </div>
            )}

            {/* Grid */}
            {!loading && !error && enrollments.length > 0 && (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                {enrollments.map((enrollment: any, index: number) => {
                  const key = String(
                    enrollment?.id ??
                      enrollment?.Id ??
                      enrollment?.enrollmentId ??
                      enrollment?.EnrollmentId ??
                      `${enrollment?.studentId ?? "student"}-${
                        enrollment?.courseId ?? "course"
                      }-${index}`
                  );

                  return <SingleEnrollment key={key} enrollment={enrollment} />;
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
