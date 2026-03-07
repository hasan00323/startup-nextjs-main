"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { startRefreshTokenTimer } from "@/lib/api";

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
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("roleId");
        localStorage.removeItem("fullName");
        localStorage.removeItem("userId");
        localStorage.removeItem("refreshToken");
      }

      const res = await fetch("https://localhost:7145/api/Auth/Login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        let msg = `Login failed (${res.status})`;
        try {
          const errJson = await res.json();
          msg = errJson?.message || errJson?.error || errJson?.title || msg;
        } catch {
          const t = await res.text().catch(() => "");
          if (t) msg = t;
        }
        throw new Error(msg);
      }

      const data = await res.json();
      const root = data?.value ?? data?.data ?? data?.result ?? data;

      const token =
        root?.accessToken ??
        root?.AccessToken ??
        root?.token ??
        root?.Token ??
        null;

      if (!token) {
        throw new Error("Login succeeded but AccessToken is missing.");
      }

      const roleIdRaw =
        root?.roleId ??
        root?.RoleId ??
        root?.user?.roleId ??
        root?.user?.RoleId ??
        null;

      const roleId = roleIdRaw !== null ? Number(roleIdRaw) : null;
      if (roleId === null || Number.isNaN(roleId)) {
        throw new Error("Login succeeded but RoleId is missing/invalid.");
      }

      const fullName =
        root?.fullName ??
        root?.FullName ??
        root?.user?.fullName ??
        root?.user?.FullName ??
        "";

      const userIdRaw =
        root?.userId ??
        root?.UserId ??
        root?.user?.userId ??
        root?.user?.UserId ??
        null;

      if (typeof window !== "undefined") {
        localStorage.setItem("token", String(token));
        localStorage.setItem("roleId", String(roleId));

        if (fullName && String(fullName).trim().length > 0)
          localStorage.setItem("fullName", String(fullName));
        else localStorage.removeItem("fullName");

        if (userIdRaw !== null && userIdRaw !== undefined)
          localStorage.setItem("userId", String(userIdRaw));
        else localStorage.removeItem("userId");
      }

      startRefreshTokenTimer();
      router.replace("/");
    } catch (err: any) {
      setError(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <main className="flex min-h-screen w-full bg-[#0B0F19] opacity-0 animate-[pageFade_.5s_ease-out_forwards]">
        
        {/* ================= LEFT SIDE: FORM ================= */}
        <div className="flex w-full flex-col justify-center px-6 lg:w-1/2 xl:w-[45%] 2xl:w-[40%]" style={{ marginLeft: "120px" }}  >
          <div className="mx-auto w-full max-w-[440px] opacity-0 animate-[cardFade_.6s_ease-out_forwards]">
            
            <div className="mb-8 text-left">
              <h3 className="mb-2 text-3xl font-bold text-white opacity-0 animate-[itemUp_.6s_ease-out_forwards] [animation-delay:120ms]">
                Welcome back
              </h3>
              <p className="text-sm font-medium text-gray-400 opacity-0 animate-[itemUp_.6s_ease-out_forwards] [animation-delay:180ms]">
                Sign in to continue to Future Dev.
              </p>
            </div>

            {error && (
              <div className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400 opacity-0 animate-[itemUp_.4s_ease-out_forwards]">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="opacity-0 animate-[itemUp_.6s_ease-out_forwards] [animation-delay:220ms]">
                <label className="mb-2 block text-sm font-semibold text-white">
                  Email
                </label>
                <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 transition duration-300 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/50">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-gray-400">
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
                    className="w-full bg-transparent text-sm text-white outline-none placeholder:text-gray-500"
                  />
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  Use the same email you registered with.
                </p>
              </div>

              <div className="opacity-0 animate-[itemUp_.6s_ease-out_forwards] [animation-delay:300ms]">
                <label className="mb-2 block text-sm font-semibold text-white">
                  Password
                </label>
                <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 transition duration-300 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/50">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-gray-400">
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
                    className="w-full bg-transparent text-sm text-white outline-none placeholder:text-gray-500"
                  />
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    If you forgot your password, you can reset it.
                  </span>
                  <Link
                    href="/auth/resetPassword"
                    className="text-xs font-semibold text-blue-500 transition hover:text-blue-400 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>

              <button
                type="submit"
                disabled={!canSubmit}
                className="
                  w-full rounded-xl bg-blue-600 px-10 py-3.5
                  text-sm font-semibold text-white shadow-lg
                  transition duration-300 hover:bg-blue-500
                  disabled:opacity-60
                  opacity-0 animate-[itemUp_.6s_ease-out_forwards]
                  [animation-delay:380ms]
                "
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>

            <div className="my-6 flex items-center gap-4 opacity-0 animate-[itemUp_.6s_ease-out_forwards] [animation-delay:440ms]">
              <div className="h-px w-full bg-white/10" />
              <span className="text-xs text-gray-500">or</span>
              <div className="h-px w-full bg-white/10" />
            </div>

            <Link
              href="/signup"
              className="
                block w-full rounded-xl
                border border-white/10
                bg-white/5
                px-10 py-3.5
                text-center text-sm font-semibold
                text-white transition duration-300
                hover:bg-white/10
                opacity-0 animate-[itemUp_.6s_ease-out_forwards]
                [animation-delay:500ms]
              "
            >
              Create a new account
            </Link>
          </div>
        </div>

        {/* ================= RIGHT SIDE: BRANDING & IMAGE ================= */}
        <div className="relative hidden w-full items-center justify-center overflow-hidden lg:flex lg:w-1/2 xl:w-[55%] 2xl:w-[60%]">
          {/* يمكنك تغيير الرابط في الأسفل بصورة الخلفية الخاصة بالشركة */}
          <div 
            className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')] bg-cover bg-center bg-no-repeat opacity-40 mix-blend-luminosity"
          ></div>
          
          {/* Gradient Overlay لدمج الصورة مع الواجهة بسلاسة */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B0F19] via-[#0B0F19]/60 to-transparent"></div>

          {/* محتوى اليمين (اللوجو والنص) */}
          <div className="relative z-10 flex flex-col items-center text-center opacity-0 animate-[itemUp_.8s_ease-out_forwards] [animation-delay:400ms]">
            
            {/* الشعار (Logo) - يمكنك استبدال الـ SVG بصورة شعاركم */}
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-2xl border border-white/20 bg-white/10 shadow-2xl backdrop-blur-md">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="text-white">
                <path
                  d="M12 12a4.5 4.5 0 1 0-4.5-4.5A4.5 4.5 0 0 0 12 12Zm0 2.25c-4.2 0-7.5 2.1-7.5 4.5v.75h15v-.75c0-2.4-3.3-4.5-7.5-4.5Z"
                  fill="currentColor"
                  opacity="0.9"
                />
              </svg>
            </div>
            
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
              Future Dev
            </h1>
            <p className="mt-4 max-w-md text-lg text-gray-300">
              Welcome back to our platform. Let's continue building the future of software development together.
            </p>
          </div>
        </div>

      </main>

      <style>{`
        @keyframes pageFade {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes cardFade {
          0% { opacity: 0; transform: translateX(-20px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        @keyframes itemUp {
          0% { opacity: 0; transform: translateY(15px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
};

export default SigninPage;