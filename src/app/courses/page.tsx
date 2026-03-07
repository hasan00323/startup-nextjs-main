"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SingleCourse from "@/components/Courses/SingleCourse";

export default function CoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const roleId = localStorage.getItem("roleId") || localStorage.getItem("RoleId");
    setIsAdmin(Number(roleId) === 1);
  }, []);

  useEffect(() => {
    fetch("https://localhost:7145/api/courses/GetAllCourses")
      .then((res) => res.json())
      .then((data) => setCourses(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="container py-20 text-center">Loading...</div>;

  return (
    <div className="container py-20" style={{ marginTop: "20px" }}>
      <div className="mb-10 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Courses</h1>

        {isAdmin && (
          <button
            style={{ marginRight: "45px",borderRadius:"14px",backgroundColor:"#0070f3",color:"white",padding:"10px 20px",fontSize:"16px",cursor:"pointer" }}
            onClick={() => router.push("/admin/courses/builder")}
            className="rounded bg-primary px-5 py-2 text-white hover:bg-primary/90"
          >
            + Add Course
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
        {courses.map((course, index) => {
          const id = course?.id ?? course?.courseId ?? course?.CourseId;
          const key = id != null ? `course-${id}` : `course-index-${index}`;
          return <SingleCourse key={key} course={course} isAdmin={isAdmin} />;
        })}
      </div>
    </div>
  );
}