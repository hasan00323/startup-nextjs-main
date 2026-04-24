"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDeleteCourse } from "@/hooks/useCourses";

const DeleteCourse = () => {
  const { id } = useParams();
  const router = useRouter();
  const { remove } = useDeleteCourse(String(id ?? ""));

  useEffect(() => {
  if (!id) return;

  const confirmed = confirm("Are you sure you want to delete this course?");
  if (!confirmed) {
    router.push("/courses");
    return;
  }

  let cancelled = false;

  const runDelete = async () => {
    const deleted = await remove();

    if (!cancelled) {
      alert(deleted ? "Course deleted successfully" : "Failed to delete course");
      router.push("/courses");
    }
  };

  void runDelete();

  return () => {
    cancelled = true;
  };
}, [id, remove, router]);

  return (
    <div className="container py-20 text-center">
      Deleting course...
    </div>
  );
};

export default DeleteCourse;
