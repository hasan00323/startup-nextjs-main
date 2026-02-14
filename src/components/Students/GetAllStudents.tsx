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

      // يدعم: array أو { items: [] }
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
                lg:max-w-[980px]
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

  if (loading) {
    return (
      <Shell>
        <div className="text-center text-body-color dark:text-body-color-dark">Loading...</div>
      </Shell>
    );
  }

  if (error) {
    return (
      <Shell>
        <h3 className="mb-2 text-center text-xl font-bold text-black dark:text-white">
          Something went wrong
        </h3>

        <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400">
          {error}
        </div>

        <button
          onClick={() => router.push("/")}
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
          Back
        </button>
      </Shell>
    );
  }

  return (
    <Shell>
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between" style={{marginTop:"70px"}}>
        <div>
          <h1 className="text-2xl font-bold text-black dark:text-white sm:text-3xl">
            All Students
          </h1>
          <p className="text-body-color dark:text-body-color-dark mt-1 text-sm">
            List of all registered students.
          </p>
        </div>

        <button
          onClick={() => router.push("/")}
          className="
            rounded-xl border border-white/20 bg-white/10
            px-6 py-3 text-sm font-semibold text-black
            transition duration-300 hover:bg-white/15
            dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10
          "
        >
          Back
        </button>
      </div>

      {/* Empty */}
      {students.length === 0 ? (
        <div className="rounded-xl border border-white/20 bg-white/10 p-8 text-center text-body-color dark:border-white/10 dark:bg-white/5 dark:text-body-color-dark">
          No students found.
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-white/20 bg-white/10 dark:border-white/10 dark:bg-white/5">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-white/10 bg-white/10 dark:border-white/10 dark:bg-white/5">
                <tr>
                  <th className="px-5 py-4 font-semibold text-black dark:text-white">ID</th>
                  <th className="px-5 py-4 font-semibold text-black dark:text-white">Full Name</th>
                  <th className="px-5 py-4 font-semibold text-black dark:text-white">Email</th>
                  <th className="px-5 py-4 font-semibold text-black dark:text-white">Role</th>
                </tr>
              </thead>

              <tbody>
                {students.map((s: any, idx: number) => {
                  const id = s?.id ?? s?.userId ?? s?.studentId ?? idx + 1;
                  const name = s?.fullName ?? s?.FullName ?? s?.name ?? "—";
                  const email = s?.email ?? s?.Email ?? "—";
                  const role =
                    s?.roleName ?? s?.RoleName ?? s?.roleId ?? s?.RoleId ?? "Student";

                  return (
                    <tr
                      key={String(id)}
                      className="border-b border-white/10 last:border-b-0 hover:bg-white/5 dark:border-white/10"
                    >
                      <td className="px-5 py-4 text-body-color dark:text-body-color-dark">
                        {String(id)}
                      </td>
                      <td className="px-5 py-4 font-semibold text-black dark:text-white">
                        {String(name)}
                      </td>
                      <td className="px-5 py-4 text-body-color dark:text-body-color-dark">
                        {String(email)}
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-black dark:border-white/10 dark:bg-white/5 dark:text-white">
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
