"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "@/lib/api";

const CreateEnrollmentPage = () => {
  const router = useRouter();

  const [studentId, setStudentId] = useState<number>(0);
  const [courseId, setCourseId] = useState<number>(0);

  // datetime-local default
  const [createdAt, setCreatedAt] = useState<string>(
    new Date().toISOString().slice(0, 16)
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const token = useMemo(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
  }, []);

  useEffect(() => {
    if (!token) router.push("/signin");
  }, [token, router]);

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  setLoading(true);
  setError(null);
  setSuccess(null);

  const body = {
    studentId,
    courseId,
    createdAt: new Date(createdAt).toISOString(),
  };

  try {
    if (!token) {
      router.push("/signin");
      return;
    }

    const res = await apiFetch(
      "https://localhost:7145/api/enrollments/CreateEnrollment",
      {
        method: "POST",
        body: JSON.stringify(body),
      },
      router
    );

    if (!res.ok) {
      const contentType = res.headers.get("content-type") || "";
      const msg = contentType.includes("application/json")
        ? await res.json().then((j) => j?.message || j?.error || JSON.stringify(j))
        : await res.text().catch(() => "");

      throw new Error(msg || `Request failed (${res.status})`);
    }

    setSuccess("Enrollment created successfully ✅ Redirecting...");
    setTimeout(() => router.push("/enrollments"), 700);
  } catch (err: any) {
    setError(err?.message || "Something went wrong");
  } finally {
    setLoading(false);
  }
};


  const inputClass =
    "w-full rounded-2xl border border-white/15 bg-white/10 px-5 py-3 text-sm text-black/90 shadow-sm outline-none transition duration-300 placeholder:text-black/40 focus:border-primary/40 focus:ring-2 focus:ring-primary/20 dark:border-white/10 dark:bg-white/5 dark:text-white/90 dark:placeholder:text-white/40";

  const labelClass =
    "mb-2 block text-sm font-semibold text-black dark:text-white";

  const helperClass =
    "mt-2 text-xs text-body-color dark:text-body-color-dark";

  return (
    <section className="relative z-10 overflow-hidden pt-28 pb-16 md:pt-36 md:pb-20 lg:pt-[160px] lg:pb-28">
      <div className="container">
        <div className="-mx-4 flex flex-wrap justify-center">
          <div className="w-full px-4">
            {/* Glass Card */}
            <div
              className="
                mx-auto
                w-full
                max-w-[560px]
                rounded-3xl
                border border-white/15
                bg-white/10
                px-6 py-8
                shadow-two
                backdrop-blur-xl
                dark:border-white/10
                dark:bg-white/5
                sm:px-10 sm:py-10
              "
            >
              {/* Header */}
              <div className="mb-7 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary dark:bg-white/10 dark:text-white">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 5v14M5 12h14"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>

                <h3 className="text-2xl font-extrabold tracking-tight text-black dark:text-white sm:text-3xl">
                  Create Enrollment
                </h3>
                <p className="mt-2 text-sm text-body-color dark:text-body-color-dark">
                  Add a new enrollment by filling the fields below.
                </p>
              </div>

              {/* Alerts */}
              {error && (
                <div className="mb-5 rounded-2xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400">
                  {error}
                </div>
              )}

              {success && (
                <div className="mb-5 rounded-2xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-600 dark:text-emerald-400">
                  {success}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Student ID */}
                <div>
                  <label className={labelClass}>Student ID</label>
                  <input
                    type="number"
                    min={1}
                    value={studentId || ""}
                    onChange={(e) => setStudentId(Number(e.target.value))}
                    required
                    className={inputClass}
                    placeholder="e.g. 12"
                  />
                  <p className={helperClass}>
                    Must be a positive number.
                  </p>
                </div>

                {/* Course ID */}
                <div>
                  <label className={labelClass}>Course ID</label>
                  <input
                    type="number"
                    min={1}
                    value={courseId || ""}
                    onChange={(e) => setCourseId(Number(e.target.value))}
                    required
                    className={inputClass}
                    placeholder="e.g. 5"
                  />
                  <p className={helperClass}>
                    Must be a positive number.
                  </p>
                </div>

                {/* Created At */}
                <div>
                  <label className={labelClass}>Created At</label>
                  <input
                    type="datetime-local"
                    value={createdAt}
                    onChange={(e) => setCreatedAt(e.target.value)}
                    required
                    className={inputClass}
                  />
                  <p className={helperClass}>
                    Default is the current date & time.
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <button
                    type="submit"
                    disabled={loading}
                    className="
                      ease-in-up shadow-btn hover:shadow-btn-hover
                      bg-primary hover:bg-primary/90
                      w-full
                      rounded-2xl
                      px-6 py-3.5
                      text-sm font-semibold text-white
                      transition duration-300
                      disabled:opacity-60
                      sm:w-auto sm:min-w-[200px]
                      active:scale-[0.99]
                    "
                  >
                    {loading ? "Saving..." : "Save Enrollment"}
                  </button>

                  <button
                    type="button"
                    onClick={() => router.push("/enrollments")}
                    className="
                      w-full
                      rounded-2xl
                      border border-white/15
                      bg-white/10
                      px-6 py-3.5
                      text-sm font-semibold
                      text-black/80
                      shadow-sm
                      backdrop-blur-xl
                      transition duration-300
                      hover:bg-white/15
                      dark:border-white/10
                      dark:bg-white/5
                      dark:text-white/80
                      dark:hover:bg-white/10
                      sm:w-auto sm:min-w-[160px]
                      active:scale-[0.99]
                    "
                  >
                    Cancel
                  </button>
                </div>

                {/* Hint */}
                <p className="pt-1 text-center text-xs text-body-color dark:text-body-color-dark">
                  Tip: After saving, you’ll be redirected to the enrollments list.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CreateEnrollmentPage;
