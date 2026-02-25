import Image from "next/image";
import Link from "next/link";

const SingleCourse = ({ course }: { course: any }) => {
  const courseId = course.id ?? course.courseId ?? course.CourseId;
  const imageSrc = course.imageUrl || "/images/blog/blog-01.jpg";

  return (
    <>
      <div className="overflow-hidden rounded-md bg-white shadow-md dark:bg-dark opacity-0 animate-[courseCardIn_.55s_ease-out_forwards] hover:-translate-y-1 hover:shadow-lg transition duration-300">
        <Link href={courseId ? `/courses/details/${courseId}` : "/courses"}>
          <div className="relative h-48 w-full overflow-hidden">
            <Image
              src={imageSrc}
              alt={course.title || "Course"}
              fill
              className="object-cover transition duration-500 ease-out hover:scale-[1.06]"
            />
          </div>
        </Link>

        <div className="p-5">
          <h3 className="mb-2 text-xl font-bold text-black dark:text-white opacity-0 animate-[textIn_.55s_ease-out_forwards] [animation-delay:80ms]">
            {course.title}
          </h3>

          <p className="mb-4 text-sm text-body-color dark:text-body-color-dark line-clamp-3 opacity-0 animate-[textIn_.55s_ease-out_forwards] [animation-delay:140ms]">
            {course.description}
          </p>

          <Link
            href={courseId ? `/courses/details/${courseId}` : "/courses"}
            className="text-primary font-semibold inline-flex items-center gap-2 opacity-0 animate-[textIn_.55s_ease-out_forwards] [animation-delay:200ms]"
          >
            <span className="transition duration-300 group-hover:translate-x-1">
              View Details →
            </span>
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes courseCardIn {
          0% { opacity: 0; transform: translateY(14px) scale(0.99); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes textIn {
          0% { opacity: 0; transform: translateY(8px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
};

export default SingleCourse;