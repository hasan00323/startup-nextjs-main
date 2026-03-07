"use client";

import React, { useState } from "react";
import Field from "../shared/Field";
import MiniButton from "../shared/MiniButton";
import { apiFetch } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function TracksPanel({
  courseId,
  onDone,
}: {
  courseId: number;
  onDone: () => void;
}) {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [order, setOrder] = useState<number>(1);
  const [isRequired, setIsRequired] = useState<boolean>(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const body = {
        courseId,
        title,
        description: description.trim() === "" ? null : description,
        order,
        isRequired,
      };

      const res = await apiFetch(
        "https://localhost:7145/api/courses/CreateTrack",
        { method: "POST", body: JSON.stringify(body) },
        router
      );

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(txt || `Request failed (${res.status})`);
      }

      setTitle("");
      setDescription("");
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

      <Field label="Create Track (Sub Course)">
        <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
          <div className="text-xs text-body-color dark:text-body-color-dark">
            CourseId: <span className="font-semibold">{courseId}</span>
          </div>
        </div>
      </Field>

      <Field label="Title">
        <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-xl transition focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/20 dark:border-white/10 dark:bg-white/5">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="e.g. Track 1: Basics"
            className="w-full bg-transparent text-sm text-black outline-none placeholder:text-black/50 dark:text-white dark:placeholder:text-white/40"
          />
        </div>
      </Field>

      <Field label="Description (optional)">
        <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-xl transition focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/20 dark:border-white/10 dark:bg-white/5">
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Short track description..."
            className="w-full resize-none bg-transparent text-sm text-black outline-none placeholder:text-black/50 dark:text-white dark:placeholder:text-white/40"
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

        <Field label="Is Required?">
          <div className="flex items-center justify-between rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
            <span className="text-sm text-black dark:text-white">
              {isRequired ? "Required" : "Optional"}
            </span>
            <button
              type="button"
              onClick={() => setIsRequired((v) => !v)}
              className="rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-xs font-semibold text-black backdrop-blur-xl transition hover:bg-white/15 dark:border-white/10 dark:bg-white/5 dark:text-white"
            >
              Toggle
            </button>
          </div>
        </Field>
      </div>

      <MiniButton type="submit" disabled={loading}>
        {loading ? "Creating..." : "Create Track"}
      </MiniButton>
    </form>
  );
}