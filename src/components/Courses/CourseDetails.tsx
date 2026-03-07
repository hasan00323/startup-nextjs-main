"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

type SectionDto = {
  courseSectionId: number;
  title: string;
  contentType: number | string;
  contentUrl?: string | null;
  durationSeconds?: number | null;
  order: number;
  isPreview?: boolean;
};

type ModuleQuizDto = {
  moduleQuizId: number;
  title: string;
  passingScore: number;
  maxAttempts: number;
  isFinalInModule: boolean;
  order: number;
};

type ModuleDto = {
  courseModuleId: number;
  title: string;
  order: number;
  sections: SectionDto[];
  quizzes: ModuleQuizDto[];
};

type TrackDto = {
  courseTrackId: number;
  title: string;
  order: number;
  isRequired: boolean;
  modules: ModuleDto[];
};

type CourseStructureDto = {
  courseId: number;
  title: string;
  tracks: TrackDto[];
};

type TabKey = "about" | "outcomes" | "courses" | "testimonials";

function formatNumber(n: number) {
  try {
    return new Intl.NumberFormat().format(n);
  } catch {
    return String(n);
  }
}

function clampText(text: string, max = 240) {
  const t = (text || "").trim();
  if (t.length <= max) return t;
  return t.slice(0, max - 1) + "…";
}

function useReveal<T extends HTMLElement>(threshold = 0.16) {
  const ref = useRef<T | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const e = entries[0];
        if (e.isIntersecting) {
          setShow(true);
          obs.disconnect();
        }
      },
      { threshold }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, show };
}

function formatDuration(seconds?: number | null) {
  const s = Number(seconds || 0);
  if (!s) return "—";
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  const mm = m % 60;
  if (h > 0) return `${h}h ${mm}m`;
  return `${m}m`;
}

function sumSeconds(structure: CourseStructureDto | null) {
  if (!structure) return 0;
  return (structure.tracks ?? []).reduce((accT, t) => {
    const tSec = (t.modules ?? []).reduce((accM, m) => {
      const mSec = (m.sections ?? []).reduce((accS, s) => accS + Number(s.durationSeconds || 0), 0);
      return accM + mSec;
    }, 0);
    return accT + tSec;
  }, 0);
}

function statCounts(structure: CourseStructureDto | null) {
  const tracks = structure?.tracks?.length ?? 0;
  const modules =
    structure?.tracks?.reduce((a, t) => a + (t.modules?.length ?? 0), 0) ?? 0;

  const sections =
    structure?.tracks?.reduce(
      (a, t) => a + (t.modules?.reduce((b, m) => b + (m.sections?.length ?? 0), 0) ?? 0),
      0
    ) ?? 0;

  const quizzes =
    structure?.tracks?.reduce(
      (a, t) => a + (t.modules?.reduce((b, m) => b + (m.quizzes?.length ?? 0), 0) ?? 0),
      0
    ) ?? 0;

  return { tracks, modules, sections, quizzes };
}

// تحسين الـ Badge بلمسة Glassmorphism
function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-black/10 bg-white/60 px-3 py-1.5 text-xs font-semibold text-black shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-white/10 dark:text-white">
      {children}
    </span>
  );
}

// تحسين أزرار التبويبات (Tabs) لتصبح أكثر عصرية
function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "rounded-xl px-5 py-2.5 text-sm font-bold transition-all duration-300",
        active
          ? "bg-primary text-white shadow-lg shadow-primary/30"
          : "text-black/70 hover:bg-black/5 dark:text-white/70 dark:hover:bg-white/10",
      ].join(" ")}
      type="button"
    >
      {children}
    </button>
  );
}

