"use client";

import Image from "next/image";
import Link from "next/link";

const SingleCourse = ({ course, isAdmin }: { course: any; isAdmin: boolean }) => {
  // استخدام Optional Chaining لحماية الكود من أي خطأ إذا كانت البيانات ناقصة
  const courseId = course?.id ?? course?.courseId ?? course?.CourseId;
  const imageSrc = course?.imageUrl || "/images/blog/blog-01.jpg";

  const detailsHref = courseId ? `/courses/details/${courseId}` : "/courses";
  const editHref = courseId ? `/admin/courses/builder/edit/${courseId}` : "/admin/courses/builder/edit";

  return (
    <>
      <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl dark:border-white/10 dark:bg-[#0B1220]/60 dark:backdrop-blur-xl opacity-0 animate-[courseCardIn_.55s_ease-out_forwards]">
        
        {/* ================= IMAGE SECTION ================= */}
        <Link href={isAdmin ? editHref : detailsHref} className="relative block h-52 w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
          <Image
            src={imageSrc}
            alt={course?.title || "Course Image"}
            fill
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
          {/* تأثير ظلال متدرجة يظهر عند تمرير الماوس */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </Link>

        {/* ================= CONTENT SECTION ================= */}
        <div className="flex flex-1 flex-col p-6">
          
          {/* Badge */}
          <div className="mb-3 flex items-center opacity-0 animate-[textIn_.55s_ease-out_forwards] [animation-delay:40ms]">
            <span className="inline-flex items-center rounded-full border border-blue-500/20 bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
              {isAdmin ? "Admin View" : "Course"}
            </span>
          </div>

          {/* Title */}
          <h3 className="mb-3 text-xl font-bold text-gray-900 transition-colors duration-200 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400 opacity-0 animate-[textIn_.55s_ease-out_forwards] [animation-delay:80ms]">
            <Link href={isAdmin ? editHref : detailsHref} className="line-clamp-2">
              {course?.title || "Untitled Course"}
            </Link>
          </h3>

          {/* Description (flex-1 pushes the button to the bottom) */}
          <p className="mb-6 flex-1 text-sm leading-relaxed text-gray-600 line-clamp-3 dark:text-gray-400 opacity-0 animate-[textIn_.55s_ease-out_forwards] [animation-delay:140ms]">
            {course?.description || "No description available for this course. Start exploring to learn more."}
          </p>

          {/* ================= ACTION BUTTON ================= */}
          <div className="mt-auto border-t border-gray-100 pt-5 dark:border-white/10 opacity-0 animate-[textIn_.55s_ease-out_forwards] [animation-delay:200ms]">
            <Link
              href={isAdmin ? editHref : detailsHref}
              // استخدمنا group/btn هنا للتحكم بحركة السهم بالداخل فقط
              className="group/btn inline-flex items-center gap-2 text-sm font-semibold text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              {isAdmin ? "Edit this course" : "View details"}
              
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                className="transition-transform duration-300 group-hover/btn:translate-x-1"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
          
        </div>
      </div>

      <style jsx>{`
        @keyframes courseCardIn {
          0% { opacity: 0; transform: translateY(20px) scale(0.98); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes textIn {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
};

export default SingleCourse;