"use client";

import React, { useEffect, useMemo, useState } from "react";
import { apiFetch, parseApiError } from "@/lib/api";

const API = "/courses";

// ==========================================
// Helpers
// ==========================================
function cn(...xs: Array<string | false | undefined | null>) {
  return xs.filter(Boolean).join(" ");
}

async function req<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await apiFetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });

  if (!res.ok) {
    throw await parseApiError(res);
  }

  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) return (await res.json()) as T;
  return (await res.text()) as unknown as T;
}

function formatDuration(seconds?: number | null) {
  const s = Number(seconds ?? 0);
  if (!s || s <= 0) return "-";
  const mins = Math.floor(s / 60);
  const rem = s % 60;
  if (mins <= 0) return `${rem}s`;
  return rem ? `${mins}m ${rem}s` : `${mins}m`;
}

// ==========================================
// Types
// ==========================================
type SectionDto = { courseSectionId: number; title: string; contentType: number; contentUrl?: string | null; durationSeconds?: number | null; order: number; isPreview?: boolean; };
type ModuleQuizDto = { moduleQuizId: number; title: string; description?: string | null; passingScore: number; maxAttempts: number; isFinalInModule: boolean; order: number; };
type ModuleDto = { courseModuleId: number; title: string; description?: string | null; order: number; sections: SectionDto[]; quizzes: ModuleQuizDto[]; };
type TrackDto = { courseTrackId: number; title: string; description?: string | null; order: number; isRequired: boolean; modules: ModuleDto[]; };
type CourseStructureDto = { courseId: number; title: string; tracks: TrackDto[]; };
type CourseResponseDto = { courseId: number; title: string; description: string; price: number; startDate: string; endDate: string; categoryName?: string | null; };

type ModalState =
  | null
  | { kind: "course" }
  | { kind: "track-create" } | { kind: "track-edit"; track: TrackDto }
  | { kind: "module-create"; trackId: number } | { kind: "module-edit"; module: ModuleDto }
  | { kind: "section-create"; moduleId: number } | { kind: "section-edit"; section: SectionDto }
  | { kind: "quiz-create"; moduleId: number } | { kind: "quiz-edit"; quiz: ModuleQuizDto };

