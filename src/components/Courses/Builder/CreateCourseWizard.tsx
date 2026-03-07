"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import GlassCard from "./shared/GlassCard";
import Field from "./shared/Field";
import MiniButton from "./shared/MiniButton";
import { apiFetch } from "@/lib/api";
import type { CategoryItem } from "./../types";

const toLocalInputValue = (iso: string) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
};

export default function CreateCourseWizard() {
  const router = useRouter();

  const token = useMemo(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
  }, []);

  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loadingCats, setLoadingCats] = useState(true);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [categoryId, setCategoryId] = useState<number>(1);
  const [isPro, setIsPro] = useState<boolean>(false);
  const [parentCourseId, setParentCourseId] = useState<number | null>(null);

  const [startDate, setStartDate] = useState<string>(toLocalInputValue(new Date().toISOString()));
  const [endDate, setEndDate] = useState<string>("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      setLoadingCats(true);
      try {
        const res = await apiFetch(
          "https://localhost:7145/api/courses/GetAllCategories",
          { method: "GET" },
          router
        );
        const data: CategoryItem[] = res.ok ? await res.json() : [];
        setCategories(Array.isArray(data) ? data : []);
      } finally {
        setLoadingCats(false);
      }
    };
    run();
  }, [router]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!token) {
      router.push("/signin");
      return;
    }

    const s = new Date(startDate);
    const en = new Date(endDate);
    if (Number.isNaN(s.getTime()) || Number.isNaN(en.getTime())) {
      setError("Please select valid start/end dates.");
      return;
    }
    if (s >= en) {
      setError("End date must be after start date.");
      return;
    }

    setLoading(true);
    try {
      const body = {
        title,
        description,
        price,
        startDate: s.toISOString(),
        endDate: en.toISOString(),
        categoryId,
        isPro,
        parentCourseId: parentCourseId ?? null,
      };

      const res = await apiFetch(
        "https://localhost:7145/api/courses/CreateCourse",
        { method: "POST", body: JSON.stringify(body) },
        router
      );

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(txt || `Request failed (${res.status})`);
      }

      router.push("/admin/courses/builder-pick");
    } catch (err: any) {
      setError(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative z-10 overflow-hidden pt-28 pb-16 md:pt-36 lg:pt-[170px] lg:pb-24">
      <div className="container">
        <div className="-mx-4 flex flex-wrap justify-center">
          <div className="w-full px-4">
            <div style={{ marginTop: "-40px" }} className="mx-auto w-full max-w-[720px]">
              <GlassCard
                title="Course Builder"
                subtitle="Step 1: Create the main course, then you’ll build Tracks → Modules → Sections/Quizzes."
              >
                {error && (
                  <div className="mb-5 rounded-2xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-300">
                    {error}
                  </div>
                )}

                <form onSubmit={submit} className="space-y-5">
                  <Field label="Course Title">
                    <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-xl transition focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/20 dark:border-white/10 dark:bg-white/5">
                      <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        placeholder="e.g. React Zero to Pro"
                        className="w-full bg-transparent text-sm text-black outline-none placeholder:text-black/50 dark:text-white dark:placeholder:text-white/40"
                      />
                    </div>
                  </Field>

                  <Field label="Description">
                    <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-xl transition focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/20 dark:border-white/10 dark:bg-white/5">
                      <textarea
                        rows={4}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        placeholder="Short description..."
                        className="w-full resize-none bg-transparent text-sm text-black outline-none placeholder:text-black/50 dark:text-white dark:placeholder:text-white/40"
                      />
                    </div>
                  </Field>

                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <Field label="Price" hint="0 = Free">
                      <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-xl transition focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/20 dark:border-white/10 dark:bg-white/5">
                        <input
                          type="number"
                          min={0}
                          step="0.01"
                          value={price}
                          onChange={(e) => setPrice(Number(e.target.value))}
                          className="w-full bg-transparent text-sm text-black outline-none dark:text-white"
                        />
                      </div>
                    </Field>

                    <Field label="Category">
                      <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-xl transition focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/20 dark:border-white/10 dark:bg-white/5">
                        <select
                          value={categoryId}
                          onChange={(e) => setCategoryId(Number(e.target.value))}
                          className="w-full bg-transparent text-sm text-black outline-none dark:text-white"
                        >
                          {loadingCats ? (
                            <option>Loading...</option>
                          ) : categories.length === 0 ? (
                            <option value={1}>CategoryId = 1</option>
                          ) : (
                            categories.map((c, idx) => (
                              <option key={`${c.categoryName}-${idx}`} value={idx + 1}>
                                {c.categoryName}
                              </option>
                            ))
                          )}
                        </select>
                      </div>
                    </Field>
                  </div>

                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <Field label="Start Date">
                      <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-xl transition focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/20 dark:border-white/10 dark:bg-white/5">
                        <input
                          type="datetime-local"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="w-full bg-transparent text-sm text-black outline-none dark:text-white"
                        />
                      </div>
                    </Field>

                    <Field label="End Date">
                      <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-xl transition focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/20 dark:border-white/10 dark:bg-white/5">
                        <input
                          type="datetime-local"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          required
                          className="w-full bg-transparent text-sm text-black outline-none dark:text-white"
                        />
                      </div>
                    </Field>
                  </div>

                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <Field label="Is Pro?">
                      <div className="flex items-center justify-between rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
                        <span className="text-sm text-black dark:text-white">
                          {isPro ? "Pro Course" : "Normal Course"}
                        </span>
                        <button
                          type="button"
                          onClick={() => setIsPro((v) => !v)}
                          className="rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-xs font-semibold text-black backdrop-blur-xl transition hover:bg-white/15 dark:border-white/10 dark:bg-white/5 dark:text-white"
                        >
                          Toggle
                        </button>
                      </div>
                    </Field>

                    <Field label="ParentCourseId (optional)">
                      <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-xl transition focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/20 dark:border-white/10 dark:bg-white/5">
                        <input
                          type="number"
                          min={1}
                          value={parentCourseId ?? ""}
                          onChange={(e) =>
                            setParentCourseId(
                              e.target.value.trim() === "" ? null : Number(e.target.value)
                            )
                          }
                          placeholder="Leave empty if main course"
                          className="w-full bg-transparent text-sm text-black outline-none placeholder:text-black/50 dark:text-white dark:placeholder:text-white/40"
                        />
                      </div>
                    </Field>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <div className="w-full sm:w-1/2">
                      <div className="w-full sm:w-1/2">
                        <MiniButton
                          type="button"
                          disabled={loading}
                          onClick={async () => {
                            try {
                              setLoading(true);

                              const token = localStorage.getItem("token") || localStorage.getItem("Token") || "";

                              // ✅ اعمل normalize للـ ParentCourseId
                              // إذا ما في أب: null
                              const p = Number(parentCourseId);
                              const normalizedParent =
                                !parentCourseId || Number.isNaN(p) || p <= 0 ? null : p;

                              // ✅ DTO: من الفورم مش ثابت
                              const dto: any = {
                                title: (title || "").trim(),
                                description: (description || "").trim(),
                                price: Number(price || 0),
                                startDate: new Date(startDate).toISOString(),
                                endDate: new Date(endDate).toISOString(),
                                categoryId: Number(categoryId),
                                isPro: Boolean(isPro),
                                parentCourseId: normalizedParent,
                              };

                              // ✅ إذا الباك عندك ParentCourseId int (مش nullable) وبدك “بدون أب”
                              // الأفضل تعدله بالباك لـ int?، لكن إذا لسا ما عدلت:
                              // امسح الحقل بالكامل بدل ما تبعث null
                              if (dto.parentCourseId === null) delete dto.parentCourseId;

                              const res = await fetch("https://localhost:7145/api/courses/CreateCourse", {
                                method: "POST",
                                headers: {
                                  "Content-Type": "application/json",
                                  ...(token ? { Authorization: `Bearer ${token}` } : {}),
                                },
                                body: JSON.stringify(dto),
                              });

                              if (!res.ok) throw new Error(await res.text());

                              // ✅ لازم ترجع ID من API عشان نروح للـ builder
                              const data = await res.json().catch(() => null);
                              const courseId =
                                typeof data === "number"
                                  ? data
                                  : data?.courseId ?? data?.CourseId ?? data?.id;

                              if (!courseId) {
                                alert("Created, but API didn't return courseId. Make CreateCourse return the id.");
                                return;
                              }

                              router.push(`/admin/courses/builder/edit/${courseId}`);
                            } catch (e: any) {
                              alert(e?.message || "Create failed");
                            } finally {
                              setLoading(false);
                            }
                          }}
                        >
                          {loading ? "Creating..." : "Create Course → Builder"}
                        </MiniButton>
                      </div>
                    </div>

                    <div className="w-full sm:w-1/2">
                      <MiniButton
                        type="button"
                        variant="ghost"
                        disabled={loading}
                        onClick={() => router.push("/admin/courses/builder-pick")}
                      >
                        Link courses together (Parent/Child) →
                      </MiniButton>
                    </div>
                  </div>

                  <p className="pt-1 text-center text-xs text-white/50">
                    After creating, you’ll choose the course to continue building the structure.
                  </p>
                </form>
              </GlassCard>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}