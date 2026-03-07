"use client";

import React from "react";

export default function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-black dark:text-white">
        {label}
      </label>
      {children}
      {hint && (
        <p className="mt-2 text-xs text-body-color dark:text-body-color-dark">
          {hint}
        </p>
      )}
    </div>
  );
}