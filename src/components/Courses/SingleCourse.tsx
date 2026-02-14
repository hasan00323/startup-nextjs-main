import Image from "next/image";
import Link from "next/link";

const SingleCourse = ({ course }: { course: any }) => {
  const courseId = course.id ?? course.courseId ?? course.CourseId;
  const imageSrc = course.imageUrl || "/images/blog/blog-01.jpg";

  return (
    <div className="overflow-hidden rounded-md bg-white shadow-md dark:bg-dark">
      <Link href={courseId ? `/courses/details/${courseId}` : "/courses"}>
        <div className="relative h-48 w-full">
          <Image
            src={imageSrc}
            alt={course.title || "Course"}
            fill
            className="object-cover"
          />
        </div>
      </Link>

      <div className="p-5">
        <h3 className="mb-2 text-xl font-bold text-black dark:text-white">
          {course.title}
        </h3>

        <p className="mb-4 text-sm text-body-color dark:text-body-color-dark line-clamp-3">
          {course.description}
        </p>

        <Link
          href={courseId ? `/courses/details/${courseId}` : "/courses"}
          className="text-primary font-semibold"
        >
          View Details →
        </Link>
      </div>
    </div>
  );
};

export default SingleCourse;
