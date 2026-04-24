import { apiFetch, parseApiError, requestJson, type RouterLike } from "@/lib/api";
import {
  mapStudentProfile,
  type StudentProfile,
  type StudentProfileForm,
  type StudentProfileResponse,
} from "@/models/student";

const STUDENT_ENDPOINTS = {
  profile: "/Users/GetStudentProfile",
  updateProfile: "/Users/UpdateStudentProfile",
  all: "/Users/GetAllStudents",
};

export async function getStudentProfile(router?: RouterLike): Promise<StudentProfile | null> {
  const data = await requestJson<StudentProfileResponse>(
    STUDENT_ENDPOINTS.profile,
    { method: "GET" },
    router
  );

  return mapStudentProfile(data);
}

export async function updateStudentProfile(
  form: StudentProfileForm,
  email: string,
  router?: RouterLike
) {
  const body = JSON.stringify({ ...form, email });
  const init: RequestInit = {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body,
  };

  const res = await fetchWithFallback(STUDENT_ENDPOINTS.updateProfile, init, router);
  return res;
}

async function fetchWithFallback(path: string, init: RequestInit, router?: RouterLike) {
  let res = await apiFetch(path, init, router);

  if (res.status === 405 && init.method === "PUT") {
    res = await apiFetch(path, { ...init, method: "POST" }, router);
  }

  if (!res.ok) throw await parseApiError(res);
  return res;
}
