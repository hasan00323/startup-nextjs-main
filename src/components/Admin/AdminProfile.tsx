"use client";

import { useAdminProfile } from "@/hooks/useAdminProfile";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";

const fadeContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const fadeItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
  },
};

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <section
      className="relative z-10 min-h-[80vh] overflow-hidden pt-36 pb-16 md:pb-20 lg:pt-[170px] lg:pb-24"
      style={{ marginTop: "-60px" }}
    >
      <div className="absolute left-1/2 top-10 -z-10 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />

      <div className="container">
        <div className="-mx-4 flex flex-wrap justify-center">
          <div className="w-full px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="mx-auto w-full max-w-[92%] rounded-[2rem] border border-black/5 bg-white/80 p-8 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-[#0B1220]/80 sm:max-w-[650px] sm:p-10"
            >
              {children}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function LoadingState() {
  return (
    <Shell>
      <div className="flex flex-col items-center justify-center py-10">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" />
          <span className="h-3 w-3 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]" />
          <span className="h-3 w-3 animate-bounce rounded-full bg-primary" />
        </div>
        <p className="mt-4 text-sm font-semibold text-body-color dark:text-body-color-dark">
          Loading profile...
        </p>
      </div>
    </Shell>
  );
}

function ErrorState({
  error,
  onBack,
}: {
  error: string;
  onBack: () => void;
}) {
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
          Access Denied
        </h3>
        <div className="mb-8 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-600 dark:text-red-400">
          {error}
        </div>
        <button
          onClick={onBack}
          className="w-full rounded-xl bg-primary px-8 py-3.5 text-sm font-bold text-white shadow-lg transition duration-300 hover:bg-primary/90 active:scale-[0.98]"
        >
          Return to Dashboard
        </button>
      </motion.div>
    </Shell>
  );
}

const AdminProfilePage = () => {
  const { profile, loading, error, router } = useAdminProfile();

  if (loading) return <LoadingState />;

  if (error) {
    return <ErrorState error={error} onBack={() => router.push("/")} />;
  }

  if (!profile) {
    return (
      <Shell>
        <div className="py-10 text-center font-medium text-body-color dark:text-body-color-dark">
          Profile data could not be found.
        </div>
      </Shell>
    );
  }

  const profileData = [
    {
      label: "Full Name",
      value: profile.fullName || "-",
      icon: <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />,
    },
    {
      label: "Email Address",
      value: profile.email || "-",
      icon: <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />,
    },
    {
      label: "Phone Number",
      value: profile.phoneNumber || "-",
      icon: <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />,
    },
    {
      label: "System ID",
      value: profile.userId || "-",
      icon: <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />,
    },
  ];

  return (
    <Shell>
      <div className="mb-10 text-center">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-tr from-primary to-blue-400 text-white shadow-lg"
        >
          <span className="text-3xl font-extrabold">
            {profile.fullName.charAt(0).toUpperCase()}
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-3xl font-extrabold text-black dark:text-white"
        >
          Administrator
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-2 flex items-center justify-center gap-2"
        >
          <span className="flex h-2 w-2 animate-pulse rounded-full bg-green-500" />
          <span className="text-sm font-semibold text-body-color dark:text-body-color-dark">
            System Access Granted
          </span>
        </motion.div>
      </div>

      <motion.div
        variants={fadeContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2"
      >
        {profileData.map((item) => (
          <motion.div
            key={item.label}
            variants={fadeItem}
            className="group rounded-2xl border border-black/5 bg-white/50 p-5 transition-all duration-300 hover:bg-white hover:shadow-md dark:border-white/5 dark:bg-white/5 dark:hover:bg-white/10"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary dark:bg-primary/20">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  {item.icon}
                </svg>
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold uppercase tracking-wider text-black/50 dark:text-white/50">
                  {item.label}
                </p>
                <p className="mt-1 truncate text-sm font-semibold text-black dark:text-white">
                  {String(item.value)}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, ease: "easeOut" }}
        className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2"
      >
        <button
          onClick={() => router.push("/")}
          className="flex items-center justify-center gap-2 rounded-xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black shadow-sm transition duration-300 hover:bg-gray-50 active:scale-[0.98] dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
        >
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Dashboard
        </button>

        <button
          onClick={() => router.push("/admin/profile/edit")}
          className="flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 text-sm font-bold text-white shadow-lg shadow-primary/30 transition duration-300 hover:bg-primary/90 active:scale-[0.98]"
        >
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
          Edit Profile
        </button>
      </motion.div>
    </Shell>
  );
};

export default AdminProfilePage;
