"use client";

import React, { useEffect, useMemo, useState } from "react";

const API = "https://localhost:7145/api/courses";

function cn(...xs: Array<string | false | undefined | null>) {
  return xs.filter(Boolean).join(" ");
}

function getToken() {
  return localStorage.getItem("token") || localStorage.getItem("Token") || "";
}

async function req<T>(url: string, init?: RequestInit): Promise<T> {
  const token = getToken();

  const res = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(txt || `Request failed (${res.status})`);
  }

  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) return (await res.json()) as T;
  return (await res.text()) as unknown as T;
}

function formatDuration(seconds?: number | null) {
  const s = Number(seconds ?? 0);
  if (!s || s <= 0) return "0m";
  const mins = Math.floor(s / 60);
  const rem = s % 60;
  if (mins <= 0) return `${rem}s`;
  return rem ? `${mins}m ${rem}s` : `${mins}m`;
}

type SectionDto = {
  courseSectionId: number;
  title: string;
  contentType: number;
  contentUrl?: string | null;
  durationSeconds?: number | null;
  order: number;
  isPreview?: boolean;
};

type ModuleQuizDto = {
  moduleQuizId: number;
  title: string;
  description?: string | null;
  passingScore: number;
  maxAttempts: number;
  isFinalInModule: boolean;
  order: number;
};

type ModuleDto = {
  courseModuleId: number;
  title: string;
  description?: string | null;
  order: number;
  sections: SectionDto[];
  quizzes: ModuleQuizDto[];
};

type TrackDto = {
  courseTrackId: number;
  title: string;
  description?: string | null;
  order: number;
  isRequired: boolean;
  modules: ModuleDto[];
};

type CourseStructureDto = {
  courseId: number;
  title: string;
  tracks: TrackDto[];
};

type CourseResponseDto = {
  courseId: number;
  title: string;
  description: string;
  price: number;
  startDate: string;
  endDate: string;
  categoryName?: string | null;
};

type UpdateCourseDto = {
  title: string;
  description: string;
  price: number;
  startDate: string;
  endDate: string;
  categoryId: number;
  parentCourseId: number | null;
  isPro: boolean;
};

type ModalState =
  | null
  | { kind: "course" }
  | { kind: "track-create" }
  | { kind: "track-edit"; track: TrackDto }
  | { kind: "module-create"; trackId: number }
  | { kind: "module-edit"; module: ModuleDto }
  | { kind: "section-create"; moduleId: number }
  | { kind: "section-edit"; section: SectionDto }
  | { kind: "quiz-create"; moduleId: number }
  | { kind: "quiz-edit"; quiz: ModuleQuizDto };

function Input({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: any;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <div className="mb-1 text-xs font-bold text-black/70 dark:text-white/70">
        {label}
      </div>
      <input
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        type={type}
        placeholder={placeholder}
        className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm text-black shadow-sm outline-none focus:border-primary dark:border-white/10 dark:bg-dark dark:text-white"
      />
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: any;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <div className="mb-1 text-xs font-bold text-black/70 dark:text-white/70">
        {label}
      </div>
      <textarea
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[90px] w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm text-black shadow-sm outline-none focus:border-primary dark:border-white/10 dark:bg-dark dark:text-white"
      />
    </label>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={cn(
        "flex w-full items-center justify-between rounded-xl border px-3 py-2 text-sm font-semibold shadow-sm transition",
        checked
          ? "border-primary/30 bg-primary/10 text-primary dark:border-white/10 dark:bg-white/10 dark:text-white"
          : "border-black/10 bg-white text-black hover:bg-black/5 dark:border-white/10 dark:bg-dark dark:text-white dark:hover:bg-white/5"
      )}
    >
      <span>{label}</span>
      <span
        className={cn(
          "h-5 w-10 rounded-full p-0.5 transition",
          checked ? "bg-primary" : "bg-black/20 dark:bg-white/20"
        )}
      >
        <span
          className={cn(
            "block h-4 w-4 rounded-full bg-white transition",
            checked ? "translate-x-5" : "translate-x-0"
          )}
        />
      </span>
    </button>
  );
}

