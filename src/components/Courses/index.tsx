"use client";

import { useEffect, useState } from "react";
import SingleCourse from "../../components/Courses/SingleCourse";
import { apiFetch } from "@/lib/api";

export default function CoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
  setLoading(true);
  setError(null);

  apiFetch(
    "https://localhost:7145/api/courses/GetAllCourses",
    {
      method: "GET",
    }
  )
    .then(async (res) => {
      if (!res.ok) {
        throw new Error(`Failed (${res.status})`);
      }

      const data = await res.json();

      if (!Array.isArray(data)) {
        console.log("GetAllCourses returned:", data);
        throw new Error("API did not return an array");
      }

      setCourses(data);
    })
    .catch((e) => setError(e?.message || "Failed to load courses"))
    .finally(() => setLoading(false));
}, []);


  if (loading) return <p className="text-center py-20">Loading...</p>;
  if (error) return <p className="text-center py-20 text-red-500">{error}</p>;

  return (
    <div className="container py-20">
      <h1 className="mb-8 text-3xl font-bold">Courses</h1>

    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
  {courses.map((course: any, index: number) => {
    const key = String(
      course?.id ??
      course?.Id ??
      course?.courseId ??
      course?.CourseId ??
      `${course?.title ?? "course"}-${index}`
    );

    return <SingleCourse key={key} course={course} />;
  })}
</div>

    </div>
  );
}
