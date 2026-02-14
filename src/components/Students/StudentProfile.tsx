"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

type StudentProfile = {
  // student fields
  studentId?: number | string;
  StudentId?: number | string;

  universityName?: string;
  UniversityName?: string;

  birthDate?: string; // ISO
  BirthDate?: string;

  // user fields
  userId?: number | string;
  UserId?: number | string;

  fullName?: string;
  FullName?: string;

  email?: string;
  Email?: string;

  phoneNumber?: string;
  PhoneNumber?: string;

  userRole?: string;
  UserRole?: string;
};

/* =========================
   Shell (OUTSIDE component)
========================= */
function Shell({ children }: { children: React.ReactNode }) {
  return (
    <section
      className="relative z-10 overflow-hidden pt-36 pb-16 md:pb-20 lg:pt-[170px] lg:pb-24"
      style={{ marginTop: "-60px" }}
    >
      <div className="container">
        <div className="-mx-4 flex flex-wrap justify-center">
          <div className="w-full px-4">
            <div
              className="
                mx-auto w-full max-w-[92%] sm:max-w-[680px]
                rounded-2xl
                border border-white/20
                bg-white/10
                p-6 sm:p-8
                shadow-three
                backdrop-blur-xl
                ring-1 ring-white/10
                dark:border-white/10
                dark:bg-white/5
                dark:ring-white/10
              "
            >
              {children}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function formatDob(value: string | undefined) {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleDateString();
}

function InfoCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <div
      className="
        rounded-2xl border border-white/20 bg-white/10
        px-4 py-4
        shadow-sm
        transition duration-300
        hover:bg-white/15 hover:border-white/30
        dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10
      "
    >
      <div className="flex items-start gap-3">
        {icon ? (
          <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 text-black dark:bg-white/10 dark:text-white">
            {icon}
          </div>
        ) : null}

        <div className="min-w-0">
          <p className="text-xs font-semibold text-black dark:text-white">
            {label}
          </p>
          <p className="text-body-color dark:text-body-color-dark mt-1 break-words text-sm">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

function LoadingBlock({ text }: { text: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-10">
      <div className="flex items-center gap-2">
        <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-black/60 dark:bg-white/80 [animation-delay:-0.2s]" />
        <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-black/60 dark:bg-white/80 [animation-delay:-0.1s]" />
        <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-black/60 dark:bg-white/80" />
      </div>
      <p className="text-sm font-semibold text-body-color dark:text-body-color-dark">
        {text}
      </p>
    </div>
  );
}

function DividerTitle({ title }: { title: string }) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <h3 className="text-sm font-semibold text-black dark:text-white">
        {title}
      </h3>
      <div className="h-px flex-1 bg-white/10 dark:bg-white/10 ml-3" />
    </div>
  );
}

