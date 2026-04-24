"use client";

import SingleCourse from "./SingleCourse";
import { useCourses } from "@/hooks/useCourses";

export { default as CreateCourseWizard } from "./Builder/CreateCourseWizard";
export { default as PickCourseToBuild } from "./Builder/PickCourseToBuild";
export { default as CourseBuilder } from "./Builder/CourseBuilder";

const CoursePage = () => {
  const { courses, loading, error } = useCourses();

  if (loading) return <div className="container py-20 text-center">Loading...</div>;
  if (error) return <div className="container py-20 text-center text-red-500">{error}</div>;

  return (
    <div className="container py-20 mt-5">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
        {courses.map((course, index) => {
          const id = course?.id ?? course?.courseId ?? course?.CourseId;
          const key = id != null ? `course-${id}` : `course-index-${index}`;
          const price = course?.price ?? course?.Price ?? 0;

          return (
            <div key={key} className="block transition-transform duration-300 hover:-translate-y-2">
              <SingleCourse course={course} isAdmin={false} price={price} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CoursePage;
