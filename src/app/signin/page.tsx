"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { apiFetch } from "@/lib/api";

const SigninPage = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = useMemo(
    () => email.trim().length > 0 && password.trim().length > 0 && !loading,
    [email, password, loading]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError(null);

    try {
      const res = await apiFetch(
        "https://localhost:7145/api/Auth/Login",
        {
          method: "POST",
          body: JSON.stringify({ email, password }),
        },
        router
      );

      if (!res.ok) {
        let msg = `Login failed (${res.status})`;
        try {
          const errJson = await res.json();
          msg = errJson?.message || errJson?.error || msg;
        } catch {
          const t = await res.text().catch(() => "");
          if (t) msg = t;
        }
        throw new Error(msg);
      }

      const data: any = await res.json();

      // ===== Access Token =====
      const token =
        data?.accessToken ||
        data?.AccessToken ||
        data?.token ||
        data?.Token ||
        data?.data?.accessToken ||
        data?.data?.AccessToken ||
        data?.result?.accessToken ||
        data?.result?.AccessToken;

      if (!token) {
        throw new Error("Login succeeded but AccessToken is missing.");
      }

      // ===== RoleId =====
      const roleIdRaw =
        data?.roleId ??
        data?.RoleId ??
        data?.user?.roleId ??
        data?.user?.RoleId ??
        data?.data?.roleId ??
        data?.data?.RoleId ??
        data?.result?.roleId ??
        data?.result?.RoleId ??
        null;

      const roleId = roleIdRaw !== null ? Number(roleIdRaw) : null;
      if (!roleId || Number.isNaN(roleId)) {
        throw new Error("Login succeeded but RoleId is missing/invalid.");
      }

      // ===== FullName =====
      const fullName =
        data?.fullName ||
        data?.FullName ||
        data?.user?.fullName ||
        data?.user?.FullName ||
        data?.data?.fullName ||
        data?.data?.FullName ||
        data?.result?.fullName ||
        data?.result?.FullName ||
        "";

      // ===== UserId =====
      const userId =
        data?.userId ??
        data?.UserId ??
        data?.user?.userId ??
        data?.user?.UserId ??
        data?.data?.userId ??
        data?.data?.UserId ??
        data?.result?.userId ??
        data?.result?.UserId ??
        null;

      const refreshToken =
        data?.refreshToken ||
        data?.RefreshToken ||
        data?.data?.refreshToken ||
        data?.data?.RefreshToken ||
        data?.result?.refreshToken ||
        data?.result?.RefreshToken;

      if (refreshToken) localStorage.setItem("refreshToken", String(refreshToken));


      // ===== Store =====
      localStorage.setItem("token", String(token));
      localStorage.setItem("roleId", String(roleId));

      if (fullName) localStorage.setItem("fullName", String(fullName));
      else localStorage.removeItem("fullName");

      if (userId !== null && userId !== undefined)
        localStorage.setItem("userId", String(userId));
      else localStorage.removeItem("userId");

      // ✅ أهم سطر: replace مش push
      router.replace("/");
    } catch (err: any) {
      setError(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };


  return (
    <section className="relative z-10 overflow-hidden pt-36 pb-16 md:pb-20 lg:pt-[170px] lg:pb-24" style={{ marginTop: "-60px" }}>
      <div className="container">
        <div className="-mx-4 flex flex-wrap justify-center">
          <div className="w-full px-4">
            {/* ✅ Smaller + clearer glass */}
            <div
              className="
                mx-auto
                w-full
                max-w-[92%]
                sm:max-w-[440px]
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
              {/* Icon */}
              <div className="mx-auto mb-5 flex h-11 w-11 items-center justify-center rounded-full bg-white/20 text-black dark:bg-white/10 dark:text-white">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 12a4.5 4.5 0 1 0-4.5-4.5A4.5 4.5 0 0 0 12 12Zm0 2.25c-4.2 0-7.5 2.1-7.5 4.5v.75h15v-.75c0-2.4-3.3-4.5-7.5-4.5Z"
                    fill="currentColor"
                    opacity="0.9"
                  />
                </svg>
              </div>

              <h3 className="mb-1 text-center text-2xl font-bold text-black dark:text-white">
                Welcome back
              </h3>
              <p className="text-body-color dark:text-body-color-dark mb-7 text-center text-sm font-medium">
                Sign in to continue to Future Dev.
              </p>

              {error && (
                <div className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-black dark:text-white">
                    Email
                  </label>

                  <div className="flex items-center gap-3 rounded-xl border border-white/20 bg-white/10 px-4 py-3 dark:border-white/10 dark:bg-white/5">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      className="opacity-70"
                    >
                      <path
                        d="M4 6.5h16v11H4v-11Zm1.5 1.6 6.2 4.8c.2.2.5.2.7 0l6.1-4.8"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>

                    <input
                      type="email"
                      name="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="
                        w-full bg-transparent text-sm text-black outline-none
                        placeholder:text-black/50
                        dark:text-white dark:placeholder:text-white/40
                      "
                    />
                  </div>

                  <p className="text-body-color dark:text-body-color-dark mt-2 text-xs">
                    Use the same email you registered with.
                  </p>
                </div>

                {/* Password */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-black dark:text-white">
                    Password
                  </label>

                  <div className="flex items-center gap-3 rounded-xl border border-white/20 bg-white/10 px-4 py-3 dark:border-white/10 dark:bg-white/5">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      className="opacity-70"
                    >
                      <path
                        d="M7 11V8.8A5 5 0 0 1 12 4a5 5 0 0 1 5 4.8V11"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                      />
                      <path
                        d="M7 11h10v9H7v-9Z"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinejoin="round"
                      />
                    </svg>

                    <input
                      type="password"
                      name="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="
                        w-full bg-transparent text-sm text-black outline-none
                        placeholder:text-black/50
                        dark:text-white dark:placeholder:text-white/40
                      "
                    />
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-body-color dark:text-body-color-dark text-xs">
                      RoleId: <span className="font-semibold">1=Admin</span> |{" "}
                      <span className="font-semibold">2=Student</span>
                    </span>

                    <Link
                      href="/reset-password"
                      className="text-primary text-xs font-semibold hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="
                    shadow-submit dark:shadow-submit-dark
                    bg-primary hover:bg-primary/90
                    w-full rounded-xl px-10 py-3.5
                    text-sm font-semibold text-white
                    transition duration-300
                    disabled:opacity-60
                  "
                >
                  {loading ? "Signing in..." : "Sign in"}
                </button>
              </form>

              {/* Divider */}
              <div className="my-6 flex items-center gap-4">
                <div className="h-px w-full bg-white/10" />
                <span className="text-body-color dark:text-body-color-dark text-xs">
                  or
                </span>
                <div className="h-px w-full bg-white/10" />
              </div>

              {/* Signup CTA */}
              <Link
                href="/signup"
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
                Create a new account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SigninPage;
