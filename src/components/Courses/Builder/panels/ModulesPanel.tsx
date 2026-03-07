"use client";

import React, { useState } from "react";
import Field from "../shared/Field";
import MiniButton from "../shared/MiniButton";
import { apiFetch } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function ModulesPanel({
  courseTrackId,
  onDone,
}: {
  courseTrackId: number;
  onDone: () => void;
}) {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [order, setOrder] = useState<number>(1);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const body = {
        courseTrackId,
        title,
        description: description.trim() === "" ? null : description,
        order,
      };

      const res = await apiFetch(
        "https://localhost:7145/api/courses/CreateModule",
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

      <Field label="Create Module">
        <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
          <div className="text-xs text-body-color dark:text-body-color-dark">
            CourseTrackId: <span className="font-semibold">{courseTrackId}</span>
          </div>
        </div>
      </Field>

      <Field label="Title">
        <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-xl transition focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/20 dark:border-white/10 dark:bg-white/5">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="e.g. Module 1: Components"
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
            placeholder="Short module description..."
            className="w-full resize-none bg-transparent text-sm text-black outline-none placeholder:text-black/50 dark:text-white dark:placeholder:text-white/40"
          />
        </div>
      </Field>

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

      <MiniButton type="submit" disabled={loading}>
        {loading ? "Creating..." : "Create Module"}
      </MiniButton>
    </form>
  );
}