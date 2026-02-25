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

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1],
      staggerChildren: 0.08,
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

  const Shell = ({ children }: { children: React.ReactNode }) => (
    <section
      className="relative z-10 overflow-hidden pt-36 pb-16 md:pb-20 lg:pt-[170px] lg:pb-24"
      style={{ marginTop: "-60px" }}
    >
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
                sm:max-w-[520px]
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

  if (loading) {
    return (
      <Shell>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="text-center text-body-color dark:text-body-color-dark"
        >
          Loading...
        </motion.div>
      </Shell>
    );
  }

  if (!form) {
    return (
      <Shell>
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="text-center text-body-color dark:text-body-color-dark"
        >
          Profile not found.
        </motion.div>

        <motion.button
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          onClick={() => router.push("/admin/profile")}
          className="
            mt-6 block w-full rounded-xl
            border border-white/20 bg-white/10
            px-10 py-3.5 text-center text-sm font-semibold text-black
            transition duration-300 hover:bg-white/15
            dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10
          "
        >
          Back
        </motion.button>
      </Shell>
    );
  }

  return (
    <Shell>
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto mb-5 flex h-11 w-11 items-center justify-center rounded-full bg-white/20 text-black dark:bg-white/10 dark:text-white"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 12a4.5 4.5 0 1 0-4.5-4.5A4.5 4.5 0 0 0 12 12Zm0 2.25c-4.2 0-7.5 2.1-7.5 4.5v.75h15v-.75c0-2.4-3.3-4.5-7.5-4.5Z"
            fill="currentColor"
            opacity="0.9"
          />
        </svg>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="mb-1 text-center text-2xl font-bold text-black dark:text-white"
      >
        Update Admin Profile
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.05, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="text-body-color dark:text-body-color-dark mb-7 text-center text-sm font-medium"
      >
        Update your account details then save.
      </motion.p>

      {success && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="mb-5 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-700 dark:text-green-400"
        >
          {success}
        </motion.div>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400"
        >
          {error}
        </motion.div>
      )}

      <motion.form
        onSubmit={onSubmit}
        className="space-y-5"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={fadeItem}>
          <label className="mb-2 block text-sm font-semibold text-black dark:text-white">
            Full Name
          </label>
          <div className="flex items-center gap-3 rounded-xl border border-white/20 bg-white/10 px-4 py-3 dark:border-white/10 dark:bg-white/5">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="opacity-70">
              <path
                d="M12 12a4.5 4.5 0 1 0-4.5-4.5A4.5 4.5 0 0 0 12 12Z"
                stroke="currentColor"
                strokeWidth="1.7"
              />
              <path
                d="M4.5 20.25c.8-3 4-5 7.5-5s6.7 2 7.5 5"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
              />
            </svg>

            <input
              type="text"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              required
              className="
                w-full bg-transparent text-sm text-black outline-none
                placeholder:text-black/50
                dark:text-white dark:placeholder:text-white/40
              "
            />
          </div>
        </motion.div>

        <motion.div variants={fadeItem}>
          <label className="mb-2 block text-sm font-semibold text-black dark:text-white">
            Email
          </label>
          <div className="flex items-center gap-3 rounded-xl border border-white/20 bg-white/10 px-4 py-3 dark:border-white/10 dark:bg-white/5">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="opacity-70">
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
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              className="
                w-full bg-transparent text-sm text-black outline-none
                placeholder:text-black/50
                dark:text-white dark:placeholder:text-white/40
              "
            />
          </div>
        </motion.div>

        <motion.div variants={fadeItem}>
          <label className="mb-2 block text-sm font-semibold text-black dark:text-white">
            Phone Number
          </label>
          <div className="flex items-center gap-3 rounded-xl border border-white/20 bg-white/10 px-4 py-3 dark:border-white/10 dark:bg-white/5">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="opacity-70">
              <path
                d="M7 4h10v16H7V4Z"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinejoin="round"
              />
              <path
                d="M10 17h4"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
              />
            </svg>

            <input
              type="text"
              value={form.phoneNumber}
              onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
              className="
                w-full bg-transparent text-sm text-black outline-none
                placeholder:text-black/50
                dark:text-white dark:placeholder:text-white/40
              "
              placeholder="Optional"
            />
          </div>
        </motion.div>

        <motion.button
          variants={fadeItem}
          type="submit"
          disabled={saving || !!success}
          className="
            shadow-submit dark:shadow-submit-dark
            bg-primary hover:bg-primary/90
            w-full rounded-xl px-10 py-3.5
            text-sm font-semibold text-white
            transition duration-300
            disabled:opacity-60
          "
        >
          {saving ? "Saving..." : success ? "Saved" : "Save Changes"}
        </motion.button>

        <motion.button
          variants={fadeItem}
          type="button"
          onClick={() => router.push("/admin/profile")}
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
          Cancel
        </motion.button>
      </motion.form>
    </Shell>
  );
};

export default UpdateAdminProfilePage;