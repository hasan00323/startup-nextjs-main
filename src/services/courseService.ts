import { apiFetch, buildApiUrl, parseApiError, requestJson, type RouterLike } from "@/lib/api";
import type { CourseListItem, CourseStructureDto } from "@/components/Courses/types";

const COURSE_CACHE_TTL_MS = 30 * 1000;

let coursesCache: { expiresAt: number; data: CourseListItem[] } | null = null;
let coursesRequest: Promise<CourseListItem[]> | null = null;

type CourseApiResponse = {
  title?: string;
  Title?: string;
  description?: string;
  Description?: string;
  price?: string | number;
  Price?: string | number;
  startDate?: string;
  StartDate?: string;
  endDate?: string;
  EndDate?: string;
  categoryId?: string | number;
  CategoryId?: string | number;
};

function normalizeCourseList(data: unknown) {
  if (Array.isArray(data)) return data as CourseListItem[];
  if (data && typeof data === "object" && Array.isArray((data as { items?: unknown }).items)) {
    return (data as { items: CourseListItem[] }).items;
  }
  return [];
}

export async function getAllCourses({ force = false }: { force?: boolean } = {}) {
  const now = Date.now();

  if (!force && coursesCache && coursesCache.expiresAt > now) {
    return coursesCache.data;
  }

  if (!force && coursesRequest) {
    return coursesRequest;
  }

  coursesRequest = fetch(buildApiUrl("/courses/GetAllCourses"))
    .then((res) => {
      if (!res.ok) throw new Error(`Failed to load courses (${res.status})`);
      return res.json();
    })
    .then((data) => {
      const courses = normalizeCourseList(data);
      coursesCache = {
        data: courses,
        expiresAt: Date.now() + COURSE_CACHE_TTL_MS,
      };
      return courses;
    })
    .finally(() => {
      coursesRequest = null;
    });

  return coursesRequest;
}

export type CourseForm = {
  title: string;
  description: string;
  price: string;
  startDate: string;
  endDate: string;
  categoryId: string;
};

export type CreateCourseForm = {
  title: string;
  description: string;
  price: number;
  startDate: string;
  endDate: string;
  categoryId: number;
};

export const COURSE_CATEGORIES = [
  { id: 1, name: "IT" },
  { id: 2, name: "HR" },
  { id: 3, name: "Sales" },
  { id: 4, name: "Marketing" },
] as const;

export function isoLocalNow() {
  return new Date().toISOString().slice(0, 16);
}

export function toDatetimeLocal(iso?: string) {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (value: number) => String(value).padStart(2, "0");

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
    date.getHours()
  )}:${pad(date.getMinutes())}`;
}

export function toIsoDateTime(value: string) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
}

export function validateCourseDates(startDate: string, endDate: string) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    throw new Error("Please select valid start/end dates.");
  }

  if (end <= start) {
    throw new Error("End date must be after start date.");
  }

  return { start, end };
}

export async function getCourse(id: string, router?: RouterLike): Promise<CourseForm> {
  const course = await requestJson<CourseApiResponse>(`/courses/GetCourse/${id}`, { method: "GET" }, router);
  const categoryId = String(course?.categoryId ?? course?.CategoryId ?? "0");
  const isValidCategory = COURSE_CATEGORIES.some((category) => String(category.id) === categoryId);

  return {
    title: course?.title ?? course?.Title ?? "",
    description: course?.description ?? course?.Description ?? "",
    price: String(course?.price ?? course?.Price ?? "0"),
    startDate: toDatetimeLocal(course?.startDate ?? course?.StartDate),
    endDate: toDatetimeLocal(course?.endDate ?? course?.EndDate),
    categoryId: isValidCategory ? categoryId : "0",
  };
}

export async function createCourse(form: CreateCourseForm, router?: RouterLike) {
  const { start, end } = validateCourseDates(form.startDate, form.endDate);
  const res = await apiFetch(
    "/courses/CreateCourse",
    {
      method: "POST",
      body: JSON.stringify({
        title: form.title,
        description: form.description,
        price: form.price,
        startDate: start.toISOString(),
        endDate: end.toISOString(),
        categoryId: form.categoryId,
      }),
    },
    router
  );

  if (!res.ok) throw await parseApiError(res);
  coursesCache = null;
  return res;
}

export async function updateCourse(id: string, form: CourseForm, router?: RouterLike) {
  const categoryId = parseInt(form.categoryId, 10);

  if (!categoryId || categoryId <= 0) {
    throw new Error("Please select a category.");
  }

  const { start, end } = validateCourseDates(form.startDate, form.endDate);
  const res = await apiFetch(
    `/courses/updateCourse/${id}`,
    {
      method: "PUT",
      body: JSON.stringify({
        Title: form.title,
        Description: form.description,
        Price: Number(form.price) || 0,
        StartDate: start.toISOString(),
        EndDate: end.toISOString(),
        CategoryId: categoryId,
      }),
    },
    router
  );

  if (!res.ok) throw await parseApiError(res);
  coursesCache = null;
  return res;
}

export async function deleteCourse(id: string, router?: RouterLike) {
  const res = await apiFetch(`/courses/deleteCourse/${id}`, { method: "DELETE" }, router);
  if (!res.ok) throw await parseApiError(res);
  coursesCache = null;
  return res;
}

export async function getCourseStructure(courseId: number, router?: RouterLike) {
  return requestJson<CourseStructureDto>(
    `/courses/GetCourseStructure/${courseId}`,
    { method: "GET" },
    router
  );
}
