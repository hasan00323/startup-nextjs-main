"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

const CourseDetailsPage = () => {
  const params = useParams();
  const id = params?.id as string;

  const router = useRouter();

  const [course, setCourse] = useState<any>(null);
  const [deleting, setDeleting] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const token = useMemo(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
  }, []);

 useEffect(() => {
  if (!id) return;

  if (!token) {
    router.push("/signin");
    return;
  }

  let cancelled = false;

  const loadCourse = async () => {
    try {
      setPageLoading(true);
      setError(null);

      const res = await apiFetch(
        `https://localhost:7145/api/courses/GetCourse/${id}`,
        { method: "GET" },
        router
      );

      if (!res.ok) {
        const t = await res.text().catch(() => "");
        throw new Error(t || `Failed to load course (${res.status})`);
      }

      const data = await res.json();
      if (!cancelled) setCourse(data);
    } catch (e: any) {
      if (!cancelled) setError(e?.message || "Failed to load course.");
    } finally {
      if (!cancelled) setPageLoading(false);
    }
  };

  loadCourse();

  return () => {
    cancelled = true;
  };
}, [id, router, token]);

  const handleDelete = async () => {
    const confirmed = confirm("Are you sure you want to delete this course?");
    if (!confirmed) return;

    try {
      setDeleting(true);

      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/signin");
        return;
      }

      const res = await fetch(`https://localhost:7145/api/courses/deleteCourse/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const t = await res.text().catch(() => "");
        throw new Error(t || `Failed to delete course (${res.status})`);
      }

      alert("Course deleted successfully");
      router.push("/courses");
    } catch (err: any) {
      alert(err?.message || "Something went wrong while deleting");
    } finally {
      setDeleting(false);
    }
  };

  const SectionShell = ({ children }: { children: React.ReactNode }) => (
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
                sm:max-w-[520px]
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

  if (pageLoading) {
    return (
      <SectionShell>
        <div className="text-center text-body-color dark:text-body-color-dark">Loading...</div>
      </SectionShell>
    );
  }

  if (error) {
    return (
      <SectionShell>
        <h3 className="mb-2 text-center text-xl font-bold text-black dark:text-white">
          Something went wrong
        </h3>

        <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400">
          {error}
        </div>

        <button
          onClick={() => router.push("/courses")}
          className="
            block w-full rounded-xl
            border border-white/20
            bg-white/10
            px-10 py-3.5
            text-center text-sm font-semibold
            text-black transition duration-300
            hover:bg-white/15
            dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10
          "
        >
          Back to Courses
        </button>
      </SectionShell>
    );
  }

  if (!course) return null;

  return (
    <SectionShell>
      <div className="mx-auto mb-5 flex h-11 w-11 items-center justify-center rounded-full bg-white/20 text-black dark:bg-white/10 dark:text-white">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M7 4h10a2 2 0 0 1 2 2v14l-7-3-7 3V6a2 2 0 0 1 2-2Z"
            fill="currentColor"
            opacity="0.9"
          />
        </svg>
      </div>
      <div className="mb-6 text-center">
        <h1 className="mb-2 break-words text-2xl font-bold text-black dark:text-white">
          {course.title}
        </h1>

        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-black dark:border-white/10 dark:bg-white/5 dark:text-white">
            {course.category || course.categoryName || "Uncategorized"}
          </span>

          <span className="rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary">
            {typeof course.price === "number" ? `$${course.price}` : "No price"}
          </span>

          <span className="text-body-color dark:text-body-color-dark text-xs">
            ID: {String(id)}
          </span>
        </div>
      </div>

      <div className="mb-6 rounded-xl border border-white/20 bg-white/10 px-4 py-4 dark:border-white/10 dark:bg-white/5">
        <p className="text-body-color dark:text-body-color-dark text-sm leading-relaxed">
          {course.description || "No description provided."}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-white/20 bg-white/10 px-4 py-4 dark:border-white/10 dark:bg-white/5">
          <p className="text-xs font-semibold text-black dark:text-white">Instructor</p>
          <p className="text-body-color dark:text-body-color-dark mt-2 text-sm">
            {course.instructorName || "-"}
          </p>
        </div>

        <div className="rounded-xl border border-white/20 bg-white/10 px-4 py-4 dark:border-white/10 dark:bg-white/5">
          <p className="text-xs font-semibold text-black dark:text-white">Category</p>
          <p className="text-body-color dark:text-body-color-dark mt-2 text-sm">
            {course.category || course.categoryName || "-"}
          </p>
        </div>

        <div className="rounded-xl border border-white/20 bg-white/10 px-4 py-4 dark:border-white/10 dark:bg-white/5">
          <p className="text-xs font-semibold text-black dark:text-white">Start Date</p>
          <p className="text-body-color dark:text-body-color-dark mt-2 text-sm">
            {course.startDate ? new Date(course.startDate).toLocaleString() : "-"}
          </p>
        </div>

        <div className="rounded-xl border border-white/20 bg-white/10 px-4 py-4 dark:border-white/10 dark:bg-white/5">
          <p className="text-xs font-semibold text-black dark:text-white">End Date</p>
          <p className="text-body-color dark:text-body-color-dark mt-2 text-sm">
            {course.endDate ? new Date(course.endDate).toLocaleString() : "-"}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
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
          onClick={() => router.push(`/courses/edit/${id}`)}
          className="
            shadow-submit dark:shadow-submit-dark
            bg-primary hover:bg-primary/90
            rounded-xl px-6 py-3 text-sm font-semibold text-white
            transition duration-300
          "
        >
          Edit
        </button>

        <button
          onClick={handleDelete}
          disabled={deleting}
          className="
            rounded-xl bg-red-600 px-6 py-3 text-sm font-semibold text-white
            transition duration-300 hover:bg-red-700 disabled:opacity-60
          "
        >
          {deleting ? "Deleting..." : "Delete"}
        </button>
      </div>

      {/* Hint */}
      <p className="text-body-color dark:text-body-color-dark mt-6 text-center text-xs">
        Tip: Use <span className="font-semibold">Edit</span> to update course details.
      </p>
    </SectionShell>
  );
};

export default CourseDetailsPage;
