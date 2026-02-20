"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

type Enrollment = any;

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <section
      className="relative z-10 overflow-hidden pt-36 pb-16 md:pb-20 lg:pt-[170px] lg:pb-24"
      style={{ marginTop: "-60px" }}
    >
      <div className="container">
        <div className="-mx-4 flex flex-wrap justify-center">
          <div className="w-full px-4">
            <div
              className="
                mx-auto
                w-full
                max-w-[92%]
                sm:max-w-[980px]
                rounded-2xl
                border border-white/20
                bg-white/10
                p-6
                shadow-three
                backdrop-blur-xl
                ring-1 ring-white/10
                dark:border-white/10
                dark:bg-white/5
                dark:ring-white/10
                sm:p-8
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
    <div className="flex flex-col items-center justify-center gap-3 py-10">
      <div className="flex items-center gap-2">
        <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-black/60 dark:bg-white/80 [animation-delay:-0.2s]" />
        <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-black/60 dark:bg-white/80 [animation-delay:-0.1s]" />
        <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-black/60 dark:bg-white/80" />
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
  const base = "rounded-xl border px-4 py-3 text-sm";
  const variant =
    type === "error"
      ? "border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400"
      : "border-white/20 bg-white/10 text-body-color dark:border-white/10 dark:bg-white/5 dark:text-body-color-dark";

  return <div className={`${base} ${variant}`}>{children}</div>;
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

        const arr = Array.isArray(data) ? data : (data?.items ?? []);

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
      <Shell>
        <LoadingBlock text="Loading enrollments..." />
      </Shell>
    );
  }

  if (error) {
    return (
      <Shell>
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/20 text-black dark:bg-white/10 dark:text-white">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 12a4.5 4.5 0 1 0-4.5-4.5A4.5 4.5 0 0 0 12 12Zm0 2.25c-4.2 0-7.5 2.1-7.5 4.5v.75h15v-.75c0-2.4-3.3-4.5-7.5-4.5Z"
                fill="currentColor"
                opacity="0.9"
              />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-black dark:text-white">
            My Enrollments
          </h1>
          <p className="text-body-color dark:text-body-color-dark mt-1 text-sm font-medium">
            Courses you are enrolled in.
          </p>
        </div>

        <Alert type="error">{error}</Alert>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            onClick={() => router.push("/courses")}
            className="
              rounded-xl border border-white/20 bg-white/10
              px-6 py-3 text-sm font-semibold text-black
              transition duration-300 hover:bg-white/15
              dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10
            "
          >
            Back
          </button>

          <button
            onClick={() => window.location.reload()}
            className="
              shadow-submit dark:shadow-submit-dark
              bg-primary hover:bg-primary/90
              rounded-xl px-6 py-3 text-sm font-semibold text-white
              transition duration-300
            "
          >
            Retry
          </button>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-black dark:text-white">
            My Enrollments
          </h1>
          <p className="text-body-color dark:text-body-color-dark mt-1 text-sm font-medium">
            Courses you are enrolled in.
          </p>
        </div>

        <button
          onClick={() => router.push("/courses")}
          className="
            rounded-xl border border-white/20 bg-white/10
            px-6 py-3 text-sm font-semibold text-black
            transition duration-300 hover:bg-white/15
            dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10
          "
        >
          Back
        </button>
      </div>

      {enrollments.length === 0 ? (
        <Alert type="info">You havent any enrollments yet.</Alert>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
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
                  rounded-2xl
                  border border-white/20
                  bg-white/10
                  p-6
                  shadow-sm
                  transition duration-300
                  hover:bg-white/15 hover:border-white/30
                  dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10
                "
              >
                <h3 className="mb-2 text-lg font-bold text-black dark:text-white">
                  {course?.title ?? course?.Title ?? "Course"}
                </h3>

                <p className="text-body-color dark:text-body-color-dark mb-4 text-sm">
                  {course?.description ??
                    course?.Description ??
                    "No description"}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="text-body-color dark:text-body-color-dark text-xs">
                    Category:{" "}
                    <span className="font-semibold">
                      {course?.categoryName ?? course?.CategoryName ?? "-"}
                    </span>
                  </span>

                  <button
                    onClick={() => {
                      const id =
                        course?.CourseId ?? course?.courseId ?? courseId ?? "";
                      router.push(`/courses/details/${id}`);
                    }}
                    className="text-primary text-xs font-semibold hover:underline disabled:opacity-60 disabled:cursor-not-allowed"
                    disabled={!canView}
                  >
                    View Course
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Shell>
  );
};

export default MyEnrollmentsPage;