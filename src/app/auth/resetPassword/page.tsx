"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

type ResetPasswordForm = {
  currentPassword: string;
  newPassword: string;
};

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <section
        className="relative z-10 overflow-hidden pt-36 pb-16 md:pb-20 lg:pt-[170px] lg:pb-24 opacity-0 animate-[rpSectionIn_.6s_ease-out_forwards]"
        style={{ marginTop: "-60px" }}
      >
        <div className="container">
          <div className="-mx-4 flex flex-wrap justify-center">
            <div className="w-full px-4">
              <div
                className="
                  mx-auto w-full max-w-[92%] sm:max-w-[520px]
                  rounded-2xl border border-white/20
                  bg-white/10 p-6 shadow-three backdrop-blur-xl
                  ring-1 ring-white/10
                  dark:border-white/10 dark:bg-white/5 dark:ring-white/10
                  sm:p-8
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
          0% { opacity: 0; transform: translateY(18px) scale(0.98); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes rpItemUp {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}

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
      <path
        d="M10.5 10.7a3.5 3.5 0 0 0 4.8 4.8"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M6.7 6.8C4.2 8.5 2.5 12 2.5 12s3.5 7 9.5 7c1.7 0 3.2-.4 4.5-1"
        stroke="currentColor"
        strokeWidth="1.7"
      />
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
        <div className="text-center text-body-color dark:text-body-color-dark opacity-0 animate-[rpItemUp_.6s_ease-out_forwards]">
          Loading...
        </div>
      </Shell>
    );
  }

  if (!token) {
    return (
      <Shell>
        <h3 className="mb-2 text-center text-xl font-bold text-black dark:text-white opacity-0 animate-[rpItemUp_.6s_ease-out_forwards]">
          Sign in required
        </h3>
        <p className="text-body-color dark:text-body-color-dark mb-6 text-center text-sm opacity-0 animate-[rpItemUp_.6s_ease-out_forwards] [animation-delay:120ms]">
          You must sign in to reset your password.
        </p>
        <button
          onClick={() => router.push("/signin")}
          className="
            shadow-submit dark:shadow-submit-dark
            bg-primary hover:bg-primary/90
            w-full rounded-xl px-10 py-3.5
            text-sm font-semibold text-white
            transition duration-300
            opacity-0 animate-[rpItemUp_.6s_ease-out_forwards] [animation-delay:200ms]
          "
        >
          Go to Sign In
        </button>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="mx-auto mb-5 flex h-11 w-11 items-center justify-center rounded-full bg-white/20 text-black dark:bg-white/10 dark:text-white opacity-0 animate-[rpItemUp_.6s_ease-out_forwards]">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
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
      </div>

      <h1 className="mb-1 text-center text-2xl font-bold text-black dark:text-white opacity-0 animate-[rpItemUp_.6s_ease-out_forwards] [animation-delay:120ms]">
        Reset Password
      </h1>
      <p className="text-body-color dark:text-body-color-dark mb-7 text-center text-sm font-medium opacity-0 animate-[rpItemUp_.6s_ease-out_forwards] [animation-delay:200ms]">
        Enter your current password and a new one.
      </p>

      {success && (
        <div className="mb-5 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-700 dark:text-green-400 opacity-0 animate-[rpItemUp_.6s_ease-out_forwards]">
          {success}
        </div>
      )}

      {error && (
        <div className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400 opacity-0 animate-[rpItemUp_.6s_ease-out_forwards]">
          {error}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-5">
        <div className="opacity-0 animate-[rpItemUp_.6s_ease-out_forwards] [animation-delay:260ms]">
          <label className="mb-2 block text-sm font-semibold text-black dark:text-white">
            Current Password
          </label>

          <div className="flex items-center gap-3 rounded-xl border border-white/20 bg-white/10 px-4 py-3 dark:border-white/10 dark:bg-white/5 transition duration-300 focus-within:scale-[1.01]">
            <input
              type={showCurrent ? "text" : "password"}
              value={form.currentPassword}
              onChange={(e) =>
                setForm({ ...form, currentPassword: e.target.value })
              }
              required
              className="w-full bg-transparent text-sm text-black outline-none placeholder:text-black/50 dark:text-white dark:placeholder:text-white/40"
              placeholder="Enter current password"
            />

            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => setShowCurrent((v) => !v)}
              className="opacity-80 hover:opacity-100 transition"
              aria-label="Toggle current password visibility"
            >
              <EyeIcon open={showCurrent} />
            </button>
          </div>
        </div>

        <div className="opacity-0 animate-[rpItemUp_.6s_ease-out_forwards] [animation-delay:340ms]">
          <label className="mb-2 block text-sm font-semibold text-black dark:text-white">
            New Password
          </label>

          <div className="flex items-center gap-3 rounded-xl border border-white/20 bg-white/10 px-4 py-3 dark:border-white/10 dark:bg-white/5 transition duration-300 focus-within:scale-[1.01]">
            <input
              type={showNew ? "text" : "password"}
              value={form.newPassword}
              onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
              required
              className="w-full bg-transparent text-sm text-black outline-none placeholder:text-black/50 dark:text-white dark:placeholder:text-white/40"
              placeholder="Enter new password"
            />

            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => setShowNew((v) => !v)}
              className="opacity-80 hover:opacity-100 transition"
              aria-label="Toggle new password visibility"
            >
              <EyeIcon open={showNew} />
            </button>
          </div>

          <p className="text-body-color dark:text-body-color-dark mt-2 text-xs">
            Minimum 8 characters.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 opacity-0 animate-[rpItemUp_.6s_ease-out_forwards] [animation-delay:420ms]">
          <button
            type="button"
            onClick={() => router.back()}
            className="
              rounded-xl border border-white/20 bg-white/10
              px-6 py-3 text-sm font-semibold text-black
              transition duration-300 hover:bg-white/15
              dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10
            "
          >
            Back
          </button>

          <button
            type="submit"
            disabled={saving}
            className="
              shadow-submit dark:shadow-submit-dark
              bg-primary hover:bg-primary/90
              rounded-xl px-6 py-3
              text-sm font-semibold text-white
              transition duration-300
              disabled:opacity-60
            "
          >
            {saving ? "Saving..." : "Confirm"}
          </button>
        </div>
      </form>
    </Shell>
  );
}