export type Enrollment = {
  enrollmentId: number;
  studentId: number;
  courseId: number;
  enrolledAt?: string;
};

export type CreateEnrollmentRequest = {
  studentId: number;
  courseId: number;
};
