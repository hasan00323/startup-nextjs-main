"use client";

import React from "react";

export default function GlassCard({
  children,
  title,
  subtitle,
}: {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}) {
  return (
    <div
      className="
        rounded-3xl
        border border-white/15
        bg-white/10
        p-6 sm:p-8
        shadow-2xl
        backdrop-blur-2xl
        ring-1 ring-white/10
        dark:border-white/10
        dark:bg-white/5
      "
    >
      {(title || subtitle) && (
        <div className="mb-6">
          {title && (
            <h2 className="text-xl font-bold text-black dark:text-white">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="mt-1 text-sm text-body-color dark:text-body-color-dark">
              {subtitle}
            </p>
          )}
        </div>
      )}
      {children}
    </div>
  );
}