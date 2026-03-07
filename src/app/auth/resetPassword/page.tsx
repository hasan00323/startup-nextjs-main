"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

type ResetPasswordForm = {
  currentPassword: string;
  newPassword: string;
};

// ================= SHELL (الصدفة الخارجية مع تأثيرات زجاجية) =================
function Shell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <section
        className="relative z-10 min-h-[80vh] overflow-hidden pt-36 pb-16 md:pb-20 lg:pt-[170px] lg:pb-24 opacity-0 animate-[rpSectionIn_.6s_ease-out_forwards]"
        style={{ marginTop: "-60px" }}
      >
        {/* Glow Effect */}
        <div className="absolute left-1/2 top-10 -z-10 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]"></div>

        <div className="container">
          <div className="-mx-4 flex flex-wrap justify-center">
            <div className="w-full px-4">
              <div
                className="
                  mx-auto w-full max-w-[92%] sm:max-w-[550px]
                  rounded-[2rem] border border-black/5
                  bg-white/80 p-8 shadow-2xl backdrop-blur-xl
                  dark:border-white/10 dark:bg-[#0B1220]/80
                  sm:p-10
                  opacity-0 animate-[rpCardIn_.7s_ease-out_forwards]
                "
              >
                {children}
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes rpSectionIn {
          0% { opacity: 0; transform: translateY(12px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes rpCardIn {
          0% { opacity: 0; transform: translateY(20px) scale(0.98); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes rpItemUp {
          0% { opacity: 0; transform: translateY(12px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}

// ================= EYE ICON =================
function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7Z"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M3 3l18 18" stroke="currentColor" strokeWidth="1.7" />
      <path d="M10.5 10.7a3.5 3.5 0 0 0 4.8 4.8" stroke="currentColor" strokeWidth="1.7" />
      <path d="M6.7 6.8C4.2 8.5 2.5 12 2.5 12s3.5 7 9.5 7c1.7 0 3.2-.4 4.5-1" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

export default function ResetPasswordPage() {
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  const [form, setForm] = useState<ResetPasswordForm>({
    currentPassword: "",
    newPassword: "",
  });

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    setToken(localStorage.getItem("token"));
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const tokenNow = localStorage.getItem("token");
      if (!tokenNow) {
        router.push("/signin");
        return;
      }

      if (!form.currentPassword.trim() || !form.newPassword.trim()) {
        throw new Error("Please enter both passwords.");
      }

      if (form.newPassword.trim().length < 8) {
        throw new Error("New password must be at least 8 characters.");
      }

      const res = await apiFetch(
        "https://localhost:7145/api/Auth/ResetPassword",
        {
          method: "POST",
          body: JSON.stringify({
            oldPassword: form.currentPassword,
            newPassword: form.newPassword,
          }),
        },
        router
      );

      if (!res.ok) {
        const contentType = res.headers.get("content-type") || "";

        if (contentType.includes("application/json")) {
          const err: any = await res.json().catch(() => null);

          const msg =
            err?.errors?.OldPassword?.[0] ||
            err?.errors?.oldPassword?.[0] ||
            err?.errors?.NewPassword?.[0] ||
            err?.errors?.newPassword?.[0] ||
            err?.message ||
            err?.title ||
            `Reset password failed (${res.status}).`;

          throw new Error(String(msg));
        } else {
          const t = await res.text().catch(() => "");
          throw new Error(t || `Reset password failed (${res.status}).`);
        }
      }

      setSuccess("Password updated successfully.");
      setForm({ currentPassword: "", newPassword: "" });

      setTimeout(() => router.push("/"), 900);
    } catch (err: any) {
      setError(err?.message || "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  if (!mounted) {
    return (
      <Shell>
        <div className="flex flex-col items-center justify-center py-10 opacity-0 animate-[rpItemUp_.6s_ease-out_forwards]">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" />
            <span className="h-3 w-3 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]" />
            <span className="h-3 w-3 animate-bounce rounded-full bg-primary" />
          </div>
        </div>
      </Shell>
    );
  }

  if (!token) {
    return (
      <Shell>
        <div className="text-center opacity-0 animate-[rpItemUp_.6s_ease-out_forwards]">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-500">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="mb-2 text-2xl font-bold text-black dark:text-white">
            Sign In Required
          </h3>
          <p className="mb-8 text-sm font-medium text-body-color dark:text-body-color-dark">
            You must be signed in to reset your password.
          </p>
          <button
            onClick={() => router.push("/signin")}
            className="w-full rounded-xl bg-primary px-8 py-3.5 text-sm font-bold text-white shadow-lg transition duration-300 hover:bg-primary/90 active:scale-[0.98]"
          >
            Go to Sign In
          </button>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      {/* Header Icon */}
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-tr from-primary to-blue-400 text-white shadow-lg opacity-0 animate-[rpItemUp_.6s_ease-out_forwards]">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      </div>

      <h1 className="mb-2 text-center text-3xl font-extrabold text-black dark:text-white opacity-0 animate-[rpItemUp_.6s_ease-out_forwards] [animation-delay:100ms]">
        Security Settings
      </h1>
      <p className="mb-8 text-center text-sm font-medium text-body-color dark:text-body-color-dark opacity-0 animate-[rpItemUp_.6s_ease-out_forwards] [animation-delay:150ms]">
        Update your password to keep your account secure.
      </p>

      {/* Alerts */}
      {success && (
        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-green-500/30 bg-green-500/10 px-5 py-4 text-sm font-medium text-green-700 dark:text-green-400 opacity-0 animate-[rpItemUp_.6s_ease-out_forwards]">
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
          {success}
        </div>
      )}

      {error && (
        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-sm font-medium text-red-600 dark:text-red-400 opacity-0 animate-[rpItemUp_.6s_ease-out_forwards]">
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={onSubmit} className="space-y-5">
        
        {/* Current Password */}
        <div className="opacity-0 animate-[rpItemUp_.6s_ease-out_forwards] [animation-delay:200ms]">
          <label className="mb-2 block text-sm font-bold text-black dark:text-white">
            Current Password
          </label>
          <div className="flex items-center gap-3 rounded-xl border border-black/10 bg-white/50 px-4 py-3.5 transition duration-300 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary dark:border-white/10 dark:bg-white/5 dark:focus-within:border-primary/50 dark:focus-within:ring-primary/50">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="text-black/50 dark:text-white/50">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
            </svg>
            <input
              type={showCurrent ? "text" : "password"}
              value={form.currentPassword}
              onChange={(e) =>
                setForm({ ...form, currentPassword: e.target.value })
              }
              required
              className="w-full bg-transparent text-sm font-medium text-black outline-none placeholder:text-black/40 dark:text-white dark:placeholder:text-white/40"
              placeholder="Enter current password"
            />
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => setShowCurrent((v) => !v)}
              className="text-black/50 transition hover:text-black dark:text-white/50 dark:hover:text-white"
              aria-label="Toggle current password visibility"
            >
              <EyeIcon open={showCurrent} />
            </button>
          </div>
        </div>

        {/* New Password */}
        <div className="opacity-0 animate-[rpItemUp_.6s_ease-out_forwards] [animation-delay:250ms]">
          <label className="mb-2 block text-sm font-bold text-black dark:text-white">
            New Password
          </label>
          <div className="flex items-center gap-3 rounded-xl border border-black/10 bg-white/50 px-4 py-3.5 transition duration-300 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary dark:border-white/10 dark:bg-white/5 dark:focus-within:border-primary/50 dark:focus-within:ring-primary/50">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="text-black/50 dark:text-white/50">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <input
              type={showNew ? "text" : "password"}
              value={form.newPassword}
              onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
              required
              className="w-full bg-transparent text-sm font-medium text-black outline-none placeholder:text-black/40 dark:text-white dark:placeholder:text-white/40"
              placeholder="Enter new password"
            />
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => setShowNew((v) => !v)}
              className="text-black/50 transition hover:text-black dark:text-white/50 dark:hover:text-white"
              aria-label="Toggle new password visibility"
            >
              <EyeIcon open={showNew} />
            </button>
          </div>
          <p className="mt-2 pl-1 text-xs font-medium text-black/50 dark:text-white/50">
            Must be at least 8 characters long.
          </p>
        </div>

        {/* Buttons Grid */}
        <div className="mt-8 grid grid-cols-1 gap-4 pt-4 sm:grid-cols-2 opacity-0 animate-[rpItemUp_.6s_ease-out_forwards] [animation-delay:300ms]">
          <button
            type="button"
            onClick={() => router.back()}
            disabled={saving}
            className="
              flex w-full items-center justify-center rounded-xl border border-black/10 bg-white
              px-6 py-3.5 text-sm font-bold text-black shadow-sm
              transition duration-300 hover:bg-gray-50 active:scale-[0.98]
              dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving || !!success}
            className="
              flex w-full items-center justify-center gap-2 rounded-xl bg-primary
              px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-primary/30
              transition duration-300 hover:bg-primary/90 active:scale-[0.98]
              disabled:opacity-60 disabled:cursor-not-allowed
            "
          >
            {saving ? (
              <>
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeOpacity="0.3" />
                  <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Saving...
              </>
            ) : success ? (
              <>
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                Updated
              </>
            ) : (
              "Update Password"
            )}
          </button>
        </div>
      </form>
    </Shell>
  );
}