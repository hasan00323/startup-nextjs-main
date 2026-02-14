"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

type StudentProfile = {
  studentId?: number | string;
  StudentId?: number | string;

  universityName?: string;
  UniversityName?: string;

  birthDate?: string; // ISO
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

type UpdateStudentProfileRequest = {
  fullName: string;
  phoneNumber: string;
  universityName: string;
  birthDate: string; // yyyy-mm-dd
};

const GET_PROFILE_URL = "https://localhost:7145/api/Users/GetStudentProfile";
const UPDATE_PROFILE_URL = "https://localhost:7145/api/Users/UpdateStudentProfile";

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
                mx-auto w-full max-w-[92%] sm:max-w-[620px]
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

function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-black dark:text-white">
        {label}
      </label>
      {children}
      {hint ? (
        <p className="text-xs text-body-color dark:text-body-color-dark">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

function normalizeToDateInput(value?: string) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

async function readErrorMessage(res: Response) {
  // يدعم ProblemDetails + ModelState errors
  try {
    const ct = res.headers.get("content-type") || "";
    if (ct.includes("application/json")) {
      const j: any = await res.json().catch(() => null);
      if (!j) return `Failed (${res.status})`;

      // ASP.NET ProblemDetails
      if (j?.title && j?.errors) {
        const firstKey = Object.keys(j.errors)[0];
        const firstErr = Array.isArray(j.errors[firstKey]) ? j.errors[firstKey][0] : null;
        return firstErr || j.title || `Failed (${res.status})`;
      }

      if (typeof j?.message === "string") return j.message;
      if (typeof j?.error === "string") return j.error;
      return j?.title || `Failed (${res.status})`;
    }

    const t = await res.text().catch(() => "");
    return t?.trim() || `Failed (${res.status})`;
  } catch {
    return `Failed (${res.status})`;
  }
}

function LoadingOverlay({ text }: { text: string }) {
  return (
    <div className="relative">
      <div className="absolute inset-0 z-20 rounded-2xl bg-black/20 backdrop-blur-sm" />
      <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-3">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-white/80 [animation-delay:-0.2s]" />
          <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-white/80 [animation-delay:-0.1s]" />
          <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-white/80" />
        </div>
        <p className="text-sm font-semibold text-white">{text}</p>
      </div>
      <div className="opacity-40 pointer-events-none select-none">{/* spacer */}</div>
    </div>
  );
}

export default function UpdateStudentProfilePage() {
  const router = useRouter();

  const [profile, setProfile] = useState<StudentProfile | null>(null);

  const [form, setForm] = useState<UpdateStudentProfileRequest>({
    fullName: "",
    phoneNumber: "",
    universityName: "",
    birthDate: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

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
      setSuccessMsg(null);

      try {
        const res = await apiFetch(GET_PROFILE_URL, { method: "GET" }, router);

        if (res.status === 404) {
          setProfile(null);
          setError("Profile not found.");
          return;
        }

        if (!res.ok) {
          throw new Error(await readErrorMessage(res));
        }

        const data = (await res.json().catch(() => null)) as StudentProfile | null;
        if (!data) {
          setProfile(null);
          setError("Profile not found.");
          return;
        }

        setProfile(data);

        const fullName = String(data.fullName ?? data.FullName ?? "");
        const phoneNumber = String(data.phoneNumber ?? data.PhoneNumber ?? "");
        const universityName = String(data.universityName ?? data.UniversityName ?? "");
        const birthDateRaw = String(data.birthDate ?? data.BirthDate ?? "");
        const birthDate = normalizeToDateInput(birthDateRaw);

        setForm({ fullName, phoneNumber, universityName, birthDate });
      } catch (e: any) {
        setError(e?.message || "Failed to load.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [token, router]);

  const emailValue = String(profile?.email ?? profile?.Email ?? "").trim();
  const roleValue = String(profile?.userRole ?? profile?.UserRole ?? "Student");

  const onChange =
    (key: keyof UpdateStudentProfileRequest) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSuccessMsg(null);
      setError(null);
      setForm((prev) => ({ ...prev, [key]: e.target.value }));
    };

  const validate = () => {
    if (!form.fullName.trim()) return "Full name is required.";
    if (!emailValue) return "Email is missing from profile.";
    if (!form.universityName.trim()) return "University name is required.";
    if (!form.birthDate.trim()) return "Birth date is required.";
    return null;
  };

  const updateProfileRequest = async () => {
    const payload = {
      fullName: form.fullName,
      phoneNumber: form.phoneNumber,
      universityName: form.universityName,
      birthDate: form.birthDate, 
      email: emailValue, 
    };

    let res = await apiFetch(
      UPDATE_PROFILE_URL,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
      router
    );

    // 405 => fallback to POST
    if (res.status === 405) {
      res = await apiFetch(
        UPDATE_PROFILE_URL,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
        router
      );
    }

    return res;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const v = validate();
    if (v) {
      setError(v);
      setSuccessMsg(null);
      return;
    }

    setSaving(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const res = await updateProfileRequest();

      if (res.status === 401) {
        router.push("/signin");
        return;
      }

      if (!res.ok) {
        throw new Error(await readErrorMessage(res));
      }

      setSuccessMsg("Profile updated successfully ✅");

      setProfile((p) => {
        if (!p) return p;
        return {
          ...p,
          fullName: form.fullName,
          FullName: form.fullName,
          phoneNumber: form.phoneNumber,
          PhoneNumber: form.phoneNumber,
          universityName: form.universityName,
          UniversityName: form.universityName,
          birthDate: form.birthDate,
          BirthDate: form.birthDate,
          email: emailValue,
          Email: emailValue,
        };
      });
      router.replace("/students/profile");
    } catch (e: any) {
      setError(e?.message || "Update failed.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Shell>
        <div className="flex flex-col items-center justify-center gap-3 py-10">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-black/60 dark:bg-white/80 [animation-delay:-0.2s]" />
            <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-black/60 dark:bg-white/80 [animation-delay:-0.1s]" />
            <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-black/60 dark:bg-white/80" />
          </div>
          <p className="text-sm font-semibold text-body-color dark:text-body-color-dark">
            Loading profile...
          </p>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="relative">
        {saving ? <LoadingOverlay text="Saving changes..." /> : null}

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
            Update Profile
          </h1>
          <p className="mt-1 text-sm font-medium text-body-color dark:text-body-color-dark">
            Edit your student and account information.
          </p>
        </div>

        {/* Alerts */}
        {error ? (
          <div className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        ) : null}

        {successMsg ? (
          <div className="mb-5 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-700 dark:text-green-400">
            {successMsg}
          </div>
        ) : null}

        {/* Form */}
        <form onSubmit={onSubmit} className="space-y-5">
          {/* Layout improved: two columns on desktop */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Full Name">
              <input
                value={form.fullName}
                onChange={onChange("fullName")}
                className="
                  w-full rounded-xl border border-white/20 bg-white/10
                  px-4 py-3 text-sm text-black outline-none
                  placeholder:text-black/50
                  focus:border-white/30 focus:ring-2 focus:ring-white/10
                  dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-white/50
                "
                placeholder="Your full name"
                autoComplete="name"
              />
            </Field>

            <Field label="Email" hint="Email is not editable here.">
              <input
                value={emailValue}
                readOnly
                className="
                  w-full cursor-not-allowed rounded-xl border border-white/20 bg-white/10
                  px-4 py-3 text-sm text-black/70 outline-none
                  dark:border-white/10 dark:bg-white/5 dark:text-white/60
                "
              />
            </Field>

            <Field label="Phone Number">
              <input
                value={form.phoneNumber}
                onChange={onChange("phoneNumber")}
                className="
                  w-full rounded-xl border border-white/20 bg-white/10
                  px-4 py-3 text-sm text-black outline-none
                  placeholder:text-black/50
                  focus:border-white/30 focus:ring-2 focus:ring-white/10
                  dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-white/50
                "
                placeholder="+9627..."
                autoComplete="tel"
              />
            </Field>

            <Field label="University Name">
              <input
                value={form.universityName}
                onChange={onChange("universityName")}
                className="
                  w-full rounded-xl border border-white/20 bg-white/10
                  px-4 py-3 text-sm text-black outline-none
                  placeholder:text-black/50
                  focus:border-white/30 focus:ring-2 focus:ring-white/10
                  dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-white/50
                "
                placeholder="University name"
              />
            </Field>

            <Field label="Date of Birth">
              <input
                type="date"
                value={form.birthDate}
                onChange={onChange("birthDate")}
                className="
                  w-full rounded-xl border border-white/20 bg-white/10
                  px-4 py-3 text-sm text-black outline-none
                  focus:border-white/30 focus:ring-2 focus:ring-white/10
                  dark:border-white/10 dark:bg-white/5 dark:text-white
                "
              />
            </Field>

            <Field label="Role">
              <input
                value={roleValue}
                readOnly
                className="
                  w-full cursor-not-allowed rounded-xl border border-white/20 bg-white/10
                  px-4 py-3 text-sm text-black/70 outline-none
                  dark:border-white/10 dark:bg-white/5 dark:text-white/60
                "
              />
            </Field>
          </div>

          {/* Buttons */}
          <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => router.push("/students/profile")}
              className="
                rounded-xl border border-white/20 bg-white/10
                px-6 py-3 text-sm font-semibold text-black
                transition duration-300 hover:bg-white/15
                dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10
              "
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="
                shadow-submit dark:shadow-submit-dark
                bg-primary hover:bg-primary/90
                rounded-xl px-6 py-3 text-sm font-semibold text-white
                transition duration-300
                disabled:opacity-60 disabled:cursor-not-allowed
              "
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>

          <button
            type="button"
            onClick={() => router.push("/auth/resetPassword")}
            className="
              mt-1 block w-full rounded-xl
              border border-white/20 bg-white/10
              px-6 py-3 text-sm font-semibold text-black
              transition duration-300 hover:bg-white/15
              dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10
            "
          >
            Reset Password
          </button>
        </form>
      </div>
    </Shell>
  );
}