function Modal({
  open,
  title,
  children,
  onClose,
}: {
  open: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl rounded-2xl border border-black/10 bg-white p-5 shadow-xl dark:border-white/10 dark:bg-dark">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div className="text-base font-extrabold text-black dark:text-white">
            {title}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-black/10 bg-black/5 px-3 py-1.5 text-xs font-bold text-black transition hover:bg-black/10 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
          >
            Close
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Btn({
  children,
  onClick,
  tone = "neutral",
}: {
  children: React.ReactNode;
  onClick: () => void;
  tone?: "neutral" | "primary" | "danger";
}) {
  const cls =
    tone === "primary"
      ? "bg-primary text-white hover:bg-primary/90"
      : tone === "danger"
      ? "bg-red-600 text-white hover:bg-red-700"
      : "bg-black/5 text-black hover:bg-black/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10";

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn("rounded-lg px-3 py-2 text-xs font-extrabold transition", cls)}
    >
      {children}
    </button>
  );
}

export default function CourseBuilderEditor({ courseId }: { courseId: number }) {
  const [loading, setLoading] = useState(true);
  const [structure, setStructure] = useState<CourseStructureDto | null>(null);
  const [course, setCourse] = useState<CourseResponseDto | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [modal, setModal] = useState<ModalState>(null);

  async function refresh() {
    setLoading(true);
    setError(null);

    try {
      const [st, c] = await Promise.all([
        req<CourseStructureDto>(`${API}/GetCourseStructure/${courseId}`, {
          method: "GET",
        }),
        req<CourseResponseDto>(`${API}/GetCourse/${courseId}`, {
          method: "GET",
        }),
      ]);

      setStructure(st);
      setCourse(c);
    } catch (e: any) {
      setError(e?.message || "Failed to load course.");
      setStructure(null);
      setCourse(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!courseId || Number.isNaN(courseId)) {
      setError("Invalid course id");
      setLoading(false);
      return;
    }
    refresh();
  }, [courseId]);

  const counts = useMemo(() => {
    const tracks = structure?.tracks?.length ?? 0;
    const modules =
      structure?.tracks?.reduce((a, t) => a + (t.modules?.length ?? 0), 0) ?? 0;
    const sections =
      structure?.tracks?.reduce(
        (a, t) =>
          a +
          (t.modules?.reduce((b, m) => b + (m.sections?.length ?? 0), 0) ?? 0),
        0
      ) ?? 0;
    const quizzes =
      structure?.tracks?.reduce(
        (a, t) =>
          a +
          (t.modules?.reduce((b, m) => b + (m.quizzes?.length ?? 0), 0) ?? 0),
        0
      ) ?? 0;

    return { tracks, modules, sections, quizzes };
  }, [structure]);

  if (loading) {
    return <div className="container py-16 text-center">Loading...</div>;
  }

  if (error) {
    return (
      <div className="container py-16">
        <div className="rounded-2xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-300">
          {error}
        </div>
        <div className="mt-6">
          <Btn onClick={refresh} tone="primary">
            Retry
          </Btn>
        </div>
      </div>
    );
  }

  if (!structure) {
    return (
      <div className="container py-16">
        <div className="rounded-2xl border border-black/10 bg-white px-4 py-6 text-center text-sm text-black/70 shadow-sm dark:border-white/10 dark:bg-dark dark:text-white/70">
          Course not found.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f5f8ff] dark:bg-[#050b18]" style={{ marginTop: "80px" }}>
      <div className="container py-10">
        <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-dark">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="text-xs font-bold text-black/60 dark:text-white/60">
                Admin Course Builder
              </div>
              <div className="mt-2 text-2xl font-extrabold text-black dark:text-white">
                {structure.title}
              </div>
              <div className="mt-2 flex flex-wrap gap-2 text-xs">
                <span className="rounded-full bg-black/5 px-3 py-1 font-bold text-black/70 dark:bg-white/10 dark:text-white/70">
                  {counts.tracks} tracks
                </span>
                <span className="rounded-full bg-black/5 px-3 py-1 font-bold text-black/70 dark:bg-white/10 dark:text-white/70">
                  {counts.modules} modules
                </span>
                <span className="rounded-full bg-black/5 px-3 py-1 font-bold text-black/70 dark:bg-white/10 dark:text-white/70">
                  {counts.sections} sections
                </span>
                <span className="rounded-full bg-black/5 px-3 py-1 font-bold text-black/70 dark:bg-white/10 dark:text-white/70">
                  {counts.quizzes} quizzes
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Btn onClick={() => setModal({ kind: "course" })} tone="primary">
                Edit Course Info
              </Btn>
              <Btn
                tone="danger"
                onClick={async () => {
                  const ok = confirm("Delete this course?");
                  if (!ok) return;
                  try {
                    await req(`${API}/DeleteCourse/${courseId}`, { method: "DELETE" });
                    alert("Deleted.");
                    window.location.href = "/courses";
                  } catch (e: any) {
                    alert(e?.message || "Delete failed");
                  }
                }}
              >
                Delete Course
              </Btn>
              <Btn onClick={() => setModal({ kind: "track-create" })}>
                + Add Track
              </Btn>
            </div>
          </div>
        </div>

        <div className="mt-10 space-y-6">
          {(structure.tracks ?? [])
            .slice()
            .sort((a, b) => a.order - b.order)
            .map((t) => (
              <div
                key={t.courseTrackId}
                className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-dark"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="rounded-full bg-black/5 px-3 py-1 font-bold text-black/70 dark:bg-white/10 dark:text-white/70">
                        Track {t.order}
                      </span>
                      <span className="rounded-full bg-black/5 px-3 py-1 font-bold text-black/70 dark:bg-white/10 dark:text-white/70">
                        {t.isRequired ? "Required" : "Optional"}
                      </span>
                    </div>

                    <div className="mt-2 truncate text-lg font-extrabold text-black dark:text-white">
                      {t.title}
                    </div>

                    {t.description ? (
                      <div className="mt-1 text-sm text-black/70 dark:text-white/70">
                        {t.description}
                      </div>
                    ) : null}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Btn onClick={() => setModal({ kind: "track-edit", track: t })}>
                      Edit
                    </Btn>
                    <Btn
                      tone="danger"
                      onClick={async () => {
                        const ok = confirm("Delete this track?");
                        if (!ok) return;
                        try {
                          await req(`${API}/DeleteTrack/${t.courseTrackId}`, {
                            method: "DELETE",
                          });
                          await refresh();
                        } catch (e: any) {
                          alert(e?.message || "Delete failed");
                        }
                      }}
                    >
                      Delete
                    </Btn>
                    <Btn
                      onClick={() =>
                        setModal({
                          kind: "module-create",
                          trackId: t.courseTrackId,
                        })
                      }
                    >
                      + Add Module
                    </Btn>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  {(t.modules ?? [])
                    .slice()
                    .sort((a, b) => a.order - b.order)
                    .map((m) => (
                      <div
                        key={m.courseModuleId}
                        className="rounded-2xl border border-black/10 bg-black/5 p-5 dark:border-white/10 dark:bg-white/5"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2 text-xs">
                              <span className="rounded-full bg-white px-3 py-1 font-bold text-black/70 shadow-sm dark:bg-dark dark:text-white/70">
                                Module {m.order}
                              </span>
                              <span className="rounded-full bg-white px-3 py-1 font-bold text-black/70 shadow-sm dark:bg-dark dark:text-white/70">
                                {(m.sections?.length ?? 0)} sections
                              </span>
                              <span className="rounded-full bg-white px-3 py-1 font-bold text-black/70 shadow-sm dark:bg-dark dark:text-white/70">
                                {(m.quizzes?.length ?? 0)} quizzes
                              </span>
                            </div>

                            <div className="mt-2 text-base font-extrabold text-black dark:text-white">
                              {m.title}
                            </div>

                            {m.description ? (
                              <div className="mt-1 text-sm text-black/70 dark:text-white/70">
                                {m.description}
                              </div>
                            ) : null}
                          </div>

                          <div className="flex flex-wrap gap-2">
                            <Btn
                              onClick={() =>
                                setModal({ kind: "module-edit", module: m })
                              }
                            >
                              Edit
                            </Btn>
                            <Btn
                              tone="danger"
                              onClick={async () => {
                                const ok = confirm("Delete this module?");
                                if (!ok) return;
                                try {
                                  await req(`${API}/DeleteModule/${m.courseModuleId}`, {
                                    method: "DELETE",
                                  });
                                  await refresh();
                                } catch (e: any) {
                                  alert(e?.message || "Delete failed");
                                }
                              }}
                            >
                              Delete
                            </Btn>
                            <Btn
                              onClick={() =>
                                setModal({
                                  kind: "section-create",
                                  moduleId: m.courseModuleId,
                                })
                              }
                            >
                              + Add Section
                            </Btn>
                            <Btn
                              onClick={() =>
                                setModal({
                                  kind: "quiz-create",
                                  moduleId: m.courseModuleId,
                                })
                              }
                            >
                              + Add Quiz
                            </Btn>
                          </div>
                        </div>

                        <div className="mt-5">
                          <div className="mb-2 text-xs font-extrabold text-black/60 dark:text-white/60">
                            Sections
                          </div>
                          <div className="space-y-2">
                            {(m.sections ?? [])
                              .slice()
                              .sort((a, b) => a.order - b.order)
                              .map((s) => (
                                <div
                                  key={s.courseSectionId}
                                  className="flex flex-wrap items-start justify-between gap-3 rounded-xl border border-black/10 bg-white px-4 py-3 shadow-sm dark:border-white/10 dark:bg-dark"
                                >
                                  <div className="min-w-0">
                                    <div className="text-sm font-extrabold text-black dark:text-white">
                                      {s.order}. {s.title}
                                    </div>
                                    <div className="mt-1 text-xs text-black/60 dark:text-white/60">
                                      {String(s.contentType)} •{" "}
                                      {formatDuration(s.durationSeconds)} •{" "}
                                      {s.isPreview ? "Preview" : "Full"}
                                    </div>
                                  </div>

                                  <div className="flex gap-2">
                                    <Btn
                                      onClick={() =>
                                        setModal({
                                          kind: "section-edit",
                                          section: s,
                                        })
                                      }
                                    >
                                      Edit
                                    </Btn>
                                    <Btn
                                      tone="danger"
                                      onClick={async () => {
                                        const ok = confirm("Delete this section?");
                                        if (!ok) return;
                                        try {
                                          await req(
                                            `${API}/DeleteSection/${s.courseSectionId}`,
                                            { method: "DELETE" }
                                          );
                                          await refresh();
                                        } catch (e: any) {
                                          alert(e?.message || "Delete failed");
                                        }
                                      }}
                                    >
                                      Delete
                                    </Btn>
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>

                        <div className="mt-6">
                          <div className="mb-2 text-xs font-extrabold text-black/60 dark:text-white/60">
                            Quizzes
                          </div>
                          <div className="space-y-2">
                            {(m.quizzes ?? [])
                              .slice()
                              .sort((a, b) => a.order - b.order)
                              .map((q) => (
                                <div
                                  key={q.moduleQuizId}
                                  className="flex flex-wrap items-start justify-between gap-3 rounded-xl border border-black/10 bg-white px-4 py-3 shadow-sm dark:border-white/10 dark:bg-dark"
                                >
                                  <div className="min-w-0">
                                    <div className="text-sm font-extrabold text-black dark:text-white">
                                      Quiz {q.order}. {q.title}
                                    </div>
                                    <div className="mt-1 text-xs text-black/60 dark:text-white/60">
                                      Pass {q.passingScore}% • Attempts{" "}
                                      {q.maxAttempts} •{" "}
                                      {q.isFinalInModule ? "Final" : "Practice"}
                                    </div>
                                  </div>

                                  <div className="flex flex-wrap gap-2">
                                    <Btn
                                      onClick={() =>
                                        setModal({ kind: "quiz-edit", quiz: q })
                                      }
                                    >
                                      Edit
                                    </Btn>
                                    <Btn
                                      tone="danger"
                                      onClick={async () => {
                                        const ok = confirm("Delete this quiz?");
                                        if (!ok) return;
                                        try {
                                          await req(
                                            `${API}/DeleteModuleQuiz/${q.moduleQuizId}`,
                                            { method: "DELETE" }
                                          );
                                          await refresh();
                                        } catch (e: any) {
                                          alert(e?.message || "Delete failed");
                                        }
                                      }}
                                    >
                                      Delete
                                    </Btn>
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
        </div>

        <CourseModals
          modal={modal}
          onClose={() => setModal(null)}
          courseId={courseId}
          course={course}
          onSaved={async () => {
            setModal(null);
            await refresh();
          }}
        />
      </div>
    </div>
  );
}

function CourseModals({
  modal,
  onClose,
  courseId,
  course,
  onSaved,
}: {
  modal: ModalState;
  onClose: () => void;
  courseId: number;
  course: CourseResponseDto | null;
  onSaved: () => Promise<void>;
}) {
  const [cTitle, setCTitle] = useState(course?.title ?? "");
  const [cDesc, setCDesc] = useState(course?.description ?? "");
  const [cPrice, setCPrice] = useState(String(course?.price ?? 0));
  const [cStart, setCStart] = useState((course?.startDate ?? "").slice(0, 16));
  const [cEnd, setCEnd] = useState((course?.endDate ?? "").slice(0, 16));
  const [cCategoryId, setCCategoryId] = useState("1");
  const [cParentId, setCParentId] = useState("");
  const [cIsPro, setCIsPro] = useState(false);

  const [tTitle, setTTitle] = useState("");
  const [tDesc, setTDesc] = useState("");
  const [tOrder, setTOrder] = useState("1");
  const [tReq, setTReq] = useState(true);

  const [mTitle, setMTitle] = useState("");
  const [mDesc, setMDesc] = useState("");
  const [mOrder, setMOrder] = useState("1");

  const [sTitle, setSTitle] = useState("");
  const [sType, setSType] = useState("2");
  const [sUrl, setSUrl] = useState("");
  const [sDur, setSDur] = useState("0");
  const [sOrder, setSOrder] = useState("1");
  const [sPrev, setSPrev] = useState(false);

  const [qTitle, setQTitle] = useState("");
  const [qDesc, setQDesc] = useState("");
  const [qPass, setQPass] = useState("70");
  const [qAttempts, setQAttempts] = useState("3");
  const [qFinal, setQFinal] = useState(false);
  const [qOrder, setQOrder] = useState("1");

  useEffect(() => {
    setCTitle(course?.title ?? "");
    setCDesc(course?.description ?? "");
    setCPrice(String(course?.price ?? 0));
    setCStart((course?.startDate ?? "").slice(0, 16));
    setCEnd((course?.endDate ?? "").slice(0, 16));
  }, [course]);

  useEffect(() => {
    if (!modal) return;

    if (modal.kind === "track-edit") {
      setTTitle(modal.track.title ?? "");
      setTDesc(modal.track.description ?? "");
      setTOrder(String(modal.track.order ?? 1));
      setTReq(Boolean(modal.track.isRequired));
    }

    if (modal.kind === "module-edit") {
      setMTitle(modal.module.title ?? "");
      setMDesc(modal.module.description ?? "");
      setMOrder(String(modal.module.order ?? 1));
    }

    if (modal.kind === "section-edit") {
      setSTitle(modal.section.title ?? "");
      setSType(String(modal.section.contentType ?? 2));
      setSUrl(String(modal.section.contentUrl ?? ""));
      setSDur(String(modal.section.durationSeconds ?? 0));
      setSOrder(String(modal.section.order ?? 1));
      setSPrev(Boolean(modal.section.isPreview));
    }

    if (modal.kind === "quiz-edit") {
      setQTitle(modal.quiz.title ?? "");
      setQDesc(String(modal.quiz.description ?? ""));
      setQPass(String(modal.quiz.passingScore ?? 70));
      setQAttempts(String(modal.quiz.maxAttempts ?? 3));
      setQFinal(Boolean(modal.quiz.isFinalInModule));
      setQOrder(String(modal.quiz.order ?? 1));
    }
  }, [modal]);

  if (!modal) return null;

  return (
    <>
      <Modal open={modal.kind === "course"} title="Edit Course Info" onClose={onClose}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input label="Title" value={cTitle} onChange={setCTitle} />
          <Input label="Price" value={cPrice} onChange={setCPrice} type="number" />
          <div className="md:col-span-2">
            <TextArea label="Description" value={cDesc} onChange={setCDesc} />
          </div>
          <Input label="StartDate" value={cStart} onChange={setCStart} type="datetime-local" />
          <Input label="EndDate" value={cEnd} onChange={setCEnd} type="datetime-local" />
          <Input label="CategoryId" value={cCategoryId} onChange={setCCategoryId} type="number" />
          <Input
            label="ParentCourseId (empty = none)"
            value={cParentId}
            onChange={setCParentId}
            type="number"
          />
          <div className="md:col-span-2">
            <Toggle label="IsPro" checked={cIsPro} onChange={setCIsPro} />
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <Btn onClick={onClose}>Cancel</Btn>
          <Btn
            tone="primary"
            onClick={async () => {
              try {
                const parsedParent = Number(cParentId);
                const dto: UpdateCourseDto = {
                  title: cTitle.trim(),
                  description: cDesc.trim(),
                  price: Number(cPrice || 0),
                  startDate: cStart
                    ? new Date(cStart).toISOString()
                    : new Date().toISOString(),
                  endDate: cEnd
                    ? new Date(cEnd).toISOString()
                    : new Date().toISOString(),
                  categoryId: Number(cCategoryId || 1),
                  parentCourseId:
                    !cParentId || Number.isNaN(parsedParent) || parsedParent <= 0
                      ? null
                      : parsedParent,
                  isPro: Boolean(cIsPro),
                };

                await req(`${API}/UpdateCourse/${courseId}`, {
                  method: "PUT",
                  body: JSON.stringify(dto),
                });

                await onSaved();
              } catch (e: any) {
                alert(e?.message || "Update failed");
              }
            }}
          >
            Save
          </Btn>
        </div>
      </Modal>

      <Modal open={modal.kind === "track-create"} title="Add Track" onClose={onClose}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input label="Title" value={tTitle} onChange={setTTitle} />
          <Input label="Order" value={tOrder} onChange={setTOrder} type="number" />
          <div className="md:col-span-2">
            <TextArea label="Description" value={tDesc} onChange={setTDesc} />
          </div>
          <div className="md:col-span-2">
            <Toggle label="IsRequired" checked={tReq} onChange={setTReq} />
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <Btn onClick={onClose}>Cancel</Btn>
          <Btn
            tone="primary"
            onClick={async () => {
              try {
                if (modal.kind !== "track-create") return;

                await req(`${API}/CreateTrack`, {
                  method: "POST",
                  body: JSON.stringify({
                    courseId,
                    title: tTitle.trim(),
                    description: tDesc.trim() || null,
                    order: Number(tOrder || 1),
                    isRequired: Boolean(tReq),
                  }),
                });

                await onSaved();
              } catch (e: any) {
                alert(e?.message || "Create failed");
              }
            }}
          >
            Create
          </Btn>
        </div>
      </Modal>

      <Modal open={modal.kind === "track-edit"} title="Edit Track" onClose={onClose}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input label="Title" value={tTitle} onChange={setTTitle} />
          <Input label="Order" value={tOrder} onChange={setTOrder} type="number" />
          <div className="md:col-span-2">
            <TextArea label="Description" value={tDesc} onChange={setTDesc} />
          </div>
          <div className="md:col-span-2">
            <Toggle label="IsRequired" checked={tReq} onChange={setTReq} />
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <Btn onClick={onClose}>Cancel</Btn>
          <Btn
            tone="primary"
            onClick={async () => {
              try {
                if (modal.kind !== "track-edit") return;

                await req(`${API}/UpdateTrack/${modal.track.courseTrackId}`, {
                  method: "PUT",
                  body: JSON.stringify({
                    title: tTitle.trim(),
                    description: tDesc.trim() || null,
                    order: Number(tOrder || 1),
                    isRequired: Boolean(tReq),
                  }),
                });

                await onSaved();
              } catch (e: any) {
                alert(e?.message || "Update failed");
              }
            }}
          >
            Save
          </Btn>
        </div>
      </Modal>

      <Modal open={modal.kind === "module-create"} title="Add Module" onClose={onClose}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input label="Title" value={mTitle} onChange={setMTitle} />
          <Input label="Order" value={mOrder} onChange={setMOrder} type="number" />
          <div className="md:col-span-2">
            <TextArea label="Description" value={mDesc} onChange={setMDesc} />
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <Btn onClick={onClose}>Cancel</Btn>
          <Btn
            tone="primary"
            onClick={async () => {
              try {
                if (modal.kind !== "module-create") return;

                await req(`${API}/CreateModule`, {
                  method: "POST",
                  body: JSON.stringify({
                    courseTrackId: modal.trackId,
                    title: mTitle.trim(),
                    description: mDesc.trim() || null,
                    order: Number(mOrder || 1),
                  }),
                });

                await onSaved();
              } catch (e: any) {
                alert(e?.message || "Create failed");
              }
            }}
          >
            Create
          </Btn>
        </div>
      </Modal>

      <Modal open={modal.kind === "module-edit"} title="Edit Module" onClose={onClose}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input label="Title" value={mTitle} onChange={setMTitle} />
          <Input label="Order" value={mOrder} onChange={setMOrder} type="number" />
          <div className="md:col-span-2">
            <TextArea label="Description" value={mDesc} onChange={setMDesc} />
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <Btn onClick={onClose}>Cancel</Btn>
          <Btn
            tone="primary"
            onClick={async () => {
              try {
                if (modal.kind !== "module-edit") return;

                await req(`${API}/UpdateModule/${modal.module.courseModuleId}`, {
                  method: "PUT",
                  body: JSON.stringify({
                    title: mTitle.trim(),
                    description: mDesc.trim() || null,
                    order: Number(mOrder || 1),
                  }),
                });

                await onSaved();
              } catch (e: any) {
                alert(e?.message || "Update failed");
              }
            }}
          >
            Save
          </Btn>
        </div>
      </Modal>

      <Modal open={modal.kind === "section-create"} title="Add Section" onClose={onClose}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input label="Title" value={sTitle} onChange={setSTitle} />
          <Input label="Order" value={sOrder} onChange={setSOrder} type="number" />
          <Input
            label="ContentType (number)"
            value={sType}
            onChange={setSType}
            type="number"
          />
          <Input label="DurationSeconds" value={sDur} onChange={setSDur} type="number" />
          <div className="md:col-span-2">
            <Input label="ContentUrl" value={sUrl} onChange={setSUrl} />
          </div>
          <div className="md:col-span-2">
            <Toggle label="IsPreview" checked={sPrev} onChange={setSPrev} />
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <Btn onClick={onClose}>Cancel</Btn>
          <Btn
            tone="primary"
            onClick={async () => {
              try {
                if (modal.kind !== "section-create") return;

                const payload = {
                  courseModuleId: modal.moduleId,
                  title: sTitle.trim(),
                  contentType: Number(sType),
                  contentUrl: sUrl.trim() || null,
                  durationSeconds: Number(sDur || 0),
                  order: Number(sOrder || 1),
                  isPreview: Boolean(sPrev),
                };

                await req(`${API}/CreateSection`, {
                  method: "POST",
                  body: JSON.stringify(payload),
                });

                await onSaved();
              } catch (e: any) {
                alert(e?.message || "Create failed");
              }
            }}
          >
            Create
          </Btn>
        </div>
      </Modal>

      <Modal open={modal.kind === "section-edit"} title="Edit Section" onClose={onClose}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input label="Title" value={sTitle} onChange={setSTitle} />
          <Input label="Order" value={sOrder} onChange={setSOrder} type="number" />
          <Input
            label="ContentType (number)"
            value={sType}
            onChange={setSType}
            type="number"
          />
          <Input label="DurationSeconds" value={sDur} onChange={setSDur} type="number" />
          <div className="md:col-span-2">
            <Input label="ContentUrl" value={sUrl} onChange={setSUrl} />
          </div>
          <div className="md:col-span-2">
            <Toggle label="IsPreview" checked={sPrev} onChange={setSPrev} />
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <Btn onClick={onClose}>Cancel</Btn>
          <Btn
            tone="primary"
            onClick={async () => {
              try {
                if (modal.kind !== "section-edit") return;

                const payload = {
                  title: sTitle.trim(),
                  contentType: Number(sType),
                  contentUrl: sUrl.trim() || null,
                  durationSeconds: Number(sDur || 0),
                  order: Number(sOrder || 1),
                  isPreview: Boolean(sPrev),
                };

                await req(`${API}/UpdateSection/${modal.section.courseSectionId}`, {
                  method: "PUT",
                  body: JSON.stringify(payload),
                });

                await onSaved();
              } catch (e: any) {
                alert(e?.message || "Update failed");
              }
            }}
          >
            Save
          </Btn>
        </div>
      </Modal>

      <Modal open={modal.kind === "quiz-create"} title="Add Quiz" onClose={onClose}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input label="Title" value={qTitle} onChange={setQTitle} />
          <Input label="Order" value={qOrder} onChange={setQOrder} type="number" />
          <Input label="PassingScore" value={qPass} onChange={setQPass} type="number" />
          <Input label="MaxAttempts" value={qAttempts} onChange={setQAttempts} type="number" />
          <div className="md:col-span-2">
            <TextArea label="Description" value={qDesc} onChange={setQDesc} />
          </div>
          <div className="md:col-span-2">
            <Toggle label="IsFinalInModule" checked={qFinal} onChange={setQFinal} />
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <Btn onClick={onClose}>Cancel</Btn>
          <Btn
            tone="primary"
            onClick={async () => {
              try {
                if (modal.kind !== "quiz-create") return;

                await req(`${API}/CreateModuleQuiz`, {
                  method: "POST",
                  body: JSON.stringify({
                    courseModuleId: modal.moduleId,
                    title: qTitle.trim(),
                    description: qDesc.trim() || null,
                    passingScore: Number(qPass || 0),
                    maxAttempts: Number(qAttempts || 1),
                    isFinalInModule: Boolean(qFinal),
                    order: Number(qOrder || 1),
                  }),
                });

                await onSaved();
              } catch (e: any) {
                alert(e?.message || "Create failed");
              }
            }}
          >
            Create
          </Btn>
        </div>
      </Modal>

      <Modal open={modal.kind === "quiz-edit"} title="Edit Quiz" onClose={onClose}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input label="Title" value={qTitle} onChange={setQTitle} />
          <Input label="Order" value={qOrder} onChange={setQOrder} type="number" />
          <Input label="PassingScore" value={qPass} onChange={setQPass} type="number" />
          <Input label="MaxAttempts" value={qAttempts} onChange={setQAttempts} type="number" />
          <div className="md:col-span-2">
            <TextArea label="Description" value={qDesc} onChange={setQDesc} />
          </div>
          <div className="md:col-span-2">
            <Toggle label="IsFinalInModule" checked={qFinal} onChange={setQFinal} />
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <Btn onClick={onClose}>Cancel</Btn>
          <Btn
            tone="primary"
            onClick={async () => {
              try {
                if (modal.kind !== "quiz-edit") return;

                await req(`${API}/UpdateModuleQuiz/${modal.quiz.moduleQuizId}`, {
                  method: "PUT",
                  body: JSON.stringify({
                    title: qTitle.trim(),
                    description: qDesc.trim() || null,
                    passingScore: Number(qPass || 0),
                    maxAttempts: Number(qAttempts || 1),
                    isFinalInModule: Boolean(qFinal),
                    order: Number(qOrder || 1),
                  }),
                });

                await onSaved();
              } catch (e: any) {
                alert(e?.message || "Update failed");
              }
            }}
          >
            Save
          </Btn>
        </div>
      </Modal>
    </>
  );
}