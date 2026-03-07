"use client";

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

  // وظيفة لحفظ البيانات مؤقتاً قبل الانتقال لصفحة الحذف
  const handlePrepareDelete = () => {
    const meta = { studentName, courseTitle };
    localStorage.setItem("deleteEnrollmentMeta", JSON.stringify(meta));
  };

  return (
    <div
      className="
        group relative overflow-hidden
        rounded-[2rem] border border-black/5
        bg-white/70 p-1 shadow-sm
        backdrop-blur-xl transition-all duration-300
        hover:-translate-y-1 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5
        dark:border-white/10 dark:bg-white/5 dark:hover:border-primary/30
      "
    >
      <div className="p-6 sm:p-8">
        {/* Header Section */}
        <div className="mb-6 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="mb-2 flex items-center gap-2 text-primary">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">Course</span>
            </div>
            <h3 className="truncate text-xl font-black text-black dark:text-white">
              {courseTitle ?? "Untitled Course"}
            </h3>
          </div>

          <span
            className="
              inline-flex shrink-0 items-center gap-1.5
              rounded-full bg-primary/10 px-3 py-1
              text-[11px] font-bold text-primary
              dark:bg-primary/20
            "
          >
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
            Active
          </span>
        </div>

        {/* Info Grid */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 dark:bg-white/5">
              <svg width="20" height="20" className="text-black/60 dark:text-white/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase text-black/40 dark:text-white/40">Student</p>
              <p className="truncate text-sm font-bold text-black dark:text-white">
                {studentName ?? "Unknown Student"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 dark:bg-white/5">
              <svg width="18" height="18" className="text-black/60 dark:text-white/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="9" y1="21" x2="9" y2="9" />
              </svg>
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase text-black/40 dark:text-white/40">Course ID</p>
              <p className="truncate text-sm font-mono font-bold text-primary">
                #{courseId ?? "000"}
              </p>
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="mt-8 flex items-center justify-between border-t border-black/5 pt-5 dark:border-white/5">
          <Link
            href={studentId ? `/enrollments/student/${studentId}` : "/enrollments"}
            className="
              group/link flex items-center gap-2
              text-xs font-bold uppercase tracking-wider text-black/60
              transition-colors hover:text-primary
              dark:text-white/60 dark:hover:text-primary
            "
          >
            View Profile
            <svg 
              className="transition-transform duration-300 group-hover/link:translate-x-1" 
              width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"
            >
              <path d="M5 12h14m-7-7 7 7-7 7"/>
            </svg>
          </Link>

          {enrollmentId && (
            <Link
              href={`/enrollments/delete/${enrollmentId}`}
              onClick={handlePrepareDelete}
              className="
                flex h-9 w-9 items-center justify-center
                rounded-xl bg-red-50 text-red-600
                transition-all duration-300 hover:bg-red-600 hover:text-white
                dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-600 dark:hover:text-white
              "
              title="Delete Enrollment"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
              </svg>
            </Link>
          )}
        </div>
      </div>

      {/* Decorative Bottom Line */}
      <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-primary to-blue-400 transition-all duration-500 group-hover:w-full" />
    </div>
  );
};

export default SingleEnrollment;