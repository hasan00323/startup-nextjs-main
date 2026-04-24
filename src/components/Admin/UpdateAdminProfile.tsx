"use client";

import { useUpdateAdminProfile } from "@/hooks/useAdminProfile";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";

const fadeContainer: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1], staggerChildren: 0.08 },
  },
};

const fadeItem: Variants = {
  hidden: { opacity: 0, x: -18 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
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
              variants={fadeContainer}
              initial="hidden"
              animate="visible"
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
          Loading your data...
        </p>
      </div>
    </Shell>
  );
}

const UpdateAdminProfilePage = () => {
  const { form, loading, saving, feedback, updateField, submit, router } =
    useUpdateAdminProfile();

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const saved = await submit();

    if (saved) {
      setTimeout(() => router.push("/admin/profile?updated=1"), 1200);
    }
  };

  if (loading) return <LoadingState />;

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
            We could not retrieve your information.
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

  return (
    <Shell>
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

      {feedback && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mb-6 flex items-center gap-3 rounded-2xl border px-5 py-4 text-sm font-medium ${
            feedback.type === "success"
              ? "border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-400"
              : "border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400"
          }`}
        >
          {feedback.text}
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
          <label className="mb-2 block text-sm font-bold text-black dark:text-white">
            Full Name
          </label>
          <div className="flex items-center gap-3 rounded-xl border border-black/10 bg-white/50 px-4 py-3.5 transition duration-300 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary dark:border-white/10 dark:bg-white/5">
            <input
              type="text"
              value={form.fullName}
              onChange={(event) => updateField("fullName", event.target.value)}
              required
              className="w-full bg-transparent text-sm font-medium text-black outline-none placeholder:text-black/40 dark:text-white dark:placeholder:text-white/40"
              placeholder="John Doe"
            />
          </div>
        </motion.div>

        <motion.div variants={fadeItem}>
          <label className="mb-2 block text-sm font-bold text-black dark:text-white">
            Email Address
          </label>
          <div className="flex items-center gap-3 rounded-xl border border-black/10 bg-white/50 px-4 py-3.5 transition duration-300 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary dark:border-white/10 dark:bg-white/5">
            <input
              type="email"
              value={form.email}
              onChange={(event) => updateField("email", event.target.value)}
              required
              className="w-full bg-transparent text-sm font-medium text-black outline-none placeholder:text-black/40 dark:text-white dark:placeholder:text-white/40"
              placeholder="admin@futuredev.com"
            />
          </div>
        </motion.div>

        <motion.div variants={fadeItem}>
          <label className="mb-2 block text-sm font-bold text-black dark:text-white">
            Phone Number <span className="text-xs font-normal text-black/50 dark:text-white/50">(Optional)</span>
          </label>
          <div className="flex items-center gap-3 rounded-xl border border-black/10 bg-white/50 px-4 py-3.5 transition duration-300 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary dark:border-white/10 dark:bg-white/5">
            <input
              type="text"
              value={form.phoneNumber}
              onChange={(event) => updateField("phoneNumber", event.target.value)}
              className="w-full bg-transparent text-sm font-medium text-black outline-none placeholder:text-black/40 dark:text-white dark:placeholder:text-white/40"
              placeholder="+962 7..."
            />
          </div>
        </motion.div>

        <motion.div variants={fadeItem} className="mt-8 grid grid-cols-1 gap-4 pt-4 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => router.push("/admin/profile")}
            disabled={saving}
            className="flex w-full items-center justify-center rounded-xl border border-black/10 bg-white px-6 py-3.5 text-sm font-bold text-black shadow-sm transition duration-300 hover:bg-gray-50 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving || feedback?.type === "success"}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-primary/30 transition duration-300 hover:bg-primary/90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving..." : feedback?.type === "success" ? "Saved" : "Save Changes"}
          </button>
        </motion.div>
      </motion.form>
    </Shell>
  );
};

export default UpdateAdminProfilePage;
