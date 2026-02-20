"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

type CourseForm = {
  title: string;
  description: string;
  price: string;
  startDate: string;
  endDate: string;
  categoryId: string;
};

const CATEGORIES: { id: number; name: string }[] = [
  { id: 1, name: "IT" },
  { id: 2, name: "HR" },
  { id: 3, name: "Sales" },
  { id: 4, name: "Marketing" },
];

const toDatetimeLocal = (iso?: string) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
};

const toIso = (dtLocal: string) => {
  if (!dtLocal) return null;
  const d = new Date(dtLocal);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
};

export default function EditCoursePage() {
  const params = useParams();
  const id = (params?.id as string) || "";
  const router = useRouter();

  const token = useMemo(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
  }, []);

  const [form, setForm] = useState<CourseForm | null>(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

 useEffect(() => {
  if (!id) return;

  if (!token) {
    router.push("/signin");
    return;
  }

  setPageLoading(true);
  setError(null);

  apiFetch(
    `https://localhost:7145/api/courses/GetCourse/${id}`,
    {
      method: "GET",
    },
    router
  )
    .then(async (res) => {
      if (!res.ok) {
        const t = await res.text().catch(() => "");
        throw new Error(t || `Failed to load course (${res.status})`);
      }
      return res.json();
    })
    .then((course) => {
      const incomingCategoryId = String(
        course?.categoryId ?? course?.CategoryId ?? "0"
      );

      const isValid = CATEGORIES.some(
        (c) => String(c.id) === incomingCategoryId
      );

      setForm({
        title: course?.title ?? course?.Title ?? "",
        description: course?.description ?? course?.Description ?? "",
        price: String(course?.price ?? course?.Price ?? "0"),
        startDate: toDatetimeLocal(
          course?.startDate ?? course?.StartDate
        ),
        endDate: toDatetimeLocal(
          course?.endDate ?? course?.EndDate
        ),
        categoryId: isValid ? incomingCategoryId : "0",
      });
    })
    .catch((e) => setError(e?.message || "Failed to load course"))
    .finally(() => setPageLoading(false));
}, [id, token, router]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;

    try {
      setSaving(true);
      setError(null);

      const tokenNow = localStorage.getItem("token");
      if (!tokenNow) {
        router.push("/signin");
        return;
      }

      const categoryIdInt = parseInt(form.categoryId, 10);
      if (!categoryIdInt || categoryIdInt <= 0) {
        throw new Error("Please select a category.");
      }

      const payload = {
        Title: form.title,
        Description: form.description,
        Price: Number(form.price) || 0,
        StartDate: toIso(form.startDate),
        EndDate: toIso(form.endDate),
        CategoryId: categoryIdInt,
      };

      console.log("UPDATE PAYLOAD (SENT):", payload);

      const res = await fetch(`https://localhost:7145/api/courses/updateCourse/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenNow}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const t = await res.text().catch(() => "");
        throw new Error(t || `Update failed (${res.status})`);
      }

      alert("Course updated successfully");
      router.push(`/courses/details/${id}`);
    } catch (err: any) {
      setError(err?.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const Shell = ({ children }: { children: React.ReactNode }) => (
    <section
      className="relative z-10 overflow-hidden pt-36 pb-16 md:pb-20 lg:pt-[170px] lg:pb-24"
      style={{ marginTop: "-60px" }}
    >
      <div className="container">
        <div className="-mx-4 flex flex-wrap justify-center">
          <div className="w-full px-4">
            <div
              className="
                mx-auto
                w-full
                max-w-[92%]
                sm:max-w-[520px]
                rounded-2xl
                border border-white/20
                bg-white/10
                p-6
                shadow-three
                backdrop-blur-xl
                ring-1 ring-white/10
                dark:border-white/10
                dark:bg-white/5
                dark:ring-white/10
                sm:p-8
              "
            >
              {children}
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  if (pageLoading) {
    return (
      <Shell>
        <div className="text-center text-body-color dark:text-body-color-dark">Loading...</div>
      </Shell>
    );
  }

  if (!form) {
    return (
      <Shell>
        <div className="text-center text-body-color dark:text-body-color-dark">
          Course not found.
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="mx-auto mb-5 flex h-11 w-11 items-center justify-center rounded-full bg-white/20 text-black dark:bg-white/10 dark:text-white">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 3v18M4 7h16M6 12h12M6 17h8"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            opacity="0.9"
          />
        </svg>
      </div>

      <h1 className="mb-1 text-center text-2xl font-bold text-black dark:text-white">
        Edit Course
      </h1>
      <p className="text-body-color dark:text-body-color-dark mb-7 text-center text-sm font-medium">
        Update course information then save.
      </p>

      {error && (
        <div className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={save} className="space-y-5">
        <div>
          <label className="mb-2 block text-sm font-semibold text-black dark:text-white">
            Course Title
          </label>

          <div className="flex items-center gap-3 rounded-xl border border-white/20 bg-white/10 px-4 py-3 dark:border-white/10 dark:bg-white/5">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="opacity-70">
              <path
                d="M6 7h12M6 12h12M6 17h8"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
              />
            </svg>

            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
              className="
                w-full bg-transparent text-sm text-black outline-none
                placeholder:text-black/50
                dark:text-white dark:placeholder:text-white/40
              "
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-black dark:text-white">
            Description
          </label>

          <div className="rounded-xl border border-white/20 bg-white/10 px-4 py-3 dark:border-white/10 dark:bg-white/5">
            <textarea
              rows={4}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
              className="
                w-full resize-none bg-transparent text-sm text-black outline-none
                placeholder:text-black/50
                dark:text-white dark:placeholder:text-white/40
              "
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-black dark:text-white">
            Price
          </label>

          <div className="flex items-center gap-3 rounded-xl border border-white/20 bg-white/10 px-4 py-3 dark:border-white/10 dark:bg-white/5">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="opacity-70">
              <path
                d="M12 3v18M16 7H10a3 3 0 0 0 0 6h4a3 3 0 0 1 0 6H8"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <input
              type="number"
              min={0}
              step="0.01"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              required
              className="
                w-full bg-transparent text-sm text-black outline-none
                placeholder:text-black/50
                dark:text-white dark:placeholder:text-white/40
              "
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-semibold text-black dark:text-white">
              Start Date
            </label>

            <div className="flex items-center gap-3 rounded-xl border border-white/20 bg-white/10 px-4 py-3 dark:border-white/10 dark:bg-white/5">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="opacity-70">
                <path
                  d="M7 2v3M17 2v3M4 8h16M5 5h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              <input
                type="datetime-local"
                value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                required
                className="
                  w-full bg-transparent text-sm text-black outline-none
                  placeholder:text-black/50
                  dark:text-white dark:placeholder:text-white/40
                "
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-black dark:text-white">
              End Date
            </label>

            <div className="flex items-center gap-3 rounded-xl border border-white/20 bg-white/10 px-4 py-3 dark:border-white/10 dark:bg-white/5">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="opacity-70">
                <path
                  d="M7 2v3M17 2v3M4 8h16M5 5h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              <input
                type="datetime-local"
                value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                required
                className="
                  w-full bg-transparent text-sm text-black outline-none
                  placeholder:text-black/50
                  dark:text-white dark:placeholder:text-white/40
                "
              />
            </div>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-black dark:text-white">
            Category
          </label>

          <div className="flex items-center gap-3 rounded-xl border border-white/20 bg-white/10 px-4 py-3 dark:border-white/10 dark:bg-white/5">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="opacity-70">
              <path
                d="M4 6h16M4 12h10M4 18h16"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
              />
            </svg>

            <select
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
              required
              className="
                w-full bg-transparent text-sm text-black outline-none
                dark:text-white
              "
            >
              <option value="0" disabled>
                Select category...
              </option>
              {CATEGORIES.map((c) => (
                <option key={c.id} value={String(c.id)}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="
            shadow-submit dark:shadow-submit-dark
            bg-primary hover:bg-primary/90
            w-full rounded-xl px-10 py-3.5
            text-sm font-semibold text-white
            transition duration-300
            disabled:opacity-60
          "
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>

        <button
          type="button"
          onClick={() => router.push(`/courses/details/${id}`)}
          className="
            block w-full rounded-xl
            border border-white/20
            bg-white/10
            px-10 py-3.5
            text-center text-sm font-semibold
            text-black transition duration-300
            hover:bg-white/15
            dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10
          "
        >
          Cancel
        </button>

        <p className="text-body-color dark:text-body-color-dark mt-2 text-center text-xs">
          Editing Course ID: {String(id)} | CategoryId: {form.categoryId}
        </p>
      </form>
    </Shell>
  );
}
