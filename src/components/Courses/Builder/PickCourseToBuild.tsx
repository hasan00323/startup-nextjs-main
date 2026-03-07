"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import GlassCard from "./shared/GlassCard";
import MiniButton from "./shared/MiniButton";
import { apiFetch } from "@/lib/api";
import type { CourseListItem } from "./../types";

export default function PickCourseToBuild() {
  const router = useRouter();
  const token = useMemo(() => (typeof window === "undefined" ? null : localStorage.getItem("token")), []);

  const [courses, setCourses] = useState<CourseListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await apiFetch(
        "https://localhost:7145/api/courses/GetAllCourses",
        { method: "GET" },
        router
      );
      const data: CourseListItem[] = res.ok ? await res.json() : [];
      setCourses(Array.isArray(data) ? data : []);
    } catch (e: any) {
      setError(e?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      router.push("/signin");
      return;
    }
    load();
  }, []);

  const filtered = courses.filter((c) =>
    c.title?.toLowerCase().includes(q.trim().toLowerCase())
  );

  return (
    <section className="relative z-10 overflow-hidden pt-28 pb-16 md:pt-36 lg:pt-[170px] lg:pb-24">
      <div className="container">
        <div className="-mx-4 flex flex-wrap justify-center">
          <div className="w-full px-4">
            <div style={{ marginTop: "-40px" }} className="mx-auto w-full max-w-[920px]">
              <GlassCard title="Pick a Course to Build" subtitle="Select the course you want to build tracks/modules for.">
                {error && (
                  <div className="mb-5 rounded-2xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-300">
                    {error}
                  </div>
                )}

                <div className="mb-5 flex flex-col gap-3 sm:flex-row">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
                      <input
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        placeholder="Search by title..."
                        className="w-full bg-transparent text-sm text-black outline-none placeholder:text-black/50 dark:text-white dark:placeholder:text-white/40"
                      />
                    </div>
                  </div>
                  <div className="w-full sm:w-[200px]">
                    <MiniButton variant="ghost" onClick={load} disabled={loading}>
                      Refresh
                    </MiniButton>
                  </div>
                </div>

                {loading ? (
                  <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-6 text-center text-sm text-body-color backdrop-blur-xl dark:border-white/10 dark:bg-white/5 dark:text-body-color-dark">
                    Loading courses...
                  </div>
                ) : filtered.length === 0 ? (
                  <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-6 text-center text-sm text-body-color backdrop-blur-xl dark:border-white/10 dark:bg-white/5 dark:text-body-color-dark">
                    No courses found.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {filtered.map((c) => (
                      <div
                        key={c.courseId}
                        className="rounded-3xl border border-white/15 bg-white/10 p-5 shadow-2xl backdrop-blur-2xl ring-1 ring-white/10 transition hover:bg-white/15 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h3 className="truncate text-lg font-bold text-black dark:text-white">
                              {c.title}
                            </h3>
                            {c.categoryName && (
                              <p className="mt-1 text-xs text-body-color dark:text-body-color-dark">
                                Category: {c.categoryName}
                              </p>
                            )}
                          </div>
                          <div className="shrink-0 rounded-2xl border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-black backdrop-blur-xl dark:border-white/10 dark:bg-white/5 dark:text-white">
                            ID: {c.courseId}
                          </div>
                        </div>

                        {c.description && (
                          <p className="mt-3 line-clamp-3 text-sm text-body-color dark:text-body-color-dark">
                            {c.description}
                          </p>
                        )}

                        <div className="mt-4">
                          <MiniButton onClick={() => router.push(`/admin/courses/builder/${c.courseId}`)}>
                            Build This Course
                          </MiniButton>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </GlassCard>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}