"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";
import SingleCourse from "@/components/Courses/SingleCourse";
import { useCourses } from "@/hooks/useCourses";

function normalizeText(value: unknown) {
  return String(value ?? "").trim().toLowerCase();
}

function getCourseSearchText(course: any) {
  const nestedModuleText = (course?.tracks ?? course?.Tracks ?? [])
    .flatMap((track: any) => [
      track?.title,
      track?.Title,
      ...(track?.modules ?? track?.Modules ?? []).flatMap((module: any) => [
        module?.title,
        module?.Title,
        module?.description,
        module?.Description,
      ]),
    ]);

  return [
    course?.title,
    course?.Title,
    course?.description,
    course?.Description,
    course?.category,
    course?.Category,
    course?.categoryName,
    course?.CategoryName,
    course?.instructorName,
    course?.InstructorName,
    ...nestedModuleText,
  ]
    .map(normalizeText)
    .filter(Boolean)
    .join(" ");
}

function matchesCourse(course: any, query: string) {
  const terms = normalizeText(query).split(/\s+/).filter(Boolean);
  if (terms.length === 0) return true;

  const haystack = getCourseSearchText(course);
  return terms.every((term) => haystack.includes(term));
}

export default function SearchCoursesPage() {
  const { courses, loading, error } = useCourses();
  const [query, setQuery] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const deferredQuery = useDeferredValue(query);

  useEffect(() => {
    const roleId = localStorage.getItem("roleId") || localStorage.getItem("RoleId");
    setIsAdmin(Number(roleId) === 1);
  }, []);

  const filteredCourses = useMemo(
    () => courses.filter((course) => matchesCourse(course, deferredQuery)),
    [courses, deferredQuery]
  );

  const hasQuery = query.trim().length > 0;

  return (
    <section className="relative z-10 min-h-[80vh] pt-32 pb-16 lg:pt-[150px]">
      <div className="container">
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-black dark:text-white">Search Courses</h1>
            <p className="text-body-color dark:text-body-color-dark mt-2 text-sm">
              Search locally by title, description, category, or instructor.
            </p>
          </div>

          <div className="w-full sm:max-w-md">
            <label htmlFor="course-search" className="sr-only">
              Search courses
            </label>
            <input
              id="course-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search React, design, .NET..."
              className="border-stroke text-body-color focus:border-primary dark:text-body-color-dark dark:shadow-two dark:focus:border-primary w-full rounded-xl border bg-white px-5 py-3 text-sm outline-none transition dark:border-white/10 dark:bg-white/5"
              autoComplete="off"
            />
          </div>
        </div>

        {loading && <div className="py-16 text-center">Loading courses...</div>}

        {error && !loading && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        {!loading && !error && filteredCourses.length === 0 && (
          <div className="rounded-xl border border-stroke bg-white p-10 text-center text-body-color dark:border-white/10 dark:bg-dark dark:text-body-color-dark">
            {hasQuery ? "No courses match your search." : "No courses found."}
          </div>
        )}

        {!loading && !error && filteredCourses.length > 0 && (
          <>
            <div className="mb-5 text-sm text-body-color dark:text-body-color-dark">
              Showing {filteredCourses.length} of {courses.length} courses
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
              {filteredCourses.map((course, index) => {
                const id = course?.id ?? course?.courseId ?? course?.CourseId;
                const price = course?.price ?? course?.Price ?? 0;

                return (
                  <SingleCourse
                    key={id != null ? `course-${id}` : `course-index-${index}`}
                    course={course}
                    isAdmin={isAdmin}
                    price={price}
                  />
                );
              })}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
