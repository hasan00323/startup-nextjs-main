import Link from "next/link";

const SingleEnrollment = ({ enrollment }: { enrollment: any }) => {
  const enrollmentId =
    enrollment?.enrollmentId ??
    enrollment?.EnrollmentId ??
    enrollment?.id ??
    enrollment?.Id;

  const studentId = enrollment?.studentId ?? enrollment?.StudentId;
  const studentName = enrollment?.studentName ?? enrollment?.StudentName;

  const courseId = enrollment?.courseId ?? enrollment?.CourseId;
  const courseTitle = enrollment?.courseTitle ?? enrollment?.CourseTitle;

  return (
    <div
      className="
        group
        overflow-hidden
        rounded-3xl
        border border-white/15
        bg-white/10
        shadow-two
        backdrop-blur-xl
        transition duration-300
        hover:bg-white/15
        hover:border-white/25
        dark:border-white/10
        dark:bg-white/5
        dark:hover:bg-white/10
      "
    >
      <Link
        href={studentId ? `/enrollments/student/${studentId}` : "/enrollments"}
        className="block"
      >
        <div className="p-6 sm:p-7">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h3 className="truncate text-lg font-extrabold text-black dark:text-white">
                {courseTitle ?? "Enrollment"}
              </h3>
              <p className="mt-1 text-sm text-body-color dark:text-body-color-dark">
                This student is enrolled in this course.
              </p>
            </div>

            <span
              className="
                inline-flex shrink-0 items-center gap-2
                rounded-full
                border border-white/15
                bg-white/10
                px-3 py-1.5
                text-xs font-semibold
                text-black/80
                backdrop-blur-lg
                dark:border-white/10
                dark:bg-white/5
                dark:text-white/80
              "
            >
              <span className="h-2 w-2 rounded-full bg-primary" />
              Enrollment
            </span>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-body-color dark:text-body-color-dark">
              Student:{" "}
              <span className="font-semibold text-black dark:text-white">
                {studentName ?? "—"}
              </span>
            </p>

            <p className="text-sm text-body-color dark:text-body-color-dark">
              Course ID:{" "}
              <span className="font-semibold text-black dark:text-white">
                {courseId ?? "—"}
              </span>
            </p>
          </div>

          <div className="mt-6 flex items-center justify-between gap-3">
            <span
              className="
                inline-flex items-center gap-2
                text-sm font-semibold
                text-primary
                transition duration-300
                group-hover:translate-x-0.5
              "
            >
              View Student Enrollments
              <span className="opacity-70">→</span>
            </span>

            {enrollmentId && (
              <Link
                href={`/enrollments/delete/${enrollmentId}`}
                onClick={(e) => e.stopPropagation()}
                className="
                  inline-flex items-center justify-center
                  rounded-2xl
                  bg-red-600
                  px-4 py-2
                  text-xs font-semibold text-white
                  shadow-sm
                  transition duration-300
                  hover:bg-red-700
                  active:scale-[0.99]
                "
              >
                Delete
              </Link>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default SingleEnrollment;