// ==========================================
// Main Component
// ==========================================
export default function CourseBuilderEditor({ courseId }: { courseId: number }) {
  const [loading, setLoading] = useState(true);
  const [structure, setStructure] = useState<CourseStructureDto | null>(null);
  const [course, setCourse] = useState<CourseResponseDto | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [modal, setModal] = useState<ModalState>(null);

  async function refresh() {
    setLoading(true); setError(null);
    try {
      const [st, c] = await Promise.all([
        req<CourseStructureDto>(`${API}/GetCourseStructure/${courseId}`, { method: "GET" }),
        req<CourseResponseDto>(`${API}/GetCourse/${courseId}`, { method: "GET" }),
      ]);
      setStructure(st); setCourse(c);
    } catch (e: any) {
      setError(e?.message || "Failed to load course.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!courseId || Number.isNaN(courseId)) { setError("Invalid course id"); setLoading(false); return; }
    refresh();
  }, [courseId]);

  const counts = useMemo(() => {
    const tracks = structure?.tracks?.length ?? 0;
    const modules = structure?.tracks?.reduce((a, t) => a + (t.modules?.length ?? 0), 0) ?? 0;
    const sections = structure?.tracks?.reduce((a, t) => a + (t.modules?.reduce((b, m) => b + (m.sections?.length ?? 0), 0) ?? 0), 0) ?? 0;
    const quizzes = structure?.tracks?.reduce((a, t) => a + (t.modules?.reduce((b, m) => b + (m.quizzes?.length ?? 0), 0) ?? 0), 0) ?? 0;
    return { tracks, modules, sections, quizzes };
  }, [structure]);

  if (loading) return <Shell><LoadingState text="Loading Builder..." /></Shell>;
  if (error) return <Shell><div className="py-20 text-center text-red-400 text-xl font-bold">{error}</div></Shell>;
  if (!structure) return <Shell><div className="py-20 text-center text-slate-400 text-xl font-bold">Course not found.</div></Shell>;

  return (
    <Shell>
      <div className="mx-auto w-full max-w-6xl opacity-0 animate-[fadeInUp_0.5s_ease-out_forwards]">
        
        {/* HEADER */}
        <div className="mb-8 rounded-2xl border border-slate-700 bg-slate-800 p-8 shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="mb-3 flex items-center gap-3">
              <span className="rounded-lg bg-blue-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-400 border border-blue-500/20">Course Builder</span>
              <span className="text-xs text-slate-400 font-mono bg-slate-900 px-2 py-1 rounded-md border border-slate-700">ID: {courseId}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100">{structure.title}</h1>
            <div className="mt-4 flex gap-6 text-sm text-slate-400 font-medium">
              <span><b className="text-slate-100">{counts.tracks}</b> Tracks</span>
              <span><b className="text-slate-100">{counts.modules}</b> Modules</span>
              <span><b className="text-slate-100">{counts.sections}</b> Sections</span>
              <span><b className="text-slate-100">{counts.quizzes}</b> Quizzes</span>
            </div>
          </div>

          <div className="flex w-full sm:w-auto gap-3">
            <Btn tone="danger" onClick={async () => { if(confirm("Delete entire course?")) { await req(`${API}/DeleteCourse/${courseId}`, { method: "DELETE" }); window.location.href = "/courses"; } }}>
              Delete Course
            </Btn>
            <Btn onClick={() => setModal({ kind: "course" })}>Edit Info</Btn>
            <Btn tone="primary" onClick={() => setModal({ kind: "track-create" })}>+ Add Track</Btn>
          </div>
        </div>

        {/* TRACKS LIST */}
        <div className="space-y-8">
          {(structure.tracks ?? []).slice().sort((a, b) => a.order - b.order).map((t) => (
            <div key={t.courseTrackId} className="rounded-2xl border border-slate-700 bg-slate-800 overflow-hidden shadow-md">
              
              {/* Track Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-slate-800/80 p-6 border-b border-slate-700 gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Track {t.order}</span>
                    {t.isRequired ? (
                      <span className="rounded bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase text-emerald-400 border border-emerald-500/20">Required</span>
                    ) : (
                      <span className="rounded bg-slate-700 px-2.5 py-0.5 text-[10px] font-bold uppercase text-slate-300 border border-slate-600">Optional</span>
                    )}
                  </div>
                  <h2 className="text-2xl font-bold text-slate-100">{t.title}</h2>
                  {t.description && <p className="text-sm text-slate-400 mt-1.5">{t.description}</p>}
                </div>
                <div className="flex gap-2 bg-slate-900 p-1.5 rounded-xl border border-slate-700">
                  <BtnAction onClick={() => setModal({ kind: "module-create", trackId: t.courseTrackId })}>+ Add Module</BtnAction>
                  <BtnAction onClick={() => setModal({ kind: "track-edit", track: t })}>Edit</BtnAction>
                  <BtnAction isDanger onClick={async () => { if(confirm("Delete track?")) { await req(`${API}/DeleteTrack/${t.courseTrackId}`, { method: "DELETE" }); refresh(); } }}>Delete</BtnAction>
                </div>
              </div>

              {/* Modules List */}
              <div className="p-6 bg-slate-900/50 space-y-6">
                {(t.modules ?? []).slice().sort((a, b) => a.order - b.order).map((m) => {
                  
                  // تجهيز البيانات للجدول
                  const moduleItems = [
                    ...(m.sections?.map(s => ({ ...s, _type: 'section' as const })) || []),
                    ...(m.quizzes?.map(q => ({ ...q, _type: 'quiz' as const })) || [])
                  ].sort((a, b) => a.order - b.order);

                  return (
                    <div key={m.courseModuleId} className="rounded-xl border border-slate-700 bg-slate-800 overflow-hidden shadow-sm">
                      
                      {/* Module Header */}
                      <div className="flex justify-between items-center bg-slate-700/30 px-5 py-4 border-b border-slate-700">
                        <div>
                          <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Module {m.order}</span>
                          <h3 className="text-lg font-bold text-slate-100 mt-0.5">{m.title}</h3>
                        </div>
                        <div className="flex gap-2">
                          <BtnAction onClick={() => setModal({ kind: "section-create", moduleId: m.courseModuleId })}>+ Section</BtnAction>
                          <BtnAction onClick={() => setModal({ kind: "quiz-create", moduleId: m.courseModuleId })}>+ Quiz</BtnAction>
                          <BtnAction onClick={() => setModal({ kind: "module-edit", module: m })}>Edit</BtnAction>
                          <BtnAction isDanger onClick={async () => { if(confirm("Delete module?")) { await req(`${API}/DeleteModule/${m.courseModuleId}`, { method: "DELETE" }); refresh(); } }}>Delete</BtnAction>
                        </div>
                      </div>

                      {/* Unified Modern Tailwind Table */}
                      {moduleItems.length > 0 ? (
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-sm border-collapse">
                            <thead className="bg-slate-900/80 text-xs uppercase text-slate-400 border-b border-slate-700">
                              <tr>
                                <th className="px-6 py-4 font-semibold tracking-wider w-2/5">Title</th>
                                <th className="px-6 py-4 font-semibold tracking-wider">Type</th>
                                <th className="px-6 py-4 font-semibold tracking-wider">Details</th>
                                <th className="px-6 py-4 font-semibold tracking-wider text-right">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700/50">
                              {moduleItems.map((item: any, idx) => (
                                <tr key={idx} className="hover:bg-slate-700/30 transition-colors group">
                                  <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                      <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg border", item._type === 'section' ? "bg-slate-700 border-slate-600 text-slate-300" : "bg-blue-900/30 border-blue-800 text-blue-400")}>
                                        {item._type === 'section' ? <Icons.Video /> : <Icons.Quiz />}
                                      </div>
                                      <span className="font-semibold text-slate-200">{item.order}. {item.title}</span>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 text-slate-400 font-medium">
                                    {item._type === 'section' ? 'Video / Text' : 'Assessment'}
                                  </td>
                                  <td className="px-6 py-4 text-slate-400">
                                    {item._type === 'section' ? (
                                      <div className="flex items-center gap-2">
                                        <span className="bg-slate-900 px-2 py-1 rounded-md text-xs border border-slate-700">{formatDuration(item.durationSeconds)}</span>
                                        <span className={cn("text-xs font-semibold", item.isPreview ? "text-emerald-400" : "text-slate-500")}>{item.isPreview ? 'Preview' : 'Locked'}</span>
                                      </div>
                                    ) : (
                                      <div className="flex items-center gap-2">
                                        <span className="bg-slate-900 px-2 py-1 rounded-md text-xs border border-slate-700">Pass: {item.passingScore}%</span>
                                        <span className="text-xs text-slate-500">{item.maxAttempts} Tries</span>
                                      </div>
                                    )}
                                  </td>
                                  <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <BtnAction onClick={() => item._type === 'section' ? setModal({ kind: "section-edit", section: item }) : setModal({ kind: "quiz-edit", quiz: item })}>Edit</BtnAction>
                                      <BtnAction isDanger onClick={async () => {
                                        if(!confirm(`Delete this ${item._type}?`)) return;
                                        try {
                                          if (item._type === 'section') await req(`${API}/DeleteSection/${item.courseSectionId}`, { method: "DELETE" });
                                          else await req(`${API}/DeleteModuleQuiz/${item.moduleQuizId}`, { method: "DELETE" });
                                          refresh();
                                        } catch(e:any) { alert("Delete failed"); }
                                      }}>Delete</BtnAction>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="p-8 text-center text-sm font-medium text-slate-500 bg-slate-900/30">
                          This module is empty. Add a section or quiz to get started.
                        </div>
                      )}
                    </div>
                  );
                })}
                {t.modules?.length === 0 && <div className="text-sm font-medium text-slate-500 text-center py-4">No modules created in this track yet.</div>}
              </div>
            </div>
          ))}

          {structure.tracks.length === 0 && (
             <div className="rounded-2xl border border-slate-700 border-dashed py-24 text-center bg-slate-800/50">
               <h3 className="text-xl font-bold text-slate-200 mb-2">Ready to build your course?</h3>
               <p className="text-slate-400 mb-6">Start structuring your course by creating the very first track.</p>
               <Btn tone="primary" onClick={() => setModal({ kind: "track-create" })}>+ Add First Track</Btn>
             </div>
          )}
        </div>

        <CourseModals modal={modal} onClose={() => setModal(null)} courseId={courseId} course={course} onSaved={async () => { setModal(null); await refresh(); }} />
      </div>
    </Shell>
  );
}

// ==========================================
// UI Components
// ==========================================
function Shell({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* NO BLACK ALLOWED.
        Using slate-900 (deep blue-gray) for the main background.
      */}
      <section className="relative min-h-screen bg-slate-900 pt-28 pb-24 selection:bg-blue-500/30 selection:text-white">
        <div className="container relative z-10 px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </section>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeInUp { 0% { opacity: 0; transform: translateY(15px); } 100% { opacity: 1; transform: translateY(0); } }
      `}} />
    </>
  );
}

function LoadingState({ text }: { text: string }) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-6">
      <div className="h-10 w-10 rounded-full border-4 border-slate-700 border-t-blue-500 animate-spin"></div>
      <p className="text-xs font-bold tracking-widest text-slate-400 uppercase animate-pulse">{text}</p>
    </div>
  );
}

// ==========================================
// Universal Form Modal
// ==========================================
function CourseModals({ modal, onClose, courseId, course, onSaved }: { modal: ModalState; onClose: () => void; courseId: number; course: CourseResponseDto | null; onSaved: () => Promise<void>; }) {
  const [form, setForm] = useState<any>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!modal) return;
    
    if (modal.kind === "course") {
      setForm({
        title: course?.title ?? "", description: course?.description ?? "", price: course?.price ?? 0,
        startDate: (course?.startDate ?? "").slice(0, 16), endDate: (course?.endDate ?? "").slice(0, 16),
        categoryId: 1, parentCourseId: "", isPro: false
      });
    } else if (modal.kind === "track-create") {
      setForm({ title: "", description: "", order: 1, isRequired: true });
    } else if (modal.kind === "track-edit") {
      setForm({ title: modal.track.title, description: modal.track.description ?? "", order: modal.track.order, isRequired: modal.track.isRequired });
    } else if (modal.kind === "module-create") {
      setForm({ title: "", description: "", order: 1 });
    } else if (modal.kind === "module-edit") {
      setForm({ title: modal.module.title, description: modal.module.description ?? "", order: modal.module.order });
    } else if (modal.kind === "section-create") {
      setForm({ title: "", order: 1, contentType: 2, durationSeconds: 0, contentUrl: "", isPreview: false });
    } else if (modal.kind === "section-edit") {
      setForm({ title: modal.section.title, order: modal.section.order, contentType: modal.section.contentType, durationSeconds: modal.section.durationSeconds ?? 0, contentUrl: modal.section.contentUrl ?? "", isPreview: !!modal.section.isPreview });
    } else if (modal.kind === "quiz-create") {
      setForm({ title: "", description: "", order: 1, passingScore: 70, maxAttempts: 3, isFinalInModule: false });
    } else if (modal.kind === "quiz-edit") {
      setForm({ title: modal.quiz.title, description: modal.quiz.description ?? "", order: modal.quiz.order, passingScore: modal.quiz.passingScore, maxAttempts: modal.quiz.maxAttempts, isFinalInModule: !!modal.quiz.isFinalInModule });
    }
  }, [modal, course]);

  const handleChange = (key: string, val: any) => setForm((prev: any) => ({ ...prev, [key]: val }));

  if (!modal) return null;

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (modal.kind === "course") {
        await req(`${API}/UpdateCourse/${courseId}`, { method: "PUT", body: JSON.stringify({ ...form, price: Number(form.price), categoryId: Number(form.categoryId), parentCourseId: Number(form.parentCourseId) || null }) });
      } else if (modal.kind === "track-create") {
        await req(`${API}/CreateTrack`, { method: "POST", body: JSON.stringify({ ...form, courseId, order: Number(form.order) }) });
      } else if (modal.kind === "track-edit") {
        await req(`${API}/UpdateTrack/${modal.track.courseTrackId}`, { method: "PUT", body: JSON.stringify({ ...form, order: Number(form.order) }) });
      } else if (modal.kind === "module-create") {
        await req(`${API}/CreateModule`, { method: "POST", body: JSON.stringify({ ...form, courseTrackId: modal.trackId, order: Number(form.order) }) });
      } else if (modal.kind === "module-edit") {
        await req(`${API}/UpdateModule/${modal.module.courseModuleId}`, { method: "PUT", body: JSON.stringify({ ...form, order: Number(form.order) }) });
      } else if (modal.kind === "section-create") {
        await req(`${API}/CreateSection`, { method: "POST", body: JSON.stringify({ ...form, courseModuleId: modal.moduleId, contentType: Number(form.contentType), durationSeconds: Number(form.durationSeconds), order: Number(form.order) }) });
      } else if (modal.kind === "section-edit") {
        await req(`${API}/UpdateSection/${modal.section.courseSectionId}`, { method: "PUT", body: JSON.stringify({ ...form, contentType: Number(form.contentType), durationSeconds: Number(form.durationSeconds), order: Number(form.order) }) });
      } else if (modal.kind === "quiz-create") {
        await req(`${API}/CreateModuleQuiz`, { method: "POST", body: JSON.stringify({ ...form, courseModuleId: modal.moduleId, passingScore: Number(form.passingScore), maxAttempts: Number(form.maxAttempts), order: Number(form.order) }) });
      } else if (modal.kind === "quiz-edit") {
        await req(`${API}/UpdateModuleQuiz/${modal.quiz.moduleQuizId}`, { method: "PUT", body: JSON.stringify({ ...form, passingScore: Number(form.passingScore), maxAttempts: Number(form.maxAttempts), order: Number(form.order) }) });
      }
      await onSaved();
    } catch (e: any) {
      alert(e?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  const isQuiz = modal.kind.includes("quiz");
  const isSection = modal.kind.includes("section");
  const isCourse = modal.kind === "course";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-2xl border border-slate-700 bg-slate-800 p-8 shadow-2xl animate-[fadeInUp_0.2s_ease-out]">
        <h2 className="mb-6 text-2xl font-bold text-slate-100 capitalize tracking-tight">{modal.kind.replace("-", " ")}</h2>
        
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 max-h-[65vh] overflow-y-auto pr-2 custom-scrollbar">
          <Input label="Title" value={form.title} onChange={(v:any) => handleChange("title", v)} />
          {!isCourse && <Input label="Order Number" type="number" value={form.order} onChange={(v:any) => handleChange("order", v)} />}
          
          {isCourse && (
            <>
              <Input label="Price ($)" type="number" value={form.price} onChange={(v:any) => handleChange("price", v)} />
              <Input label="Start Date" type="datetime-local" value={form.startDate} onChange={(v:any) => handleChange("startDate", v)} />
              <Input label="End Date" type="datetime-local" value={form.endDate} onChange={(v:any) => handleChange("endDate", v)} />
              <Toggle label="Is Pro Course" checked={form.isPro} onChange={(v:any) => handleChange("isPro", v)} />
            </>
          )}

          {isSection && (
            <>
              <Input label="Content Type ID" type="number" value={form.contentType} onChange={(v:any) => handleChange("contentType", v)} />
              <Input label="Duration (Seconds)" type="number" value={form.durationSeconds} onChange={(v:any) => handleChange("durationSeconds", v)} />
              <div className="md:col-span-2"><Input label="Content URL" value={form.contentUrl} onChange={(v:any) => handleChange("contentUrl", v)} /></div>
              <div className="md:col-span-2"><Toggle label="Is Preview Available" checked={form.isPreview} onChange={(v:any) => handleChange("isPreview", v)} /></div>
            </>
          )}

          {isQuiz && (
            <>
              <Input label="Passing Score (%)" type="number" value={form.passingScore} onChange={(v:any) => handleChange("passingScore", v)} />
              <Input label="Max Attempts" type="number" value={form.maxAttempts} onChange={(v:any) => handleChange("maxAttempts", v)} />
              <div className="md:col-span-2"><Toggle label="Is Final Module Quiz" checked={form.isFinalInModule} onChange={(v:any) => handleChange("isFinalInModule", v)} /></div>
            </>
          )}

          {form.description !== undefined && (
             <div className="md:col-span-2">
               <TextArea label="Description" value={form.description} onChange={(v:any) => handleChange("description", v)} />
             </div>
          )}

          {form.isRequired !== undefined && (
             <div className="md:col-span-2">
               <Toggle label="Is Track Required" checked={form.isRequired} onChange={(v:any) => handleChange("isRequired", v)} />
             </div>
          )}
        </div>

        <div className="mt-8 flex justify-end gap-3 border-t border-slate-700 pt-6">
          <Btn tone="neutral" onClick={onClose}>Cancel</Btn>
          <Btn tone="primary" onClick={handleSubmit}>{loading ? "Saving..." : "Save Changes"}</Btn>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// UI Mini-Components
// ==========================================
function BtnAction({ children, onClick, isDanger }: { children: React.ReactNode; onClick: () => void; isDanger?: boolean }) {
  return (
    <button onClick={onClick} className={cn("text-xs font-semibold px-3 py-1.5 rounded border transition-colors shadow-sm", isDanger ? "border-red-500/30 text-red-400 bg-red-500/10 hover:bg-red-500/20" : "border-slate-600 text-slate-300 bg-slate-700 hover:bg-slate-600 hover:text-white")}>
      {children}
    </button>
  );
}

function Btn({ children, onClick, tone = "neutral" }: { children: React.ReactNode; onClick: () => void; tone?: "neutral" | "primary" | "danger" }) {
  const cls = tone === "primary" ? "bg-blue-600 text-white hover:bg-blue-500 shadow-md border border-blue-500" : tone === "danger" ? "bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/30" : "bg-slate-700 border border-slate-600 text-slate-200 hover:bg-slate-600 shadow-sm";
  return <button onClick={onClick} className={cn("rounded-lg px-5 py-2 text-sm font-semibold transition-all", cls)}>{children}</button>;
}

function Input({ label, value, onChange, type = "text" }: any) {
  return (
    <label className="block">
      <div className="mb-1.5 text-xs font-semibold text-slate-400">{label}</div>
      <input type={type} value={value ?? ""} onChange={(e) => onChange(e.target.value)} className="w-full rounded-lg border border-slate-600 bg-slate-900 px-4 py-2.5 text-sm text-slate-200 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors shadow-sm" />
    </label>
  );
}

function TextArea({ label, value, onChange }: any) {
  return (
    <label className="block">
      <div className="mb-1.5 text-xs font-semibold text-slate-400">{label}</div>
      <textarea value={value ?? ""} onChange={(e) => onChange(e.target.value)} className="min-h-[100px] w-full rounded-lg border border-slate-600 bg-slate-900 px-4 py-2.5 text-sm text-slate-200 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors custom-scrollbar shadow-sm" />
    </label>
  );
}

function Toggle({ label, checked, onChange }: any) {
  return (
    <button type="button" onClick={() => onChange(!checked)} className={cn("flex w-full items-center justify-between rounded-lg border px-4 py-3 text-sm font-semibold transition-colors shadow-sm", checked ? "border-blue-500/50 bg-blue-500/10 text-blue-100" : "border-slate-600 bg-slate-900 text-slate-400 hover:bg-slate-800")}>
      <span>{label}</span>
      <span className={cn("flex h-6 w-10 items-center rounded-full p-1 transition-colors", checked ? "bg-blue-500" : "bg-slate-600")}>
        <span className={cn("h-4 w-4 rounded-full bg-white transition-transform shadow-sm", checked ? "translate-x-4" : "translate-x-0")} />
      </span>
    </button>
  );
}

const Icons = {
  Video: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>,
  Quiz: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="m9 15 2 2 4-4"/></svg>
};
