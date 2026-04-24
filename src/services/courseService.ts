import { buildApiUrl } from "@/lib/api";

const COURSE_CACHE_TTL_MS = 30 * 1000;

let coursesCache: { expiresAt: number; data: any[] } | null = null;
let coursesRequest: Promise<any[]> | null = null;

function normalizeCourseList(data: unknown) {
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object" && Array.isArray((data as { items?: unknown }).items)) {
    return (data as { items: unknown[] }).items;
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
