"use client";

import { useCreateEnrollment } from "@/hooks/useEnrollments";

const CreateEnrollmentPage = () => {
  const { form, loading, feedback, updateField, submit, router } =
    useCreateEnrollment();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const created = await submit();

    if (created) {
      setTimeout(() => router.push("/enrollments"), 1000);
    }
  };

  // CSS classes for reuse
  const inputClass =
    "w-full rounded-xl border border-black/10 bg-white/50 px-4 py-3.5 text-sm font-medium text-black outline-none transition duration-300 placeholder:text-black/40 focus:border-primary focus:ring-1 focus:ring-primary dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-white/40 dark:focus:border-primary/50 dark:focus:ring-primary/50";
  
  const labelClass =
    "mb-2 block text-sm font-bold text-black dark:text-white";
  
  const helperClass =
    "mt-2 text-xs font-medium text-black/50 dark:text-white/50 pl-1";

  return (
    <>
      <section className="relative z-10 min-h-screen overflow-hidden pt-36 pb-16 md:pb-20 lg:pt-[170px] lg:pb-24 opacity-0 animate-[fadeInUp_.6s_ease-out_forwards]">
        
        {/* Glow Effect للخلفية */}
        <div className="absolute left-1/2 top-10 -z-10 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]"></div>

        <div className="container">
          <div className="-mx-4 flex flex-wrap justify-center">
            <div className="w-full px-4">
              <div
                className="
                  mx-auto w-full max-w-[650px]
                  rounded-[2rem] border border-black/5
                  bg-white/80 p-6 shadow-2xl backdrop-blur-2xl
                  dark:border-white/10 dark:bg-[#0B1220]/80
                  sm:p-10
                "
              >
                {/* Header */}
                <div className="mb-8 text-center opacity-0 animate-[fadeInUp_.6s_ease-out_forwards] [animation-delay:100ms]">
                  <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-tr from-primary to-blue-400 text-white shadow-lg">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                      <circle cx="8.5" cy="7" r="4" />
                      <line x1="20" y1="8" x2="20" y2="14" />
                      <line x1="23" y1="11" x2="17" y2="11" />
                    </svg>
                  </div>

                  <h3 className="text-3xl font-extrabold tracking-tight text-black dark:text-white">
                    Create Enrollment
                  </h3>
                  <p className="mt-2 text-sm font-medium text-body-color dark:text-body-color-dark">
                    Assign a student to a specific course securely.
                  </p>
                </div>

                {/* Alerts */}
                {feedback?.type === "error" && (
                  <div className="mb-6 flex items-center gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-sm font-medium text-red-600 dark:text-red-400 opacity-0 animate-[fadeInUp_.6s_ease-out_forwards]">
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    {feedback.text}
                  </div>
                )}

                {feedback?.type === "success" && (
                  <div className="mb-6 flex items-center gap-3 rounded-2xl border border-green-500/30 bg-green-500/10 px-5 py-4 text-sm font-medium text-green-700 dark:text-green-400 opacity-0 animate-[fadeInUp_.6s_ease-out_forwards]">
                    <svg className="h-5 w-5 animate-spin text-green-600 dark:text-green-400" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeOpacity="0.3" />
                      <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    {feedback.text}
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6 opacity-0 animate-[fadeInUp_.6s_ease-out_forwards] [animation-delay:200ms]">
                  
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    {/* Student ID */}
                    <div>
                      <label className={labelClass}>Student ID</label>
                      <input
                        type="number"
                        min={1}
                        value={form.studentId}
                        onChange={(e) =>
                          updateField(
                            "studentId",
                            e.target.value === "" ? "" : Number(e.target.value)
                          )
                        }
                        required
                        className={inputClass}
                        placeholder="e.g. 1042"
                      />
                      <p className={helperClass}>Must be a valid integer.</p>
                    </div>

                    {/* Course ID */}
                    <div>
                      <label className={labelClass}>Course ID</label>
                      <input
                        type="number"
                        min={1}
                        value={form.courseId}
                        onChange={(e) =>
                          updateField(
                            "courseId",
                            e.target.value === "" ? "" : Number(e.target.value)
                          )
                        }
                        required
                        className={inputClass}
                        placeholder="e.g. 5"
                      />
                      <p className={helperClass}>Must be a valid integer.</p>
                    </div>
                  </div>

                  {/* Created At */}
                  <div>
                    <label className={labelClass}>Enrollment Date & Time</label>
                    <input
                      type="datetime-local"
                      value={form.createdAt}
                      onChange={(e) => updateField("createdAt", e.target.value)}
                      required
                      className={inputClass}
                    />
                    <p className={helperClass}>
                      Defaults to current system time.
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="mt-8 flex flex-col gap-4 pt-4 sm:flex-row sm:items-center">
                    <button
                      type="button"
                      onClick={() => router.push("/enrollments")}
                      disabled={loading || feedback?.type === "success"}
                      className="
                        flex w-full items-center justify-center rounded-xl border border-black/10 bg-white
                        px-6 py-4 text-sm font-bold text-black shadow-sm
                        transition duration-300 hover:bg-gray-50 active:scale-[0.98]
                        dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10
                        disabled:opacity-50 disabled:cursor-not-allowed sm:w-auto sm:flex-1
                      "
                    >
                      Cancel
                    </button>
                    
                    <button
                      type="submit"
                      disabled={loading || feedback?.type === "success"}
                      className="
                        flex w-full items-center justify-center gap-2 rounded-xl bg-primary
                        px-6 py-4 text-sm font-bold text-white shadow-lg shadow-primary/30
                        transition duration-300 hover:bg-primary/90 active:scale-[0.98]
                        disabled:opacity-60 disabled:cursor-not-allowed sm:w-auto sm:flex-[2]
                      "
                    >
                      {loading ? (
                        <>
                          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeOpacity="0.3" />
                            <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Processing...
                        </>
                      ) : feedback?.type === "success" ? (
                        <>
                          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                          Success
                        </>
                      ) : (
                        "Confirm Enrollment"
                      )}
                    </button>
                  </div>

                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
      <style>{`
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
};

export default CreateEnrollmentPage;
