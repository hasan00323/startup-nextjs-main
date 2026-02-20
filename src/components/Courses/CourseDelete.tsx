"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { apiFetch } from "@/lib/api";

const DeleteCourse = () => {
  const { id } = useParams();
  const router = useRouter();

  useEffect(() => {
  if (!id) return;

  const confirmed = confirm("Are you sure you want to delete this course?");
  if (!confirmed) {
    router.push("/courses");
    return;
  }

  let cancelled = false;

  const deleteCourse = async () => {
    try {
      const res = await apiFetch(
        `https://localhost:7145/api/courses/deleteCourse/${id}`,
        {
          method: "DELETE",
        },
        router
      );

      if (!res.ok) {
        const t = await res.text().catch(() => "");
        throw new Error(t || `Delete failed (${res.status})`);
      }

      if (!cancelled) {
        alert("Course deleted successfully");
        router.push("/courses");
      }
    } catch (e) {
      if (!cancelled) {
        alert("Failed to delete course");
        router.push("/courses");
      }
    }
  };

  deleteCourse();

  return () => {
    cancelled = true;
  };
}, [id, router]);

  return (
    <div className="container py-20 text-center">
      Deleting course...
    </div>
  );
};

export default DeleteCourse;
