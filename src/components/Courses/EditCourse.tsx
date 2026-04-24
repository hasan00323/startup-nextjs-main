"use client";

import { useParams, useRouter } from "next/navigation";
import { useEditCourse } from "@/hooks/useCourses";
import { COURSE_CATEGORIES } from "@/services/courseService";

export default function EditCoursePage() {
  const params = useParams();
  const id = (params?.id as string) || "";
  const router = useRouter();
  const { form, pageLoading, saving, error, updateField, submit } = useEditCourse(id);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const saved = await submit();

    if (saved) {
      alert("Course updated successfully");
      router.push(`/courses/details/${id}`);
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
              onChange={(e) => updateField("title", e.target.value)}
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
              onChange={(e) => updateField("description", e.target.value)}
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
              onChange={(e) => updateField("price", e.target.value)}
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
                onChange={(e) => updateField("startDate", e.target.value)}
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
                onChange={(e) => updateField("endDate", e.target.value)}
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
              onChange={(e) => updateField("categoryId", e.target.value)}
              required
              className="
                w-full bg-transparent text-sm text-black outline-none
                dark:text-white
              "
            >
              <option value="0" disabled>
                Select category...
              </option>
              {COURSE_CATEGORIES.map((c) => (
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
