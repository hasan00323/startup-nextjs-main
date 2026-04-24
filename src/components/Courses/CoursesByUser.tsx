"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getErrorMessage } from "@/lib/errors";
import { requestJson } from "@/lib/api";
import SingleCourse from "@/components/Courses/SingleCourse";
import { useRequireAuth } from "@/hooks/useRequireAuth";

function normalizeCourseList(data: unknown) {
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object" && Array.isArray((data as { items?: unknown }).items)) {
    return (data as { items: unknown[] }).items;
  }
  return [];
}

export default function CoursesByUserPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated } = useRequireAuth();
  const userId = String(params?.id ?? "");

  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !userId) return;

    let cancelled = false;

    const loadCourses = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await requestJson<unknown>(
          `/courses/GetCourseByUser?userId=${encodeURIComponent(userId)}`,
          { method: "GET" },
          router
        );

        if (!cancelled) setCourses(normalizeCourseList(data));
      } catch (error) {
        if (!cancelled) setError(getErrorMessage(error, "Failed to load courses."));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void loadCourses();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, router, userId]);

  if (loading) return <p className="py-20 text-center">Loading...</p>;
  if (error) return <p className="py-20 text-center text-red-500">{error}</p>;

  return (
    <div className="container py-20">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Courses By User</h1>
          <p className="text-body-color dark:text-body-color-dark mt-1 text-sm">
            Showing courses for this user.
          </p>
        </div>

        <button
          onClick={() => router.push("/courses")}
          className="rounded-xl border border-stroke bg-white px-6 py-3 text-sm font-medium text-dark duration-300 hover:bg-gray-light dark:border-white/10 dark:bg-transparent dark:text-white dark:hover:bg-gray-dark"
        >
          Back
        </button>
      </div>

      {courses.length === 0 ? (
        <div className="rounded-xl border border-stroke bg-white p-8 text-center text-body-color dark:border-white/10 dark:bg-dark dark:text-body-color-dark">
          No courses found.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {courses.map((course, index) => (
            <SingleCourse
              key={String(course?.id ?? course?.courseId ?? course?.CourseId ?? index)}
              course={course}
              isAdmin={false}
              price={Number(course?.price ?? course?.Price ?? 0)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