// تحسين شريط الإحصائيات (StatRow)
function StatRow({
  leftTitle,
  leftDesc,
  rating,
  reviews,
  level,
  schedule,
  degree,
}: {
  leftTitle: string;
  leftDesc: string;
  rating: string;
  reviews: string;
  level: string;
  schedule: string;
  degree: string;
}) {
  return (
    <div className="mt-10 rounded-3xl border border-black/10 bg-white/70 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
      <div className="grid grid-cols-1 divide-y divide-black/10 md:grid-cols-5 md:divide-x md:divide-y-0 dark:divide-white/10">
        <div className="p-6">
          <div className="text-base font-extrabold text-black dark:text-white">{leftTitle}</div>
          <div className="mt-1 text-sm text-body-color dark:text-body-color-dark">{leftDesc}</div>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-2">
            <div className="text-base font-extrabold text-black dark:text-white">{rating}</div>
            <div className="text-yellow-500">★</div>
          </div>
          <div className="mt-1 text-sm text-body-color dark:text-body-color-dark">{reviews}</div>
        </div>

        <div className="p-6">
          <div className="text-base font-extrabold text-black dark:text-white">{level}</div>
          <div className="mt-1 text-sm text-body-color dark:text-body-color-dark">No prior experience required</div>
        </div>

        <div className="p-6">
          <div className="text-base font-extrabold text-black dark:text-white">{schedule}</div>
          <div className="mt-1 text-sm text-body-color dark:text-body-color-dark">Learn at your own pace</div>
        </div>

        <div className="p-6">
          <div className="text-base font-extrabold text-black dark:text-white">{degree}</div>
          <div className="mt-1 text-sm text-primary underline decoration-primary/30 transition hover:decoration-primary">
            Learn more
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionReveal({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const r = useReveal<HTMLDivElement>(0.18);
  return (
    <div
      ref={r.ref}
      className={[
        className,
        "transition-all duration-700 ease-out will-change-transform",
        r.show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
      ].join(" ")}
    >
      {children}
    </div>
  );
}

export default function CourseCourseraDetailsPage() {
  const params = useParams<{ id: string }>();
  const courseId = Number(params?.id);

  const [loading, setLoading] = useState(true);
  const [structure, setStructure] = useState<CourseStructureDto | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<TabKey>("about");

  useEffect(() => {
    if (!courseId || Number.isNaN(courseId)) {
      setError("Invalid course id.");
      setLoading(false);
      return;
    }

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`https://localhost:7145/api/courses/GetCourseStructure/${courseId}`, {
          method: "GET",
        });

        if (!res.ok) {
          const txt = await res.text().catch(() => "");
          throw new Error(txt || `Request failed (${res.status})`);
        }

        const data = (await res.json()) as CourseStructureDto;
        setStructure(data || null);
      } catch (e: any) {
        setError(e?.message || "Something went wrong");
        setStructure(null);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [courseId]);

  const counts = useMemo(() => statCounts(structure), [structure]);
  const totalSeconds = useMemo(() => sumSeconds(structure), [structure]);
  const totalDuration = useMemo(() => formatDuration(totalSeconds), [totalSeconds]);

  const fakeEnrolled = useMemo(() => 409047 + (structure?.courseId ?? 0) * 23, [structure?.courseId]);
  const rating = "4.7";
  const reviews = `from ${formatNumber(23877)} reviews`;

  const aboutText = useMemo(() => {
    const title = structure?.title || "Course";
    return `Launch your career with ${title}. Build job-ready skills, follow a structured curriculum, and earn a certificate when you finish.`;
  }, [structure?.title]);

  const outcomes = useMemo(() => {
    const base = [
      "Create responsive interfaces using HTML/CSS and modern UI patterns.",
      "Build interactive experiences with JavaScript and component thinking.",
      "Understand React fundamentals and common frontend workflows.",
      "Prepare for interviews by practicing problem solving and building projects.",
    ];
    return base;
  }, []);

  const skills = useMemo(() => {
    return [
      "Application Programming Interface (API)",
      "Cascading Style Sheets (CSS)",
      "Debugging",
      "Design Research",
      "Event-Driven Programming",
      "JavaScript",
      "JavaScript Frameworks",
      "Linux Commands",
      "Pseudocode",
    ];
  }, []);

  const coursesUnder = useMemo(() => {
    const t = (structure?.tracks ?? []).slice().sort((a, b) => a.order - b.order);
    return t.map((x) => ({
      id: x.courseTrackId,
      title: x.title,
      required: x.isRequired,
      modules: x.modules?.length ?? 0,
      sections:
        x.modules?.reduce((acc, m) => acc + (m.sections?.length ?? 0), 0) ?? 0,
      quizzes:
        x.modules?.reduce((acc, m) => acc + (m.quizzes?.length ?? 0), 0) ?? 0,
    }));
  }, [structure]);

  if (loading) {
    return (
      <div className="container py-20 text-center" style={{ marginTop: "60px" }}>
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-20" style={{ marginTop: "60px" }}>
        <div className="rounded-2xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-300">
          {error}
        </div>
        <Link
          href="/courses"
          className="mt-6 inline-flex rounded-xl border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-black shadow-sm transition hover:bg-black/5 dark:border-white/10 dark:bg-dark dark:text-white dark:hover:bg-white/5"
        >
          Back to courses
        </Link>
      </div>
    );
  }

  if (!structure) {
    return (
      <div className="container py-20" style={{ marginTop: "60px" }}>
        <div className="rounded-2xl border border-black/10 bg-white px-4 py-6 text-center text-sm text-body-color shadow-sm dark:border-white/10 dark:bg-dark dark:text-body-color-dark">
          Course not found.
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden bg-[#f5f8ff] dark:bg-[#050b18]">
      
      {/* إضافة توهج (Glow) خلفي خفيف جداً يتبع ألوان الـ Theme الخاص بك */}
      <div className="absolute left-1/2 top-0 -z-10 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]"></div>

      {/* HERO like Coursera */}
      <div className="container pt-10 md:pt-14" style={{ marginTop: "87px" }}>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          
          {/* النص والأزرار */}
          <div className="lg:col-span-8 opacity-0 animate-[fadeInUp_.6s_ease-out_forwards]">
            <div className="flex items-center gap-3">
              <div className="text-sm font-extrabold uppercase tracking-wider text-black/60 dark:text-white/60">Welcome to</div>
            </div>

            <h1 className="mt-4 text-4xl font-extrabold leading-tight text-black dark:text-white md:text-[52px]">
              {structure.title}
            </h1>

            <p className="mt-5 max-w-3xl text-lg leading-relaxed text-body-color dark:text-body-color-dark">
              {aboutText}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-black/70 dark:text-white/70">
              <Badge>Instructor: Taught by Future Dev Experts</Badge>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-5">
              <Link
                href="#courses"
                className="inline-flex items-center justify-center rounded-xl bg-primary px-8 py-4 text-base font-bold text-white shadow-lg shadow-primary/30 transition duration-300 hover:-translate-y-1 hover:bg-primary/90 active:scale-[0.98]"
              >
                Go To Course
              </Link>

              <div className="text-sm font-medium text-body-color dark:text-body-color-dark">
                <span className="text-lg font-extrabold text-black dark:text-white">{formatNumber(fakeEnrolled)}</span> already enrolled
              </div>
            </div>
          </div>

          {/* الصندوق الجمالي الجانبي (Hero Right Box) مع حركة الطفو */}
          <div className="lg:col-span-4 opacity-0 animate-[fadeInUp_1s_ease-out_forwards] [animation-delay:200ms]">
            <div className="h-full rounded-[2rem] bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.25),transparent_55%),radial-gradient(circle_at_80%_60%,rgba(99,102,241,0.18),transparent_55%)] p-6">
              {/* إضافة animate-[float...] هنا لجعل الصندوق يبدو احترافياً دون تغيير هيكلته */}
              <div className="h-72 w-full animate-[float_6s_ease-in-out_infinite] rounded-[2rem] border border-white/40 bg-white/40 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-white/5 md:h-80 flex items-center justify-center">
                 <div className="text-center opacity-70">
                   <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto mb-3 text-primary">
                     <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                   </svg>
                   <span className="font-bold text-black dark:text-white">Premium Content</span>
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="opacity-0 animate-[fadeInUp_1s_ease-out_forwards] [animation-delay:400ms]">
          <StatRow
            leftTitle={`${counts.tracks} course series`}
            leftDesc={`Earn a career credential that demonstrates your expertise`}
            rating={rating}
            reviews={reviews}
            level="Beginner level"
            schedule="Flexible schedule"
            degree="Build toward a degree"
          />
        </div>
      </div>

      {/* Tabs + Content + Sticky Certificate */}
      <div className="container pb-20 pt-14 md:pt-20">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          
          <div className="lg:col-span-8">
            {/* Tabs (تم تحسينه كـ Glassmorphism Header) */}
            <div className="sticky top-[72px] z-10 -mx-2 mb-8 flex flex-wrap gap-2 rounded-2xl border border-black/5 bg-[#f5f8ff]/80 px-2 py-2 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-[#050b18]/80">
              <TabButton active={tab === "about"} onClick={() => setTab("about")}>
                About
              </TabButton>
              <TabButton active={tab === "outcomes"} onClick={() => setTab("outcomes")}>
                Outcomes
              </TabButton>
              <TabButton active={tab === "courses"} onClick={() => setTab("courses")}>
                Courses
              </TabButton>
              <TabButton active={tab === "testimonials"} onClick={() => setTab("testimonials")}>
                Testimonials
              </TabButton>
            </div>

            {/* About */}
            {tab === "about" && (
              <div className="space-y-8">
                <SectionReveal className="rounded-3xl border border-black/5 bg-white/80 p-8 shadow-lg backdrop-blur-md dark:border-white/10 dark:bg-white/5">
                  <h2 className="text-2xl font-extrabold text-black dark:text-white">What you&apos;ll learn</h2>
                  <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
                    {outcomes.map((x, i) => (
                      <div key={i} className="flex gap-4">
                        <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">✓</div>
                        <div className="text-base leading-relaxed text-body-color dark:text-body-color-dark">{x}</div>
                      </div>
                    ))}
                  </div>
                </SectionReveal>

                <SectionReveal className="rounded-3xl border border-black/5 bg-white/80 p-8 shadow-lg backdrop-blur-md dark:border-white/10 dark:bg-white/5">
                  <h2 className="text-2xl font-extrabold text-black dark:text-white">Skills you&apos;ll gain</h2>
                  <div className="mt-6 flex flex-wrap gap-3">
                    {skills.map((s) => (
                      <span
                        key={s}
                        className="rounded-xl border border-black/5 bg-black/5 px-4 py-2 text-sm font-semibold text-black/80 shadow-sm dark:border-white/10 dark:bg-white/10 dark:text-white/80"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </SectionReveal>

                <SectionReveal className="rounded-3xl border border-black/5 bg-white/80 p-8 shadow-lg backdrop-blur-md dark:border-white/10 dark:bg-white/5">
                  <h2 className="text-2xl font-extrabold text-black dark:text-white">Details to know</h2>
                  <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
                    <div className="flex items-start gap-5">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-black/5 text-primary dark:bg-white/10">
                        <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                      </div>
                      <div>
                        <div className="text-lg font-extrabold text-black dark:text-white">Shareable certificate</div>
                        <div className="mt-1 text-sm text-body-color dark:text-body-color-dark">Add to your LinkedIn profile</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-5">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-black/5 text-primary dark:bg-white/10">
                        <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/></svg>
                      </div>
                      <div>
                        <div className="text-lg font-extrabold text-black dark:text-white">Taught in English</div>
                        <div className="mt-1 text-sm font-semibold text-primary underline decoration-primary/30 hover:decoration-primary">22 languages available</div>
                      </div>
                    </div>
                  </div>
                </SectionReveal>
              </div>
            )}

            {/* Outcomes */}
            {tab === "outcomes" && (
              <div className="space-y-8">
                <SectionReveal className="rounded-3xl border border-black/5 bg-white/80 p-8 shadow-lg backdrop-blur-md dark:border-white/10 dark:bg-white/5">
                  <h2 className="text-2xl font-extrabold text-black dark:text-white">Outcomes</h2>
                  <p className="mt-3 text-base text-body-color dark:text-body-color-dark">
                    Track your progress per section, pass quizzes, and unlock your certificate automatically.
                  </p>

                  <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
                      <div className="text-lg font-extrabold text-black dark:text-white">Progress tracking</div>
                      <div className="mt-2 text-sm text-body-color dark:text-body-color-dark">
                        Completion is saved per section.
                      </div>
                    </div>

                    <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
                      <div className="text-lg font-extrabold text-black dark:text-white">Certificate unlock</div>
                      <div className="mt-2 text-sm text-body-color dark:text-body-color-dark">
                        Finish all sections + pass final quizzes (if enabled).
                      </div>
                    </div>
                  </div>
                </SectionReveal>

                <SectionReveal className="rounded-3xl border border-black/5 bg-white/80 p-8 shadow-lg backdrop-blur-md dark:border-white/10 dark:bg-white/5">
                  <h2 className="text-2xl font-extrabold text-black dark:text-white">Course stats</h2>
                  <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
                    {[
                      { label: "Tracks", val: counts.tracks },
                      { label: "Modules", val: counts.modules },
                      { label: "Sections", val: counts.sections },
                      { label: "Total duration", val: totalDuration },
                    ].map((s, i) => (
                       <div key={i} className="flex flex-col items-center justify-center rounded-2xl border border-black/5 bg-white py-6 shadow-sm dark:border-white/10 dark:bg-white/5">
                         <div className="text-3xl font-extrabold text-primary">{s.val}</div>
                         <div className="mt-2 text-sm font-semibold text-body-color dark:text-body-color-dark">{s.label}</div>
                       </div>
                    ))}
                  </div>
                </SectionReveal>
              </div>
            )}

            {/* Courses */}
            {tab === "courses" && (
              <div id="courses" className="space-y-8">
                <SectionReveal className="rounded-3xl border border-black/5 bg-white/80 p-8 shadow-lg backdrop-blur-md dark:border-white/10 dark:bg-white/5">
                  <h2 className="text-2xl font-extrabold text-black dark:text-white">Courses</h2>
                  <p className="mt-3 text-base text-body-color dark:text-body-color-dark">
                    This is your curriculum structure (Tracks → Modules → Sections & Quizzes).
                  </p>

                  <div className="mt-8 space-y-5">
                    {coursesUnder.map((c, idx) => (
                      <div
                        key={c.id}
                        className="group rounded-2xl border border-black/10 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-white/10 dark:bg-dark"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-4">
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <Badge>Course {idx + 1}</Badge>
                              {c.required ? <Badge>Required</Badge> : <Badge>Optional</Badge>}
                            </div>
                            <div className="mt-3 text-xl font-extrabold text-black transition-colors group-hover:text-primary dark:text-white">
                              {c.title}
                            </div>
                            <div className="mt-2 text-sm font-medium text-body-color dark:text-body-color-dark">
                              {c.modules} modules • {c.sections} lessons • {c.quizzes} quizzes
                            </div>
                          </div>

                          <button
                            onClick={() => {
                              const el = document.getElementById(`track-${c.id}`);
                              el?.scrollIntoView({ behavior: "smooth", block: "start" });
                            }}
                            className="rounded-xl border border-black/10 bg-black/5 px-6 py-3 text-sm font-bold text-black transition hover:bg-black/10 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
                            type="button"
                          >
                            View →
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </SectionReveal>

                <SectionReveal className="rounded-3xl border border-black/5 bg-white/80 p-8 shadow-lg backdrop-blur-md dark:border-white/10 dark:bg-white/5">
                  <h3 className="text-2xl font-extrabold text-black dark:text-white">Full curriculum</h3>

                  <div className="mt-8 space-y-8">
                    {(structure.tracks ?? [])
                      .slice()
                      .sort((a, b) => a.order - b.order)
                      .map((t) => (
                        <div
                          key={t.courseTrackId}
                          id={`track-${t.courseTrackId}`}
                          className="rounded-3xl border border-black/10 bg-white/50 p-6 shadow-sm dark:border-white/10 dark:bg-[#0a101d]"
                        >
                          <div className="mb-6 border-b border-black/10 pb-5 dark:border-white/10">
                            <div className="flex flex-wrap items-center gap-2">
                              <Badge>Course series {t.order}</Badge>
                              {t.isRequired ? <Badge>Required</Badge> : <Badge>Optional</Badge>}
                            </div>
                            <div className="mt-3 text-xl font-extrabold text-black dark:text-white">
                              {t.title}
                            </div>
                            <div className="mt-1 text-sm text-body-color dark:text-body-color-dark">
                              {t.modules?.length ?? 0} modules
                            </div>
                          </div>

                          <div className="space-y-5">
                            {(t.modules ?? [])
                              .slice()
                              .sort((a, b) => a.order - b.order)
                              .map((m) => (
                                <div
                                  key={m.courseModuleId}
                                  className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-dark"
                                >
                                  <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
                                    <div className="text-lg font-extrabold text-black dark:text-white">
                                      Module {m.order}: {m.title}
                                    </div>
                                    <div className="text-xs font-semibold text-body-color dark:text-body-color-dark">
                                      {(m.sections?.length ?? 0)} lessons • {(m.quizzes?.length ?? 0)} quizzes
                                    </div>
                                  </div>

                                  <div className="space-y-3">
                                    {(m.sections ?? [])
                                      .slice()
                                      .sort((a, b) => a.order - b.order)
                                      .map((s) => (
                                        <div
                                          key={s.courseSectionId}
                                          className="flex items-start justify-between gap-3 rounded-xl border border-black/5 bg-black/5 px-4 py-3 text-sm dark:border-white/5 dark:bg-white/5"
                                        >
                                          <div className="min-w-0">
                                            <div className="truncate font-bold text-black dark:text-white">
                                              {s.order}. {s.title}
                                            </div>
                                            <div className="mt-1 text-xs font-medium text-body-color dark:text-body-color-dark">
                                              {s.isPreview ? "Preview" : "Lesson"}
                                            </div>
                                          </div>
                                          <div className="shrink-0 text-xs font-semibold text-body-color dark:text-body-color-dark">
                                            {formatDuration(s.durationSeconds)}
                                          </div>
                                        </div>
                                      ))}

                                    {(m.quizzes ?? [])
                                      .slice()
                                      .sort((a, b) => a.order - b.order)
                                      .map((q) => (
                                        <div
                                          key={q.moduleQuizId}
                                          className="flex items-start justify-between gap-3 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm dark:border-primary/30 dark:bg-primary/10"
                                        >
                                          <div className="min-w-0">
                                            <div className="truncate font-bold text-primary">
                                              Quiz {q.order}. {q.title}
                                            </div>
                                            <div className="mt-1 text-xs font-medium text-primary/80">
                                              Pass {q.passingScore}% • {q.maxAttempts} attempts
                                              {q.isFinalInModule ? " • Final" : ""}
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      ))}
                  </div>
                </SectionReveal>
              </div>
            )}

            {/* Testimonials */}
            {tab === "testimonials" && (
              <div className="space-y-8">
                <SectionReveal className="rounded-3xl border border-black/5 bg-white/80 p-8 shadow-lg backdrop-blur-md dark:border-white/10 dark:bg-white/5">
                  <h2 className="text-2xl font-extrabold text-black dark:text-white">Testimonials</h2>
                  <p className="mt-3 text-base text-body-color dark:text-body-color-dark">
                    Add real student feedback later. For now, here are placeholders with the same style.
                  </p>

                  <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
                    {[
                      { name: "Ahmad", text: "Very structured and easy to follow. Loved the projects." },
                      { name: "Sara", text: "The quizzes helped me actually remember the content." },
                      { name: "Omar", text: "Feels like Coursera. Clean design + progress makes sense." },
                      { name: "Lina", text: "Certificate feature is a great motivator. Good pace." },
                    ].map((t) => (
                      <div
                        key={t.name}
                        className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-dark"
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white font-bold mb-4 shadow-md">
                          {t.name[0]}
                        </div>
                        <div className="text-base font-extrabold text-black dark:text-white">{t.name}</div>
                        <div className="mt-2 text-sm leading-relaxed text-body-color dark:text-body-color-dark">"{clampText(t.text, 140)}"</div>
                      </div>
                    ))}
                  </div>
                </SectionReveal>
              </div>
            )}
          </div>

          {/* Sticky Certificate Card */}
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-[92px]">
              <SectionReveal className="overflow-hidden rounded-3xl border border-black/10 bg-white/80 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-[#0B1220]/80">
                <div className="h-2 bg-primary"></div>
                <div className="p-7">
                  <div className="text-lg font-extrabold text-black dark:text-white">Shareable certificate</div>
                  <div className="mt-2 text-sm text-body-color dark:text-body-color-dark">
                    Finish the course to unlock your certificate automatically.
                  </div>

                  <div className="mt-8 space-y-4">
                    <div className="flex items-center gap-4 rounded-2xl border border-black/5 bg-black/5 p-4 dark:border-white/5 dark:bg-white/5">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-primary shadow-sm dark:bg-dark">✓</div>
                      <div>
                        <div className="text-sm font-extrabold text-black dark:text-white">Certificate</div>
                        <div className="mt-1 text-xs text-body-color dark:text-body-color-dark">
                          Included upon completion.
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 rounded-2xl border border-black/5 bg-black/5 p-4 dark:border-white/5 dark:bg-white/5">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-primary shadow-sm dark:bg-dark">⏱</div>
                      <div>
                        <div className="text-sm font-extrabold text-black dark:text-white">{totalDuration}</div>
                        <div className="mt-1 text-xs text-body-color dark:text-body-color-dark">Flexible schedule</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 space-y-3">
                    <button
                      onClick={() => document.getElementById("courses")?.scrollIntoView({ behavior: "smooth" })}
                      className="w-full rounded-xl bg-primary px-5 py-4 text-sm font-extrabold text-white shadow-lg shadow-primary/30 transition duration-300 hover:-translate-y-1 hover:bg-primary/90 active:scale-[0.98]"
                      type="button"
                    >
                      Go To Course
                    </button>

                    <Link
                      href="/courses"
                      className="block w-full rounded-xl border border-black/10 bg-white px-5 py-4 text-center text-sm font-extrabold text-black shadow-sm transition hover:bg-black/5 dark:border-white/10 dark:bg-transparent dark:text-white dark:hover:bg-white/5"
                    >
                      Back
                    </Link>
                  </div>
                </div>
              </SectionReveal>
            </div>
          </div>
          
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
          100% {
            transform: translateY(0px);
          }
        }
      `}</style>
    </div>
  );
}