"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import GlassCard from "./shared/GlassCard";
import MiniButton from "./shared/MiniButton";
import Field from "./shared/Field";
import { apiFetch } from "@/lib/api";
import type { CourseStructureDto, Selection } from "./../types";
import TracksPanel from "./panels/TracksPanel";
import ModulesPanel from "./panels/ModulesPanel";
import SectionsPanel from "./panels/SectionsPanel";
import QuizzesPanel from "./panels/QuizzesPanel";
import QuestionsPanel from "./panels/QuestionsPanel";

export default function CourseBuilder() {
  const router = useRouter();
  const params = useParams<{ courseId: string }>();
  const courseId = Number(params?.courseId);

  const token = useMemo(() => (typeof window === "undefined" ? null : localStorage.getItem("token")), []);

  const [structure, setStructure] = useState<CourseStructureDto | null>(null);
  const [selection, setSelection] = useState<Selection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStructure = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await apiFetch(
        `https://localhost:7145/api/courses/GetCourseStructure/${courseId}`,
        { method: "GET" },
        router
      );
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(txt || `Request failed (${res.status})`);
      }
      const data: CourseStructureDto = await res.json();
      setStructure(data);
      if (!selection) setSelection({ kind: "course", courseId: data.courseId });
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
    if (!courseId || Number.isNaN(courseId)) return;
    fetchStructure();
  }, [courseId]);

  const selectedTitle = (() => {
    if (!structure || !selection) return "";
    if (selection.kind === "course") return structure.title;

    const track = structure.tracks.find((t) => t.courseTrackId === (selection as any).courseTrackId);
    if (!track) return "";
    if (selection.kind === "track") return track.title;

    const module = track.modules.find((m) => m.courseModuleId === (selection as any).courseModuleId);
    if (!module) return "";
    if (selection.kind === "module") return module.title;

    const quiz = module.quizzes.find((q) => q.moduleQuizId === (selection as any).moduleQuizId);
    return quiz?.title || "";
  })();

  return (
    <section className="relative z-10 overflow-hidden pt-28 pb-16 md:pt-36 lg:pt-[170px] lg:pb-24">
      <div className="container">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <GlassCard title="Course Tree" subtitle="Select an item then build its children.">
              {error && (
                <div className="mb-4 rounded-2xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-300">
                  {error}
                </div>
              )}

              {loading ? (
                <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-6 text-center text-sm text-body-color backdrop-blur-xl dark:border-white/10 dark:bg-white/5 dark:text-body-color-dark">
                  Loading structure...
                </div>
              ) : !structure ? (
                <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-6 text-center text-sm text-body-color backdrop-blur-xl dark:border-white/10 dark:bg-white/5 dark:text-body-color-dark">
                  No data.
                </div>
              ) : (
                <div className="space-y-3">
                  <button
                    onClick={() => setSelection({ kind: "course", courseId: structure.courseId })}
                    className={`w-full rounded-2xl border px-4 py-3 text-left text-sm font-semibold backdrop-blur-xl transition
                      ${selection?.kind === "course"
                        ? "border-primary/40 bg-primary/10 text-black dark:text-white"
                        : "border-white/15 bg-white/10 text-black hover:bg-white/15 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
                      }`}
                  >
                    {structure.title}
                    <div className="mt-1 text-xs font-normal text-body-color dark:text-body-color-dark">
                      CourseId: {structure.courseId}
                    </div>
                  </button>

                  {structure.tracks.map((t) => (
                    <div key={t.courseTrackId} className="ml-2 space-y-2">
                      <button
                        onClick={() =>
                          setSelection({ kind: "track", courseId: structure.courseId, courseTrackId: t.courseTrackId })
                        }
                        className={`w-full rounded-2xl border px-4 py-3 text-left text-sm backdrop-blur-xl transition
                          ${selection?.kind === "track" && (selection as any).courseTrackId === t.courseTrackId
                            ? "border-primary/40 bg-primary/10 text-black dark:text-white"
                            : "border-white/15 bg-white/10 text-black hover:bg-white/15 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
                          }`}
                      >
                        Track: {t.title} <span className="opacity-70">(Order {t.order})</span>
                      </button>

                      {t.modules.map((m) => (
                        <div key={m.courseModuleId} className="ml-4 space-y-2">
                          <button
                            onClick={() =>
                              setSelection({
                                kind: "module",
                                courseId: structure.courseId,
                                courseTrackId: t.courseTrackId,
                                courseModuleId: m.courseModuleId,
                              })
                            }
                            className={`w-full rounded-2xl border px-4 py-3 text-left text-sm backdrop-blur-xl transition
                              ${selection?.kind === "module" && (selection as any).courseModuleId === m.courseModuleId
                                ? "border-primary/40 bg-primary/10 text-black dark:text-white"
                                : "border-white/15 bg-white/10 text-black hover:bg-white/15 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
                              }`}
                          >
                            Module: {m.title} <span className="opacity-70">(Order {m.order})</span>
                          </button>

                          {m.quizzes.map((q) => (
                            <div key={q.moduleQuizId} className="ml-4">
                              <button
                                onClick={() =>
                                  setSelection({
                                    kind: "quiz",
                                    courseId: structure.courseId,
                                    courseTrackId: t.courseTrackId,
                                    courseModuleId: m.courseModuleId,
                                    moduleQuizId: q.moduleQuizId,
                                  })
                                }
                                className={`w-full rounded-2xl border px-4 py-2 text-left text-xs backdrop-blur-xl transition
                                  ${selection?.kind === "quiz" && (selection as any).moduleQuizId === q.moduleQuizId
                                    ? "border-primary/40 bg-primary/10 text-black dark:text-white"
                                    : "border-white/15 bg-white/10 text-black hover:bg-white/15 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
                                  }`}
                              >
                                Quiz: {q.title} <span className="opacity-70">(Order {q.order})</span>
                              </button>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  ))}

                  <div className="pt-2">
                    <MiniButton onClick={fetchStructure}>Refresh Structure</MiniButton>
                  </div>
                </div>
              )}
            </GlassCard>
          </div>

          <div className="lg:col-span-8">
            <GlassCard
              title="Builder Panel"
              subtitle={selection ? `Selected: ${selectedTitle}` : "Select an item from the tree."}
            >
              {!structure || !selection ? (
                <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-6 text-center text-sm text-body-color backdrop-blur-xl dark:border-white/10 dark:bg-white/5 dark:text-body-color-dark">
                  Select something on the left.
                </div>
              ) : (
                <div className="space-y-6">
                  {selection.kind === "course" && (
                    <TracksPanel courseId={structure.courseId} onDone={fetchStructure} />
                  )}

                  {selection.kind === "track" && (
                    <ModulesPanel courseTrackId={selection.courseTrackId} onDone={fetchStructure} />
                  )}

                  {selection.kind === "module" && (
                    <div className="grid grid-cols-1 gap-6">
                      <SectionsPanel courseModuleId={selection.courseModuleId} onDone={fetchStructure} />
                      <QuizzesPanel courseModuleId={selection.courseModuleId} onDone={fetchStructure} />
                    </div>
                  )}

                  {selection.kind === "quiz" && (
                    <QuestionsPanel moduleQuizId={selection.moduleQuizId} />
                  )}

                  <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-4 text-sm text-body-color backdrop-blur-xl dark:border-white/10 dark:bg-white/5 dark:text-body-color-dark">
                    <div className="font-semibold text-black dark:text-white">Notes</div>
                    <div className="mt-1 text-xs">
                      Questions/Options endpoints are not in your controller yet, so that panel is UI-ready but disabled.
                    </div>
                  </div>
                </div>
              )}
            </GlassCard>
          </div>
        </div>
      </div>
    </section>
  );
}