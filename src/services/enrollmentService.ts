import { apiFetch, parseApiError, requestJson, type RouterLike } from "@/lib/api";
import {
  mapEnrollments,
  normalizeEnrollmentList,
  type CreateEnrollmentPayload,
  type Enrollment,
  type EnrollmentResponse,
} from "@/models/enrollment";

const ENROLLMENT_ENDPOINTS = {
  all: "/enrollments/GetAllEnrollments",
  create: "/enrollments/CreateEnrollment",
  deleteById: "/enrollments/DeleteEnrollment",
  byStudent: (studentId: string) => `/enrollments/GetEnrollmentsByStudent/${studentId}`,
  myCourses: "/courses/MyCourses",
};

export async function getAllEnrollments(router?: RouterLike): Promise<Enrollment[]> {
  const data = await requestJson<unknown>(
    ENROLLMENT_ENDPOINTS.all,
    { method: "GET" },
    router
  );

  return mapEnrollments(data);
}

export async function getMyEnrollments(router?: RouterLike): Promise<Enrollment[]> {
  const res = await apiFetch(ENROLLMENT_ENDPOINTS.myCourses, { method: "GET" }, router);

  if (res.status === 404) return [];
  if (!res.ok) throw await parseApiError(res);

  const contentType = res.headers.get("content-type") ?? "";

  if (!contentType.includes("application/json")) {
    const text = await res.text().catch(() => "");
    const normalized = text.toLowerCase();

    if (
      normalized.includes("no enroll") ||
      normalized.includes("no courses") ||
      normalized.includes("not found")
    ) {
      return [];
    }

    throw new Error(text || "Unexpected response");
  }

  const data = await res.json().catch(() => []);
  return mapEnrollments(normalizeEnrollmentList(data));
}

export async function getStudentEnrollments(
  studentId: string,
  router?: RouterLike
): Promise<Enrollment[]> {
  const data = await requestJson<EnrollmentResponse[]>(
    ENROLLMENT_ENDPOINTS.byStudent(studentId),
    { method: "GET" },
    router
  );

  return mapEnrollments(data);
}

export async function createEnrollment(
  payload: CreateEnrollmentPayload,
  router?: RouterLike
) {
  const res = await apiFetch(
    ENROLLMENT_ENDPOINTS.create,
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
    router
  );

  if (!res.ok) throw await parseApiError(res);
  return res;
}

export async function deleteEnrollmentById(id: string, router?: RouterLike) {
  const res = await apiFetch(
    `${ENROLLMENT_ENDPOINTS.deleteById}?id=${encodeURIComponent(id)}`,
    { method: "DELETE" },
    router
  );

  if (!res.ok) throw await parseApiError(res);
  return res;
}

export async function deleteEnrollmentByStudentCourse(
  studentId: string,
  courseId: string | number,
  router?: RouterLike
) {
  const res = await apiFetch(
    `${ENROLLMENT_ENDPOINTS.deleteById}?studentId=${encodeURIComponent(
      studentId
    )}&courseId=${encodeURIComponent(String(courseId))}`,
    { method: "DELETE" },
    router
  );

  if (!res.ok) throw await parseApiError(res);
  return res;
}
