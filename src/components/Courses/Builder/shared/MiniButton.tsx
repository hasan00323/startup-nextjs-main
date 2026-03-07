"use client";

import React from "react";

export default function MiniButton({
  children,
  onClick,
  variant = "primary",
  disabled,
  type = "button",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "ghost" | "danger";
  disabled?: boolean;
  type?: "button" | "submit";
}) {
  const base =
    "w-full rounded-2xl px-5 py-3 text-center text-sm font-semibold transition active:scale-[0.99] disabled:opacity-60";

  const styles =
    variant === "primary"
      ? "bg-primary text-white hover:bg-primary/90"
      : variant === "danger"
      ? "bg-red-600 text-white hover:bg-red-600/90"
      : "border border-white/20 bg-white/10 text-black backdrop-blur-xl hover:bg-white/15 hover:border-white/30 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10";

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${base} ${styles}`}>
      {children}
    </button>
  );
}