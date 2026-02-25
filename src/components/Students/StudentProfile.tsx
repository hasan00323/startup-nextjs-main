"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

type StudentProfile = {
  studentId?: number | string;
  StudentId?: number | string;

  universityName?: string;
  UniversityName?: string;

  birthDate?: string;
  BirthDate?: string;

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

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <section
        className="relative z-10 overflow-hidden pt-36 pb-16 md:pb-20 lg:pt-[170px] lg:pb-24 opacity-0 animate-[spSectionIn_.6s_ease-out_forwards]"
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
                opacity-0 animate-[spCardIn_.7s_ease-out_forwards]
              "
              >
                {children}
              </div>
            </div>
          </div>
        </div>
      </section>
      <style>{`
        @keyframes spSectionIn {
          0% { opacity: 0; transform: translateY(12px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes spCardIn {
          0% { opacity: 0; transform: translateY(18px) scale(0.98); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes spItemUp {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          * {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>
    </>
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
        opacity-0 animate-[spItemUp_.6s_ease-out_forwards]
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
    <div className="flex flex-col items-center justify-center gap-3 py-10 opacity-0 animate-[spItemUp_.6s_ease-out_forwards]">
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
    <div className="mb-3 flex items-center justify-between opacity-0 animate-[spItemUp_.6s_ease-out_forwards]">
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

        const data = (await res.json().catch(() => null)) as
          | StudentProfile
          | null;
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
        <h3 className="mb-2 text-center text-xl font-bold text-black dark:text-white opacity-0 animate-[spItemUp_.6s_ease-out_forwards]">
          Something went wrong
        </h3>
        <p className="text-body-color dark:text-body-color-dark mb-6 text-center text-sm opacity-0 animate-[spItemUp_.6s_ease-out_forwards] [animation-delay:120ms]">
          {error}
        </p>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
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
            onClick={() => window.location.reload()}
            className="
            shadow-submit dark:shadow-submit-dark
            bg-primary hover:bg-primary/90
            rounded-xl px-6 py-3 text-sm font-semibold text-white
            transition duration-300
          "
          >
            Retry
          </button>
        </div>
      </Shell>
    );
  }

  const studentId = profile?.studentId ?? profile?.StudentId ?? "-";
  const universityName = profile?.universityName ?? profile?.UniversityName ?? "-";
  const birthDate = formatDob(profile?.birthDate ?? profile?.BirthDate);

  const userId = profile?.userId ?? profile?.UserId ?? "-";
  const fullName = profile?.fullName ?? profile?.FullName ?? "-";
  const email = profile?.email ?? profile?.Email ?? "-";
  const phone = profile?.phoneNumber ?? profile?.PhoneNumber ?? "-";
  const role = profile?.userRole ?? profile?.UserRole ?? "-";

  return (
    <Shell>
      <div className="mb-7 text-center opacity-0 animate-[spItemUp_.6s_ease-out_forwards]">
        <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/20 text-black dark:bg-white/10 dark:text-white">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 12a4.5 4.5 0 1 0-4.5-4.5A4.5 4.5 0 0 0 12 12Zm0 2.25c-4.2 0-7.5 2.1-7.5 4.5v.75h15v-.75c0-2.4-3.3-4.5-7.5-4.5Z"
              fill="currentColor"
              opacity="0.9"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-black dark:text-white opacity-0 animate-[spItemUp_.6s_ease-out_forwards] [animation-delay:120ms]">
          Student Profile
        </h1>
        <p className="text-body-color dark:text-body-color-dark mt-1 text-sm font-medium opacity-0 animate-[spItemUp_.6s_ease-out_forwards] [animation-delay:200ms]">
          Your student and account information.
        </p>
      </div>

      <div className="space-y-7 opacity-0 animate-[spItemUp_.6s_ease-out_forwards] [animation-delay:260ms]">
        <div>
          <DividerTitle title="Student Information" />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <InfoCard
              label="Student ID"
              value={String(studentId)}
              icon={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M4 7h16"
                    stroke="currentColor"
                    strokeWidth="2"
                    opacity="0.35"
                  />
                  <path
                    d="M4 17h16"
                    stroke="currentColor"
                    strokeWidth="2"
                    opacity="0.35"
                  />
                  <path
                    d="M7 10h10"
                    stroke="currentColor"
                    strokeWidth="2"
                    opacity="0.9"
                  />
                  <path
                    d="M7 14h6"
                    stroke="currentColor"
                    strokeWidth="2"
                    opacity="0.9"
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
                    d="M3 10.5 12 5l9 5.5-9 5.5-9-5.5Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    opacity="0.35"
                  />
                  <path
                    d="M6 12.5V19h12v-6.5"
                    stroke="currentColor"
                    strokeWidth="2"
                    opacity="0.9"
                  />
                  <path
                    d="M10 19v-6h4v6"
                    stroke="currentColor"
                    strokeWidth="2"
                    opacity="0.9"
                  />
                </svg>
              }
            />

            <InfoCard
              label="Birth Date"
              value={String(birthDate)}
              icon={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M7 3v3"
                    stroke="currentColor"
                    strokeWidth="2"
                    opacity="0.9"
                  />
                  <path
                    d="M17 3v3"
                    stroke="currentColor"
                    strokeWidth="2"
                    opacity="0.9"
                  />
                  <path
                    d="M4 7h16"
                    stroke="currentColor"
                    strokeWidth="2"
                    opacity="0.35"
                  />
                  <path
                    d="M5 7v14h14V7"
                    stroke="currentColor"
                    strokeWidth="2"
                    opacity="0.35"
                  />
                  <path
                    d="M8 11h2v2H8v-2Z"
                    fill="currentColor"
                    opacity="0.6"
                  />
                  <path
                    d="M12 11h2v2h-2v-2Z"
                    fill="currentColor"
                    opacity="0.6"
                  />
                  <path
                    d="M16 11h2v2h-2v-2Z"
                    fill="currentColor"
                    opacity="0.6"
                  />
                </svg>
              }
            />

            <InfoCard
              label="User Role"
              value={String(role)}
              icon={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 2 4 6v6c0 5 3.4 9.4 8 10 4.6-.6 8-5 8-10V6l-8-4Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    opacity="0.35"
                  />
                  <path
                    d="M9 12l2 2 4-5"
                    stroke="currentColor"
                    strokeWidth="2"
                    opacity="0.9"
                  />
                </svg>
              }
            />
          </div>
        </div>

        <div>
          <DividerTitle title="Account Information" />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <InfoCard
              label="User ID"
              value={String(userId)}
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
          </div>
        </div>
      </div>

      <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2 opacity-0 animate-[spItemUp_.6s_ease-out_forwards] [animation-delay:320ms]">
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