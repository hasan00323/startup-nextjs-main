"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

type Student = any;

const GetAllStudentsPage = () => {
  const router = useRouter();

  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const token = useMemo(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
  }, []);

  useEffect(() => {
    if (!token) {
      router.push("/signin");
      return;
    }

    setLoading(true);
    setError(null);

    const url = "https://localhost:7145/api/Users/GetAllStudents";

    apiFetch(
      url,
      {
        method: "GET",
      },
      router
    )
      .then(async (res) => {
        if (res.status === 404) {
          setStudents([]);
          return;
        }

        if (!res.ok) {
          const t = await res.text().catch(() => "");
          throw new Error(t || `Failed (${res.status})`);
        }

        const data = await res.json();

        const arr = Array.isArray(data) ? data : data?.items ?? [];
        if (!Array.isArray(arr)) {
          setStudents([]);
          return;
        }

        setStudents(arr);
      })
      .catch((e) => setError(e?.message || "Failed to load"))
      .finally(() => setLoading(false));
  }, [token, router]);

  // ================= SHELL (الصدفة الخارجية) =================
  const Shell = ({ children }: { children: React.ReactNode }) => (
    <>
      <section
        className="relative z-10 min-h-[80vh] overflow-hidden pt-36 pb-16 md:pb-20 lg:pt-[170px] lg:pb-24 opacity-0 animate-[gasSectionIn_.6s_ease-out_forwards]"
        style={{ marginTop: "-60px" }}
      >
        {/* Glow Effect للخلفية */}
        <div className="absolute left-1/2 top-0 -z-10 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]"></div>

        <div className="container">
          <div className="-mx-4 flex flex-wrap justify-center">
            <div className="w-full px-4">
              <div
                className="
                  mx-auto
                  w-full
                  max-w-[92%]
                  lg:max-w-[1100px]
                  rounded-[2rem]
                  border border-black/5
                  bg-white/80
                  p-6
                  shadow-2xl
                  backdrop-blur-xl
                  dark:border-white/10
                  dark:bg-[#0B1220]/80
                  sm:p-10
                  opacity-0 animate-[gasCardIn_.7s_ease-out_forwards]
                "
              >
                {children}
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes gasSectionIn {
          0% { opacity: 0; transform: translateY(12px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes gasCardIn {
          0% { opacity: 0; transform: translateY(20px) scale(0.98); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes gasItemUp {
          0% { opacity: 0; transform: translateY(12px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes gasFade {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
      `}</style>
    </>
  );

  // ================= LOADING STATE =================
  if (loading) {
    return (
      <Shell>
        <div className="flex flex-col items-center justify-center py-20 opacity-0 animate-[gasItemUp_.6s_ease-out_forwards]">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" />
            <span className="h-3 w-3 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]" />
            <span className="h-3 w-3 animate-bounce rounded-full bg-primary" />
          </div>
          <p className="mt-4 text-sm font-semibold text-body-color dark:text-body-color-dark">
            Loading students data...
          </p>
        </div>
      </Shell>
    );
  }

  // ================= ERROR STATE =================
  if (error) {
    return (
      <Shell>
        <div className="text-center opacity-0 animate-[gasItemUp_.6s_ease-out_forwards]">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-500">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="mb-2 text-2xl font-bold text-black dark:text-white">
            System Error
          </h3>
          <div className="mx-auto mb-8 max-w-md rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-sm font-medium text-red-600 dark:text-red-400">
            {error}
          </div>
          <button
            onClick={() => router.push("/")}
            className="rounded-xl bg-primary px-8 py-3.5 text-sm font-bold text-white shadow-lg transition duration-300 hover:bg-primary/90 active:scale-[0.98]"
          >
            Return to Dashboard
          </button>
        </div>
      </Shell>
    );
  }

  // ================= MAIN UI =================
  return (
    <Shell>
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 border-b border-black/5 pb-6 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between opacity-0 animate-[gasItemUp_.6s_ease-out_forwards]">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            </div>
            <h1 className="text-2xl font-extrabold text-black dark:text-white sm:text-3xl">
              All Students
            </h1>
          </div>
          <p className="mt-2 text-sm font-medium text-body-color dark:text-body-color-dark">
            Manage and view all registered students in the platform.
          </p>
        </div>

        <button
          onClick={() => router.push("/")}
          className="
            inline-flex items-center justify-center gap-2 rounded-xl border border-black/10 bg-white
            px-6 py-3 text-sm font-bold text-black shadow-sm
            transition duration-300 hover:bg-gray-50 active:scale-[0.98]
            dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10
          "
        >
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Back
        </button>
      </div>

      {/* Empty State */}
      {students.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-black/5 bg-black/5 py-16 text-center dark:border-white/5 dark:bg-white/5 opacity-0 animate-[gasItemUp_.6s_ease-out_forwards] [animation-delay:150ms]">
          <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" className="mb-4 text-black/40 dark:text-white/40">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <p className="text-base font-semibold text-black dark:text-white">No students found.</p>
          <p className="mt-1 text-sm text-body-color dark:text-body-color-dark">It looks like no one has registered yet.</p>
        </div>
      ) : (
        /* Table */
        <div className="overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm dark:border-white/10 dark:bg-transparent opacity-0 animate-[gasFade_.6s_ease-out_forwards] [animation-delay:200ms]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-black/10 bg-gray-50/50 dark:border-white/10 dark:bg-white/5">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-black/60 dark:text-white/60">ID</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-black/60 dark:text-white/60">Student</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-black/60 dark:text-white/60">Email Address</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-black/60 dark:text-white/60">Role</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-black/5 dark:divide-white/10">
                {students.map((s: any, idx: number) => {
                  const id = s?.id ?? s?.userId ?? s?.studentId ?? idx + 1;
                  const name = s?.fullName ?? s?.FullName ?? s?.name ?? "Unknown User";
                  const email = s?.email ?? s?.Email ?? "—";
                  const role = s?.roleName ?? s?.RoleName ?? s?.roleId ?? s?.RoleId ?? "Student";
                  
                  // إنشاء حرف رمزي للاسم
                  const initial = name !== "Unknown User" ? name.charAt(0).toUpperCase() : "U";

                  return (
                    <tr
                      key={String(id)}
                      className="transition-colors hover:bg-gray-50 dark:hover:bg-white/5 opacity-0 animate-[gasItemUp_.6s_ease-out_forwards]"
                      style={{ animationDelay: `${80 + idx * 40}ms` }}
                    >
                      <td className="px-6 py-4 font-mono text-xs font-medium text-body-color dark:text-body-color-dark">
                        #{String(id)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {/* Avatar */}
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 text-xs font-bold text-white shadow-sm">
                            {initial}
                          </div>
                          <div className="font-semibold text-black dark:text-white">
                            {String(name)}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-body-color dark:text-body-color-dark">
                        {String(email)}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 dark:bg-blue-500/10 dark:text-blue-400">
                          {String(role)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </Shell>
  );
};

export default GetAllStudentsPage;