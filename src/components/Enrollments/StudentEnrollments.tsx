"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

const StudentEnrollmentsPage = () => {
  const params = useParams();
  const studentId = params?.studentId as string;

  const router = useRouter();

  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [deletingKey, setDeletingKey] = useState<string | null>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selected, setSelected] = useState<{
    key: string;
    courseId: number;
    courseTitle: string;
  } | null>(null);

  const token = useMemo(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
  }, []);

 const load = async () => {
  if (!studentId) return;

  if (!token) {
    router.push("/signin");
    return;
  }

  setLoading(true);
  setError(null);

  try {
    const res = await apiFetch(
      `https://localhost:7145/api/enrollments/GetEnrollmentsByStudent/${studentId}`,
      {
        method: "GET",
      },
      router
    );

    if (!res.ok) {
      const t = await res.text().catch(() => "");
      throw new Error(t || `Failed (${res.status})`);
    }

    const data = await res.json();

    if (!Array.isArray(data)) {
      console.log("GetEnrollmentsByStudent returned:", data);
      throw new Error("API did not return an array");
    }

    setEnrollments(data);
  } catch (e: any) {
    setError(e?.message || "Something went wrong");
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    load();
  }, [studentId, token]);

  const studentName =
    enrollments?.[0]?.studentName ?? enrollments?.[0]?.StudentName ?? "Student";

  const items = enrollments
    .map((e: any, index: number) => ({
      key: `${studentId}-${e?.courseId ?? e?.CourseId ?? index}`,
      courseTitle: e?.courseTitle ?? e?.CourseTitle ?? "—",
      courseId: e?.courseId ?? e?.CourseId ?? null,
      raw: e,
    }))
    .filter((x: any) => Boolean(x.courseId));

  const openDelete = (item: any) => {
    setSelected({
      key: item.key,
      courseId: Number(item.courseId),
      courseTitle: String(item.courseTitle || "this course"),
    });
    setConfirmOpen(true);
  };

  const closeDelete = () => {
    setConfirmOpen(false);
    setSelected(null);
  };

  const confirmDelete = async () => {
    if (!token) {
      router.push("/signin");
      return;
    }
    if (!selected) return;

    setDeletingKey(selected.key);

    try {
      const url = `https://localhost:7145/api/enrollments/DeleteEnrollment?studentId=${studentId}&courseId=${selected.courseId}`;

      const res = await fetch(url, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const t = await res.text().catch(() => "");
        throw new Error(t || `Failed to delete (${res.status})`);
      }

      closeDelete();
      await load();
    } catch (e: any) {
      setError(e?.message || "Failed to delete enrollment");
      closeDelete();
    } finally {
      setDeletingKey(null);
    }
  };

  if (loading)
    return (
      <div className="container py-24 text-center">
        <div className="mx-auto w-full max-w-[520px] rounded-3xl border border-white/15 bg-white/10 p-8 shadow-two backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
          <p className="text-base font-semibold text-black dark:text-white">
            Loading...
          </p>
          <p className="mt-2 text-sm text-body-color dark:text-body-color-dark">
            Fetching student enrollments
          </p>
        </div>
      </div>
    );

  return (
    <section className="relative z-10 overflow-hidden pt-28 pb-20" style={{marginBottom:"100px"}}>
      <div className="container">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-black dark:text-white">
              {studentName}
            </h1>
            <p className="mt-1 text-sm text-body-color dark:text-body-color-dark">
              Enrolled Courses
            </p>

            {error && (
              <div className="mt-4 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-500">
                {error}
              </div>
            )}
          </div>

          <button
            onClick={() => router.push("/enrollments")}
            className="
              w-full sm:w-auto
              rounded-2xl
              border border-white/20
              bg-white/10
              px-6 py-3
              text-sm font-semibold
              text-black
              shadow-sm
              backdrop-blur-lg
              transition
              hover:bg-white/20
              dark:border-white/10
              dark:bg-white/5
              dark:text-white
              dark:hover:bg-white/10
            "
          >
            Back
          </button>
        </div>

        {items.length === 0 ? (
          <div className="mx-auto w-full max-w-[720px] rounded-3xl border border-white/15 bg-white/10 p-10 text-center shadow-two backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
            <h3 className="text-lg font-bold text-black dark:text-white">
              No enrollments found
            </h3>
            <p className="mt-2 text-sm text-body-color dark:text-body-color-dark">
              This student doesn’t have any enrolled courses yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {items.map((item: any) => {
              const isDeleting = deletingKey === item.key;

              return (
                <div
                  key={item.key}
                  className="
                    rounded-3xl
                    border border-white/15
                    bg-white/10
                    p-6
                    shadow-two
                    backdrop-blur-xl
                    transition
                    hover:bg-white/15
                    dark:border-white/10
                    dark:bg-white/5
                    dark:hover:bg-white/10
                  "
                >
                  <h3 className="text-lg font-extrabold text-black dark:text-white">
                    {item.courseTitle}
                  </h3>

                  <p className="mt-2 text-sm text-body-color dark:text-body-color-dark">
                    This student is enrolled in this course.
                  </p>

                  <div className="mt-5 flex items-center justify-end">
                    <button
                      type="button"
                      onClick={() => openDelete(item)}
                      disabled={isDeleting}
                      className="
                        rounded-2xl
                        bg-red-600
                        px-5 py-2.5
                        text-sm font-semibold
                        text-white
                        shadow-sm
                        transition
                        hover:bg-red-700
                        disabled:opacity-60
                      "
                    >
                      {isDeleting ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {confirmOpen && selected && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={closeDelete}
          />
          <div
            className="
              relative z-10
              w-full max-w-[440px]
              rounded-3xl
              border border-white/15
              bg-white/10
              p-8
              shadow-two
              backdrop-blur-xl
              dark:border-white/10
              dark:bg-white/5
            "
          >
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-red-500/15">
              <svg
                className="h-7 w-7 text-red-500"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 7L5 7M10 11v6M14 11v6M6 7l1 14h10l1-14"
                />
              </svg>
            </div>

            <h2 className="text-center text-2xl font-extrabold text-black dark:text-white">
              Delete Enrollment?
            </h2>

            <p className="mt-2 text-center text-sm text-body-color dark:text-body-color-dark">
              Remove <span className="font-semibold">{studentName}</span> from{" "}
              <span className="font-semibold">“{selected.courseTitle}”</span>.
              This action cannot be undone.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={closeDelete}
                className="
                  w-full
                  rounded-2xl
                  border border-white/20
                  bg-white/10
                  px-6 py-3
                  text-sm font-semibold
                  text-black
                  backdrop-blur-lg
                  transition
                  hover:bg-white/20
                  dark:border-white/10
                  dark:bg-white/5
                  dark:text-white
                "
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                className="
                  w-full
                  rounded-2xl
                  bg-red-600
                  px-6 py-3
                  text-sm font-semibold text-white
                  transition
                  hover:bg-red-700
                "
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default StudentEnrollmentsPage;
