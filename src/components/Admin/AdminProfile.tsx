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

const fadeItem: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const AdminProfilePage = () => {
  const router = useRouter();

  const [profile, setProfile] = useState<AdminProfile | null>(null);
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

    setLoading(true);
    setError(null);

    apiFetch(
      "https://localhost:7145/api/Users/SystemAdminProfile",
      {
        method: "GET",
      },
      router
    )
      .then(async (res) => {
        if (!res.ok) {
          const t = await res.text().catch(() => "");
          throw new Error(t || `Failed (${res.status})`);
        }
        return res.json();
      })
      .then((data) => setProfile(data))
      .catch((e) => setError(e?.message || "Failed to load"))
      .finally(() => setLoading(false));
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

  if (loading) {
    return (
      <Shell>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="text-center text-body-color dark:text-body-color-dark"
        >
          Loading...
        </motion.div>
      </Shell>
    );
  }

  if (error) {
    return (
      <Shell>
        <motion.h3
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-2 text-center text-xl font-bold text-black dark:text-white"
        >
          Something went wrong
        </motion.h3>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400"
        >
          {error}
        </motion.div>

        <button
          onClick={() => router.push("/")}
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
          Back
        </button>
      </Shell>
    );
  }

  if (!profile) {
    return (
      <Shell>
        <div className="text-center text-body-color dark:text-body-color-dark">
          Profile not found.
        </div>
      </Shell>
    );
  }

  const userId = profile.userId ?? profile.UserId ?? "-";
  const fullName = profile.fullName ?? profile.FullName ?? "-";
  const email = profile.email ?? profile.Email ?? "-";
  const phone = profile.phoneNumber ?? profile.PhoneNumber ?? "-";

  return (
    <Shell>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
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
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-1 text-center text-2xl font-bold text-black dark:text-white"
      >
        Admin Profile
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-body-color dark:text-body-color-dark mb-7 text-center text-sm font-medium"
      >
        Your system admin account information.
      </motion.p>

      <motion.div
        variants={fadeContainer}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        {[
          { label: "User ID", value: userId },
          { label: "Full Name", value: fullName },
          { label: "Email", value: email },
          { label: "Phone Number", value: phone },
        ].map((item, i) => (
          <motion.div
            key={i}
            variants={fadeItem}
            className="rounded-xl border border-white/20 bg-white/10 px-4 py-4 dark:border-white/10 dark:bg-white/5"
          >
            <p className="text-xs font-semibold text-black dark:text-white">
              {item.label}
            </p>
            <p className="text-body-color dark:text-body-color-dark mt-2 text-sm">
              {String(item.value)}
            </p>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2"
      >
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
          onClick={() => router.push("/admin/profile/edit")}
          className="
            shadow-submit dark:shadow-submit-dark
            bg-primary hover:bg-primary/90
            rounded-xl px-6 py-3 text-sm font-semibold text-white
            transition duration-300
          "
        >
          Edit
        </button>
      </motion.div>
    </Shell>
  );
};

export default AdminProfilePage;