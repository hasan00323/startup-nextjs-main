"use client";

import type { ChangeEvent, FormEvent, ReactNode } from "react";
import { useUpdateStudentProfile } from "@/hooks/useStudentProfile";

const inputClass =
  "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition duration-300 placeholder:text-gray-500 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50";
const readOnlyClass =
  "w-full cursor-not-allowed rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3 text-sm text-gray-500 outline-none";

export default function UpdateStudentProfilePage() {
  const {
    profile,
    form,
    loading,
    saving,
    feedback,
    updateField,
    submit,
    router,
  } = useUpdateStudentProfile();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    updateField(event.target.name as keyof typeof form, event.target.value);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const updated = await submit();
    if (updated) {
      window.setTimeout(() => router.push("/students/profile"), 1200);
    }
  };

  if (loading) {
    return (
      <Shell>
        <LoadingState />
      </Shell>
    );
  }

  return (
    <Shell>
      {saving && <LoadingOverlay text="Saving changes..." />}

      <div className="mb-8 text-center opacity-0 animate-[spFadeUp_.5s_ease-out_forwards]">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/10 text-blue-500 ring-1 ring-blue-500/20">
          <EditIcon />
        </div>
        <h1 className="text-2xl font-bold text-white">Update Profile</h1>
        <p className="mt-1 text-sm text-gray-400">Keep your information up to date.</p>
      </div>

      {feedback && (
        <div
          className={`mb-6 rounded-xl border px-4 py-3 text-sm opacity-0 animate-[spFadeUp_.3s_ease-out_forwards] ${
            feedback.type === "error"
              ? "border-red-500/30 bg-red-500/10 text-red-400"
              : "border-green-500/30 bg-green-500/10 text-green-400"
          }`}
        >
          {feedback.text}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-6 opacity-0 animate-[spFadeUp_.6s_ease-out_forwards] [animation-delay:150ms]"
      >
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="Full Name">
            <input
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              className={inputClass}
              placeholder="Your full name"
              required
            />
          </Field>

          <Field label="Email Address" hint="Email cannot be changed here.">
            <input value={profile?.email ?? ""} readOnly className={readOnlyClass} />
          </Field>

          <Field label="Phone Number">
            <input
              name="phoneNumber"
              value={form.phoneNumber}
              onChange={handleChange}
              className={inputClass}
              placeholder="+9627..."
              required
            />
          </Field>

          <Field label="Date of Birth">
            <input
              type="date"
              name="birthDate"
              value={form.birthDate}
              onChange={handleChange}
              required
              className={`${inputClass} [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert-[0.6]`}
            />
          </Field>

          <Field label="University Name">
            <input
              name="universityName"
              value={form.universityName}
              onChange={handleChange}
              className={inputClass}
              placeholder="Your university"
              required
            />
          </Field>

          <Field label="Account Role">
            <input value={profile?.userRole ?? "Student"} readOnly className={readOnlyClass} />
          </Field>
        </div>

        <div className="flex flex-col gap-3 pt-4 sm:flex-row">
          <button
            type="button"
            onClick={() => router.push("/students/profile")}
            className="flex-1 rounded-xl bg-white/5 px-6 py-3.5 text-sm font-semibold text-white ring-1 ring-white/10 transition hover:bg-white/10"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex-1 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-500 disabled:opacity-50"
          >
            Save Changes
          </button>
        </div>

        <button
          type="button"
          onClick={() => router.push("/auth/resetPassword")}
          className="w-full rounded-xl bg-white/5 px-6 py-3.5 text-sm font-semibold text-gray-400 ring-1 ring-white/10 transition hover:bg-white/10 hover:text-white"
        >
          Reset Password
        </button>
      </form>
    </Shell>
  );
}

function Shell({ children }: { children: ReactNode }) {
  return (
    <>
      <section className="relative z-10 flex min-h-screen items-center justify-center bg-[#0B0F19] pt-32 pb-16 lg:pt-[150px]">
        <div className="pointer-events-none absolute top-1/3 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/20 blur-[120px]" />
        <div className="container px-4">
          <div className="relative mx-auto w-full max-w-[680px] rounded-3xl border border-white/10 bg-white/[0.03] p-6 opacity-0 shadow-2xl ring-1 ring-white/5 backdrop-blur-2xl animate-[spScaleIn_.6s_ease-out_forwards] sm:p-10">
            {children}
          </div>
        </div>
      </section>
      <style>{`
        @keyframes spScaleIn { 0% { opacity: 0; transform: translateY(20px) scale(0.98); } 100% { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes spFadeUp { 0% { opacity: 0; transform: translateY(15px); } 100% { opacity: 1; transform: translateY(0); } }
        @keyframes pulseSoft { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
      `}</style>
    </>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-semibold tracking-wide text-gray-300 uppercase">
        {label}
      </label>
      {children}
      {hint && <p className="pl-1 text-xs text-gray-500">{hint}</p>}
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-20">
      <div className="relative h-16 w-16">
        <div className="absolute inset-0 animate-spin rounded-full border-t-2 border-blue-500" />
        <div
          className="absolute inset-2 animate-spin rounded-full border-r-2 border-purple-500 border-opacity-50"
          style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
        />
      </div>
      <p className="animate-[pulseSoft_2s_ease-in-out_infinite] font-medium text-gray-400">
        Loading data...
      </p>
    </div>
  );
}

function LoadingOverlay({ text }: { text: string }) {
  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center rounded-3xl bg-[#0B0F19]/80 backdrop-blur-sm animate-[spFadeUp_.2s_ease-out]">
      <div className="mb-4 flex items-center gap-2">
        <span className="h-3 w-3 animate-bounce rounded-full bg-blue-500 [animation-delay:-0.3s]" />
        <span className="h-3 w-3 animate-bounce rounded-full bg-blue-500 [animation-delay:-0.15s]" />
        <span className="h-3 w-3 animate-bounce rounded-full bg-blue-500" />
      </div>
      <p className="text-sm font-semibold text-white">{text}</p>
    </div>
  );
}

function EditIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
      <path
        d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
