export type EnrollmentResponse = {
  id?: string | number;
  Id?: string | number;
  enrollmentId?: string | number;
  EnrollmentId?: string | number;
  studentId?: string | number;
  StudentId?: string | number;
  studentName?: string;
  StudentName?: string;
  courseId?: string | number;
  CourseId?: string | number;
  courseTitle?: string;
  CourseTitle?: string;
  title?: string;
  Title?: string;
  categoryName?: string;
  CategoryName?: string;
  description?: string;
  Description?: string;
  course?: EnrollmentResponse;
  Course?: EnrollmentResponse;
  createdAt?: string;
  CreatedAt?: string;
};

export type Enrollment = {
  id: string;
  enrollmentId: string;
  studentId: string;
  studentName: string;
  courseId: string;
  courseTitle: string;
  categoryName: string;
  description: string;
  createdAt: string;
  course: EnrollmentResponse;
  raw: EnrollmentResponse;
};

export type CreateEnrollmentForm = {
  studentId: number | "";
  courseId: number | "";
  createdAt: string;
};

export type CreateEnrollmentPayload = {
  studentId: number;
  courseId: number;
  createdAt: string;
};

function toStringValue(value: unknown) {
  return value == null ? "" : String(value);
}

export function normalizeEnrollmentList(data: unknown): EnrollmentResponse[] {
  if (Array.isArray(data)) return data as EnrollmentResponse[];
  if (data && typeof data === "object" && Array.isArray((data as { items?: unknown }).items)) {
    return (data as { items: EnrollmentResponse[] }).items;
  }
  return [];
}

export function mapEnrollment(data: EnrollmentResponse): Enrollment {
  const course = data.course ?? data.Course ?? data;
  const enrollmentId = data.enrollmentId ?? data.EnrollmentId ?? data.id ?? data.Id ?? "";
  const courseId =
    course.courseId ??
    course.CourseId ??
    data.courseId ??
    data.CourseId ??
    course.id ??
    course.Id ??
    "";

  return {
    id: toStringValue(data.id ?? data.Id ?? enrollmentId),
    enrollmentId: toStringValue(enrollmentId),
    studentId: toStringValue(data.studentId ?? data.StudentId),
    studentName: toStringValue(data.studentName ?? data.StudentName),
    courseId: toStringValue(courseId),
    courseTitle: toStringValue(
      course.courseTitle ?? course.CourseTitle ?? course.title ?? course.Title
    ),
    categoryName: toStringValue(course.categoryName ?? course.CategoryName),
    description: toStringValue(course.description ?? course.Description),
    createdAt: toStringValue(data.createdAt ?? data.CreatedAt),
    course,
    raw: data,
  };
}

export function mapEnrollments(data: unknown): Enrollment[] {
  return normalizeEnrollmentList(data).map(mapEnrollment);
}
