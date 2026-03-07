"use client";

import React, { useState } from "react";
import Field from "../shared/Field";
import MiniButton from "../shared/MiniButton";
import { apiFetch } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function SectionsPanel({
  courseModuleId,
  onDone,
}: {
  courseModuleId: number;
  onDone: () => void;
}) {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [contentType, setContentType] = useState<number>(0);
  const [contentUrl, setContentUrl] = useState<string>("");
  const [durationSeconds, setDurationSeconds] = useState<number>(0);
  const [order, setOrder] = useState<number>(1);
  const [isPreview, setIsPreview] = useState<boolean>(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const body = {
        courseModuleId,
        title,
        contentType,
        contentUrl: contentUrl.trim() === "" ? null : contentUrl,
        durationSeconds,
        order,
        isPreview,
      };

      const res = await apiFetch(
        "https://localhost:7145/api/courses/CreateSection",
        { method: "POST", body: JSON.stringify(body) },
        router
      );

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(txt || `Request failed (${res.status})`);
      }

      setTitle("");
      setContentUrl("");
      setDurationSeconds(0);
      setOrder((v) => v + 1);
      onDone();
    } catch (e: any) {
      setError(e?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-5">
      {error && (
        <div className="rounded-2xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-300">
          {error}
        </div>
      )}

      <Field label="Create Section">
        <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
          <div className="text-xs text-body-color dark:text-body-color-dark">
            CourseModuleId: <span className="font-semibold">{courseModuleId}</span>
          </div>
        </div>
      </Field>

      <Field label="Title">
        <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-xl transition focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/20 dark:border-white/10 dark:bg-white/5">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="e.g. Section 1: Introduction"
            className="w-full bg-transparent text-sm text-black outline-none placeholder:text-black/50 dark:text-white dark:placeholder:text-white/40"
          />
        </div>
      </Field>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Field label="Content Type">
          <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
            <input
              type="number"
              min={0}
              value={contentType}
              onChange={(e) => setContentType(Number(e.target.value))}
              className="w-full bg-transparent text-sm text-black outline-none dark:text-white"
            />
          </div>
        </Field>

        <Field label="Duration Seconds">
          <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
            <input
              type="number"
              min={0}
              value={durationSeconds}
              onChange={(e) => setDurationSeconds(Number(e.target.value))}
              className="w-full bg-transparent text-sm text-black outline-none dark:text-white"
            />
          </div>
        </Field>
      </div>

      <Field label="Content URL (optional)">
        <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-xl transition focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/20 dark:border-white/10 dark:bg-white/5">
          <input
            value={contentUrl}
            onChange={(e) => setContentUrl(e.target.value)}
            placeholder="https://..."
            className="w-full bg-transparent text-sm text-black outline-none placeholder:text-black/50 dark:text-white dark:placeholder:text-white/40"
          />
        </div>
      </Field>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Field label="Order">
          <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
            <input
              type="number"
              min={1}
              value={order}
              onChange={(e) => setOrder(Number(e.target.value))}
              className="w-full bg-transparent text-sm text-black outline-none dark:text-white"
            />
          </div>
        </Field>

        <Field label="Is Preview?">
          <div className="flex items-center justify-between rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
            <span className="text-sm text-black dark:text-white">
              {isPreview ? "Preview" : "Normal"}
            </span>
            <button
              type="button"
              onClick={() => setIsPreview((v) => !v)}
              className="rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-xs font-semibold text-black backdrop-blur-xl transition hover:bg-white/15 dark:border-white/10 dark:bg-white/5 dark:text-white"
            >
              Toggle
            </button>
          </div>
        </Field>
      </div>

      <MiniButton type="submit" disabled={loading}>
        {loading ? "Creating..." : "Create Section"}
      </MiniButton>
    </form>
  );
}