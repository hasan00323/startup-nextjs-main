"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";

type AdminProfile = {
  userId?: number | string;
  UserId?: number | string;
  fullName?: string;
  FullName?: string;
  email?: string;
  Email?: string;
  phoneNumber?: string;
  PhoneNumber?: string;
};

type AdminProfileForm = {
  fullName: string;
  email: string;
  phoneNumber: string;
};

const fadeContainer: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

// تم إضافة staggerContainer الذي كان مفقوداً
const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1],
      staggerChildren: 0.08, // التتابع الزمني لظهور العناصر
    },
  },
};

const fadeItem: Variants = {
  hidden: { opacity: 0, x: -18 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.45,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const UpdateAdminProfilePage = () => {
  const router = useRouter();

  const [form, setForm] = useState<AdminProfileForm | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [success, setSuccess] = useState<string | null>(null);

  const token = useMemo(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
  }, []);

  useEffect(() => {
    if (!token) {
      router.push("/signin");
      return;
    }

    let cancelled = false;

    const loadProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        setSuccess(null);

        const res = await apiFetch(
          "https://localhost:7145/api/Users/SystemAdminProfile",
          { method: "GET" },
          router
        );

        if (!res.ok) {
          const t = await res.text().catch(() => "");
          throw new Error(t || `Failed (${res.status})`);
        }

        const data: AdminProfile = await res.json();

        const fullName = (data?.fullName ?? data?.FullName ?? "") as string;
        const email = (data?.email ?? data?.Email ?? "") as string;
        const phoneNumber = (data?.phoneNumber ?? data?.PhoneNumber ?? "") as string;

        if (!cancelled) {
          setForm({ fullName, email, phoneNumber });
        }
      } catch (e: any) {
        if (!cancelled) {
          setError(e?.message || "Failed to load.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, [token, router]);

  // مكون الغلاف الخارجي (Shell) المحدث مع تأثير زجاجي
  const Shell = ({ children }: { children: React.ReactNode }) => (
    <section
      className="relative z-10 min-h-[80vh] overflow-hidden pt-36 pb-16 md:pb-20 lg:pt-[170px] lg:pb-24"
      style={{ marginTop: "-60px" }}
    >
      {/* تأثير التوهج الخلفي (Glow Effect) */}
      <div className="absolute left-1/2 top-10 -z-10 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]"></div>

      <div className="container">
        <div className="-mx-4 flex flex-wrap justify-center">
          <div className="w-full px-4">
            <motion.div
              variants={fadeContainer}
              initial="hidden"
              animate="visible"
              className="
                mx-auto
                w-full
                max-w-[92%]
                sm:max-w-[650px]
                rounded-[2rem]
                border border-black/5
                bg-white/80
                p-8
                shadow-2xl
                backdrop-blur-xl
                dark:border-white/10
                dark:bg-[#0B1220]/80
                sm:p-10
              "
            >
              {children}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const tokenNow = localStorage.getItem("token");
      if (!tokenNow) {
        router.push("/signin");
        return;
      }

      const payload = {
        FullName: form.fullName,
        Email: form.email,
        PhoneNumber: form.phoneNumber,
      };

      const res = await fetch("https://localhost:7145/api/Users/UpdateAdminProfile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenNow}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const t = await res.text().catch(() => "");
        throw new Error(t || `Update failed (${res.status})`);
      }

      setSuccess("Profile updated successfully.");

      setTimeout(() => {
        router.push("/admin/profile?updated=1");
      }, 1200);
    } catch (err: any) {
      setError(err?.message || "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  // حالة التحميل (Loading State)
  if (loading) {
    return (
      <Shell>
        <div className="flex flex-col items-center justify-center py-10">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" />
            <span className="h-3 w-3 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]" />
            <span className="h-3 w-3 animate-bounce rounded-full bg-primary" />
          </div>
          <p className="mt-4 text-sm font-semibold text-body-color dark:text-body-color-dark">
            Loading your data...
          </p>
        </div>
      </Shell>
    );
  }

  // حالة عدم وجود بيانات (Not Found State)
  if (!form) {
    return (
      <Shell>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-500">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="mb-2 text-2xl font-bold text-black dark:text-white">
            Profile Not Found
          </h3>
          <p className="mb-8 text-body-color dark:text-body-color-dark">
            We couldn't retrieve your information.
          </p>
          <button
            onClick={() => router.push("/admin/profile")}
            className="w-full rounded-xl bg-primary px-8 py-3.5 text-sm font-bold text-white shadow-lg transition duration-300 hover:bg-primary/90 active:scale-[0.98]"
          >
            Go Back
          </button>
        </motion.div>
      </Shell>
    );
  }

  // الواجهة الرئيسية (Main UI)
  return (
    <Shell>
      {/* Header */}
      <div className="mb-8 text-center">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-tr from-primary to-blue-400 text-white shadow-lg"
        >
          <svg width="30" height="30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-2 text-3xl font-extrabold text-black dark:text-white"
        >
          Update Settings
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-sm font-medium text-body-color dark:text-body-color-dark"
        >
          Modify your administrator profile details.
        </motion.p>
      </div>

      {/* Alerts */}
      {success && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex items-center gap-3 rounded-2xl border border-green-500/30 bg-green-500/10 px-5 py-4 text-sm font-medium text-green-700 dark:text-green-400"
        >
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          {success}
        </motion.div>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex items-center gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-sm font-medium text-red-600 dark:text-red-400"
        >
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          {error}
        </motion.div>
      )}

      {/* Form */}
      <motion.form
        onSubmit={onSubmit}
        className="space-y-5"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {/* Full Name */}
        <motion.div variants={fadeItem}>
          <label className="mb-2 block text-sm font-bold text-black dark:text-white">
            Full Name
          </label>
          <div className="flex items-center gap-3 rounded-xl border border-black/10 bg-white/50 px-4 py-3.5 transition duration-300 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary dark:border-white/10 dark:bg-white/5 dark:focus-within:border-primary/50 dark:focus-within:ring-primary/50">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" className="text-black/50 dark:text-white/50" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <input
              type="text"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              required
              className="w-full bg-transparent text-sm font-medium text-black outline-none placeholder:text-black/40 dark:text-white dark:placeholder:text-white/40"
              placeholder="John Doe"
            />
          </div>
        </motion.div>

        {/* Email */}
        <motion.div variants={fadeItem}>
          <label className="mb-2 block text-sm font-bold text-black dark:text-white">
            Email Address
          </label>
          <div className="flex items-center gap-3 rounded-xl border border-black/10 bg-white/50 px-4 py-3.5 transition duration-300 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary dark:border-white/10 dark:bg-white/5 dark:focus-within:border-primary/50 dark:focus-within:ring-primary/50">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" className="text-black/50 dark:text-white/50" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              className="w-full bg-transparent text-sm font-medium text-black outline-none placeholder:text-black/40 dark:text-white dark:placeholder:text-white/40"
              placeholder="admin@futuredev.com"
            />
          </div>
        </motion.div>

        {/* Phone Number */}
        <motion.div variants={fadeItem}>
          <label className="mb-2 block text-sm font-bold text-black dark:text-white">
            Phone Number <span className="text-xs font-normal text-black/50 dark:text-white/50">(Optional)</span>
          </label>
          <div className="flex items-center gap-3 rounded-xl border border-black/10 bg-white/50 px-4 py-3.5 transition duration-300 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary dark:border-white/10 dark:bg-white/5 dark:focus-within:border-primary/50 dark:focus-within:ring-primary/50">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" className="text-black/50 dark:text-white/50" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <input
              type="text"
              value={form.phoneNumber}
              onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
              className="w-full bg-transparent text-sm font-medium text-black outline-none placeholder:text-black/40 dark:text-white dark:placeholder:text-white/40"
              placeholder="+962 7..."
            />
          </div>
        </motion.div>

        {/* Buttons in a Grid for better layout */}
        <motion.div variants={fadeItem} className="mt-8 grid grid-cols-1 gap-4 pt-4 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => router.push("/admin/profile")}
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
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Saved
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </motion.div>
      </motion.form>
    </Shell>
  );
};

export default UpdateAdminProfilePage;