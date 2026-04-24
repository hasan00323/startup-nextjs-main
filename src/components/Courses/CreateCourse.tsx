"use client";

import { useCreateCourse } from "@/hooks/useCourses";

const CreateCoursePage = () => {
  const { form, loading, error, updateField, submit, router } = useCreateCourse();

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  const created = await submit();

  if (created) {
    router.push("/courses");
  }
};

  return (
    <section className="relative z-10 overflow-hidden pt-28 pb-16 md:pt-36 lg:pt-[170px] lg:pb-24">
      <div className="container">
        <div className="-mx-4 flex flex-wrap justify-center">
          <div className="w-full px-4">
            <div style={{marginTop:"-40px"}}
              className="
                mx-auto w-full
                max-w-[520px] md:max-w-[640px]
                rounded-3xl
                border border-white/15
                bg-white/10
                p-6 sm:p-8
                shadow-2xl
                backdrop-blur-2xl
                ring-1 ring-white/10
                dark:border-white/10
                dark:bg-white/5
              "
            >
              <div className="mb-6 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/15 dark:bg-white/10">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M7 4h10a2 2 0 0 1 2 2v14l-7-3-7 3V6a2 2 0 0 1 2-2Z"
                      fill="currentColor"
                      opacity="0.9"
                    />
                  </svg>
                </div>

                <h1 className="text-2xl font-bold text-black dark:text-white">
                  Create Course
                </h1>
                <p className="mt-1 text-sm text-body-color dark:text-body-color-dark">
                  Fill the details below to publish a new course.
                </p>
              </div>

              {error && (
                <div className="mb-5 rounded-2xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-300">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-black dark:text-white">
                    Course Title
                  </label>
                  <div
                    className="
                      flex items-center gap-3
                      rounded-2xl
                      border border-white/15
                      bg-white/10
                      px-4 py-3
                      backdrop-blur-xl
                      transition
                      focus-within:border-primary/40
                      focus-within:ring-2 focus-within:ring-primary/20
                      dark:border-white/10 dark:bg-white/5
                    "
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      className="opacity-70"
                    >
                      <path
                        d="M6 7h12M6 12h12M6 17h8"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                      />
                    </svg>

                    <input
                      type="text"
                      placeholder="e.g. Front-End Mastery"
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

                  <div
                    className="
                      rounded-2xl
                      border border-white/15
                      bg-white/10
                      px-4 py-3
                      backdrop-blur-xl
                      transition
                      focus-within:border-primary/40
                      focus-within:ring-2 focus-within:ring-primary/20
                      dark:border-white/10 dark:bg-white/5
                    "
                  >
                    <textarea
                      rows={4}
                      placeholder="Write a short description about the course..."
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

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-black dark:text-white">
                      Price
                    </label>
                    <div
                      className="
                        flex items-center gap-3
                        rounded-2xl
                        border border-white/15
                        bg-white/10
                        px-4 py-3
                        backdrop-blur-xl
                        transition
                        focus-within:border-primary/40
                        focus-within:ring-2 focus-within:ring-primary/20
                        dark:border-white/10 dark:bg-white/5
                      "
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        className="opacity-70"
                      >
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
                        onChange={(e) => updateField("price", Number(e.target.value))}
                        required
                        className="
                          w-full bg-transparent text-sm text-black outline-none
                          dark:text-white
                        "
                      />
                    </div>
                    <p className="mt-2 text-xs text-body-color dark:text-body-color-dark">
                      Enter 0 if it’s free.
                    </p>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-black dark:text-white">
                      Category ID
                    </label>
                    <div
                      className="
                        flex items-center gap-3
                        rounded-2xl
                        border border-white/15
                        bg-white/10
                        px-4 py-3
                        backdrop-blur-xl
                        transition
                        focus-within:border-primary/40
                        focus-within:ring-2 focus-within:ring-primary/20
                        dark:border-white/10 dark:bg-white/5
                      "
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        className="opacity-70"
                      >
                        <path
                          d="M4 6h16M4 12h10M4 18h16"
                          stroke="currentColor"
                          strokeWidth="1.7"
                          strokeLinecap="round"
                        />
                      </svg>

                      <input
                        type="number"
                        min={1}
                        value={form.categoryId}
                        onChange={(e) => updateField("categoryId", Number(e.target.value))}
                        required
                        className="
                          w-full bg-transparent text-sm text-black outline-none
                          dark:text-white
                        "
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-black dark:text-white">
                      Start Date
                    </label>
                    <div
                      className="
                        flex items-center gap-3
                        rounded-2xl
                        border border-white/15
                        bg-white/10
                        px-4 py-3
                        backdrop-blur-xl
                        transition
                        focus-within:border-primary/40
                        focus-within:ring-2 focus-within:ring-primary/20
                        dark:border-white/10 dark:bg-white/5
                      "
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        className="opacity-70"
                      >
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
                          dark:text-white
                        "
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-black dark:text-white">
                      End Date
                    </label>
                    <div
                      className="
                        flex items-center gap-3
                        rounded-2xl
                        border border-white/15
                        bg-white/10
                        px-4 py-3
                        backdrop-blur-xl
                        transition
                        focus-within:border-primary/40
                        focus-within:ring-2 focus-within:ring-primary/20
                        dark:border-white/10 dark:bg-white/5
                      "
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        className="opacity-70"
                      >
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
                          dark:text-white
                        "
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-2 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="submit"
                    disabled={loading}
                    className="
                      shadow-submit dark:shadow-submit-dark
                      w-full sm:w-1/2
                      rounded-2xl
                      bg-primary
                      px-8 py-3.5
                      text-sm font-semibold text-white
                      transition duration-300
                      hover:bg-primary/90
                      active:scale-[0.99]
                      disabled:opacity-60
                    "
                  >
                    {loading ? "Saving..." : "Save Course"}
                  </button>

                  <button
                    type="button"
                    onClick={() => router.push("/courses")}
                    disabled={loading}
                    className="
                      w-full sm:w-1/2
                      rounded-2xl
                      border border-white/20
                      bg-white/10
                      px-8 py-3.5
                      text-sm font-semibold
                      text-black
                      backdrop-blur-xl
                      transition
                      hover:bg-white/15 hover:border-white/30
                      disabled:opacity-60
                      dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10
                    "
                  >
                    Cancel
                  </button>
                </div>

                <p className="pt-1 text-center text-xs text-white/50">
                  Tip: Make sure dates are correct before saving.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CreateCoursePage;
