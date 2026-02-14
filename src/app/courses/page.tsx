"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SingleCourse from "@/components/Courses/SingleCourse";

export default function CoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch("https://localhost:7145/api/courses/GetAllCourses")
      .then(res => res.json())
      .then(data => setCourses(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="container py-20 text-center">Loading...</div>;
  }

  return (
    <div className="container py-20" style={{ marginTop: "60px" }}>
      <div className="mb-10 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Courses</h1>

        <button
          style={{ marginRight: "45px" }}
          onClick={() => router.push("/courses/create")}
          className="rounded bg-primary px-5 py-2 text-white hover:bg-primary/90"
        >
          + Add Course
        </button>

      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
        {courses.map((course, index) => {
          const id =
            course?.id ??
            course?.courseId ??
            course?.CourseId ??
            course?.courseID;

          const key = id != null ? `course-${id}` : `course-index-${index}`;

          return <SingleCourse key={key} course={course} />;
        })}
      </div>
    </div>
  );
}
