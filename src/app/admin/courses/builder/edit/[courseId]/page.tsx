"use client";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

const CourseBuilderEditor = dynamic(
  () => import("@/components/Courses/Builder/CourseBuilderEditor"),
  { ssr: false }
);

export default function Page() {
  const params = useParams<{ courseId: string }>();

  const raw = params?.courseId;
  const courseId = raw ? Number(raw) : NaN;

  if (!raw || Number.isNaN(courseId) || courseId <= 0) {
    return (
      <div className="container py-20">
        <div className="rounded-lg border border-white/10 bg-white/5 p-6 text-white">
          Invalid course id.
        </div>
      </div>
    );
  }

  return <CourseBuilderEditor courseId={courseId} />;
}