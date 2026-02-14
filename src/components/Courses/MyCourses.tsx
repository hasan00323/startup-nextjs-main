"use client";

import { useEffect, useMemo, useState } from "react";
import SingleCourseSearchCard from "@/components/Courses/SingleCourseSearch";
import { apiFetch } from "@/lib/api";

const MyCoursesPage = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const token = useMemo(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
  }, []);

useEffect(() => {
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
    }
  )
    .then(async (res) => {
      if (!res.ok) {
        const t = await res.text().catch(() => "");
        throw new Error(t || `Failed (${res.status})`);
      }

      const data = await res.json();

      if (!Array.isArray(data)) {
        throw new Error("API did not return an array");
      }

      setCourses(data);
    })
    .catch((e) => setError(e?.message || "Failed to load"))
    .finally(() => setLoading(false));
}, [token]);

  if (loading) return <p className="text-center py-20">Loading...</p>;
  if (error) return <p className="text-center py-20 text-red-500">{error}</p>;

  return (
    <div className="container py-20">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">My Courses</h1>
        <p className="text-body-color dark:text-body-color-dark mt-1 text-sm">
          Courses linked to your account.
        </p>
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

export default MyCoursesPage;
