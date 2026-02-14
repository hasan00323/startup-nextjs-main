"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import SingleCourseSearchCard from "@/components/Courses/SingleCourseSearch";
import { apiFetch } from "@/lib/api";

const CoursesByUserPage = () => {
  const params = useParams();
  const userId = params?.userId as string;

  const router = useRouter();

  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const token = useMemo(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
  }, []);

 useEffect(() => {
  if (!userId) return;

  if (!token) {
    router.push("/signin");
    return;
  }

  let cancelled = false;

  const loadCourses = async () => {
    try {
      setLoading(true);
      setError(null);

      const url = `https://localhost:7145/api/courses/GetCourseByUser?userId=${userId}`;

      const res = await apiFetch(
        url,
        { method: "GET" },
        router
      );

      if (!res.ok) {
        const t = await res.text().catch(() => "");
        throw new Error(t || `Failed (${res.status})`);
      }

      const data = await res.json();
      const arr = Array.isArray(data) ? data : data?.items ?? [];
      if (!Array.isArray(arr)) {
        throw new Error("API did not return an array");
      }

      if (!cancelled) setCourses(arr);
    } catch (e: any) {
      if (!cancelled) setError(e?.message || "Failed to load");
    } finally {
      if (!cancelled) setLoading(false);
    }
  };

  loadCourses();

  return () => {
    cancelled = true;
  };
}, [userId, token, router]);

  if (loading) return <p className="text-center py-20">Loading...</p>;
  if (error) return <p className="text-center py-20 text-red-500">{error}</p>;

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
          className="border-stroke text-dark hover:bg-gray-light dark:text-white dark:hover:bg-gray-dark rounded-xs border bg-white px-6 py-3 text-sm font-medium duration-300 dark:border-white/10 dark:bg-transparent"
        >
          Back
        </button>
      </div>

      {courses.length === 0 ? (
        <div className="rounded-xs border border-stroke bg-white p-8 text-center text-body-color dark:border-white/10 dark:bg-dark dark:text-body-color-dark">
          No courses found.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {courses.map((course: any, index: number) => (
            <SingleCourseSearchCard
              key={String(course?.id ?? course?.courseId ?? index)}
              course={course}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CoursesByUserPage;