export default function StudentProfilePage() {
  const router = useRouter();

  const [profile, setProfile] = useState<StudentProfile | null>(null);
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

    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await apiFetch(
          "https://localhost:7145/api/Users/GetStudentProfile",
          { method: "GET" },
          router
        );

        if (res.status === 404) {
          setProfile(null);
          return;
        }

        if (!res.ok) {
          const t = await res.text().catch(() => "");
          throw new Error(t || `Failed (${res.status})`);
        }

        const data = (await res.json().catch(() => null)) as StudentProfile | null;
        setProfile(data);
      } catch (e: any) {
        setError(e?.message || "Failed to load.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [token, router]);

  if (loading) {
    return (
      <Shell>
        <LoadingBlock text="Loading profile..." />
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

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            onClick={() => router.push("/")}
            className="
              w-full rounded-xl border border-white/20 bg-white/10
              px-6 py-3 text-sm font-semibold text-black
              transition duration-300 hover:bg-white/15
              dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10
            "
          >
            Back
          </button>

          <button
            onClick={() => window.location.reload()}
            className="
              shadow-submit dark:shadow-submit-dark
              bg-primary hover:bg-primary/90
              w-full rounded-xl px-6 py-3
              text-sm font-semibold text-white transition duration-300
            "
          >
            Retry
          </button>
        </div>
      </Shell>
    );
  }

  if (!profile) {
    return (
      <Shell>
        <div className="text-center text-body-color dark:text-body-color-dark">
          Profile not found.
        </div>

        <button
          onClick={() => router.push("/")}
          className="
            mt-6 block w-full rounded-xl
            border border-white/20 bg-white/10
            px-10 py-3.5 text-center text-sm font-semibold text-black
            transition duration-300 hover:bg-white/15
            dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10
          "
        >
          Back
        </button>
      </Shell>
    );
  }

  // ✅ read values with fallback
  const studentId = profile.studentId ?? profile.StudentId ?? "-";
  const universityName = profile.universityName ?? profile.UniversityName ?? "-";
  const birthDateRaw = profile.birthDate ?? profile.BirthDate;

  const userId = profile.userId ?? profile.UserId ?? "-";
  const fullName = profile.fullName ?? profile.FullName ?? "-";
  const email = profile.email ?? profile.Email ?? "-";
  const phone = profile.phoneNumber ?? profile.PhoneNumber ?? "-";
  const role = profile.userRole ?? profile.UserRole ?? "Student";

  return (
    <Shell>
      {/* Header */}
      <div className="mb-6 text-center">
        <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/20 text-black dark:bg-white/10 dark:text-white">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 12a4.5 4.5 0 1 0-4.5-4.5A4.5 4.5 0 0 0 12 12Zm0 2.25c-4.2 0-7.5 2.1-7.5 4.5v.75h15v-.75c0-2.4-3.3-4.5-7.5-4.5Z"
              fill="currentColor"
              opacity="0.9"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-black dark:text-white">
          Student Profile
        </h1>
        <p className="text-body-color dark:text-body-color-dark mt-1 text-sm font-medium">
          Your student and account information.
        </p>
      </div>

      {/* Content */}
      <div className="space-y-7">
        {/* Student Info */}
        <div>
          <DividerTitle title="Student Information" />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <InfoCard
              label="Student ID"
              value={String(studentId)}
              icon={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M4 7.5 12 3l8 4.5-8 4.5L4 7.5Z"
                    fill="currentColor"
                    opacity="0.9"
                  />
                  <path
                    d="M4 10.5 12 15l8-4.5V17l-8 4-8-4v-6.5Z"
                    fill="currentColor"
                    opacity="0.35"
                  />
                </svg>
              }
            />

            <InfoCard
              label="University Name"
              value={String(universityName)}
              icon={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M3 9.5 12 4l9 5.5-9 5.5L3 9.5Z"
                    fill="currentColor"
                    opacity="0.9"
                  />
                  <path
                    d="M6.5 11.5V19h11V11.5l-5.5 3.2-5.5-3.2Z"
                    fill="currentColor"
                    opacity="0.35"
                  />
                </svg>
              }
            />

            <InfoCard
              label="Date of Birth"
              value={formatDob(birthDateRaw)}
              icon={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M7 2v2M17 2v2"
                    stroke="currentColor"
                    strokeWidth="2"
                    opacity="0.9"
                  />
                  <path
                    d="M6 4h12a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    opacity="0.35"
                  />
                  <path
                    d="M3 9h18"
                    stroke="currentColor"
                    strokeWidth="2"
                    opacity="0.6"
                  />
                </svg>
              }
            />
          </div>
        </div>

        {/* User Info */}
        <div>
          <DividerTitle title="Account Information" />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <InfoCard
              label="User ID"
              value={String(userId)}
              icon={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z"
                    fill="currentColor"
                    opacity="0.9"
                  />
                  <path
                    d="M4 21a8 8 0 0 1 16 0"
                    fill="currentColor"
                    opacity="0.35"
                  />
                </svg>
              }
            />

            <InfoCard
              label="Full Name"
              value={String(fullName)}
              icon={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M4 20h16"
                    stroke="currentColor"
                    strokeWidth="2"
                    opacity="0.35"
                  />
                  <path
                    d="M7 17c2-3 8-3 10 0"
                    stroke="currentColor"
                    strokeWidth="2"
                    opacity="0.9"
                  />
                  <path
                    d="M12 5a3 3 0 1 1-3 3 3 3 0 0 1 3-3Z"
                    fill="currentColor"
                    opacity="0.6"
                  />
                </svg>
              }
            />

            <InfoCard
              label="Email"
              value={String(email)}
              icon={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M4 6h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    opacity="0.35"
                  />
                  <path
                    d="m4 8 8 6 8-6"
                    stroke="currentColor"
                    strokeWidth="2"
                    opacity="0.9"
                  />
                </svg>
              }
            />

            <InfoCard
              label="Phone Number"
              value={String(phone)}
              icon={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M7 3h10a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    opacity="0.35"
                  />
                  <path
                    d="M10 18h4"
                    stroke="currentColor"
                    strokeWidth="2"
                    opacity="0.9"
                  />
                </svg>
              }
            />

            <InfoCard
              label="Role"
              value={String(role)}
              icon={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 2 20 6v6c0 5-3.4 9.3-8 10-4.6-.7-8-5-8-10V6l8-4Z"
                    fill="currentColor"
                    opacity="0.35"
                  />
                  <path
                    d="M12 6v10"
                    stroke="currentColor"
                    strokeWidth="2"
                    opacity="0.9"
                  />
                  <path
                    d="M8.5 10.5h7"
                    stroke="currentColor"
                    strokeWidth="2"
                    opacity="0.9"
                  />
                </svg>
              }
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2">
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

        <button
          onClick={() => router.push("/students/edit")}
          className="
            shadow-submit dark:shadow-submit-dark
            bg-primary hover:bg-primary/90
            rounded-xl px-6 py-3 text-sm font-semibold text-white
            transition duration-300
          "
        >
          Edit
        </button>
      </div>
    </Shell>
  );
}
