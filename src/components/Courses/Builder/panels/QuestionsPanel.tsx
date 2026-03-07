"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Field from "../shared/Field";
import MiniButton from "../shared/MiniButton";
import GlassCard from "../shared/GlassCard";
import { apiFetch } from "@/lib/api";

type QuizOption = {
  quizOptionId: number;
  text: string;
  isCorrect: boolean;
  order: number;
};

type QuizQuestion = {
  quizQuestionId: number;
  moduleQuizId: number;
  text: string;
  order: number;
  options: QuizOption[];
};

export default function QuestionsPanel({ moduleQuizId }: { moduleQuizId: number }) {
  const router = useRouter();

  const [items, setItems] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [qText, setQText] = useState("");
  const [qOrder, setQOrder] = useState<number>(1);

  const [optText, setOptText] = useState("");
  const [optOrder, setOptOrder] = useState<number>(1);
  const [optIsCorrect, setOptIsCorrect] = useState(false);
  const [selectedQuestionId, setSelectedQuestionId] = useState<number | null>(null);

  const load = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await apiFetch(
        `https://localhost:7145/api/courses/GetQuizQuestions/${moduleQuizId}`,
        { method: "GET" },
        router
      );

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(txt || `Request failed (${res.status})`);
      }

      const data: QuizQuestion[] = await res.json();
      setItems(Array.isArray(data) ? data : []);

      const nextQOrder = (data?.length ?? 0) + 1;
      setQOrder(nextQOrder);

      if (data?.length && !selectedQuestionId) {
        setSelectedQuestionId(data[0].quizQuestionId);
        const nextOptOrder = (data[0].options?.length ?? 0) + 1;
        setOptOrder(nextOptOrder);
      }
    } catch (e: any) {
      setError(e?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [moduleQuizId]);

  const createQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const body = {
        moduleQuizId,
        text: qText,
        order: qOrder,
      };

      const res = await apiFetch(
        "https://localhost:7145/api/courses/CreateQuizQuestion",
        { method: "POST", body: JSON.stringify(body) },
        router
      );

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(txt || `Request failed (${res.status})`);
      }

      setQText("");
      setQOrder((v) => v + 1);
      await load();
    } catch (e: any) {
      setError(e?.message || "Something went wrong");
    }
  };

  const createOption = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!selectedQuestionId) {
      setError("Select a question first.");
      return;
    }

    try {
      const body = {
        quizQuestionId: selectedQuestionId,
        text: optText,
        isCorrect: optIsCorrect,
        order: optOrder,
      };

      const res = await apiFetch(
        "https://localhost:7145/api/courses/CreateQuizOption",
        { method: "POST", body: JSON.stringify(body) },
        router
      );

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(txt || `Request failed (${res.status})`);
      }

      setOptText("");
      setOptIsCorrect(false);
      setOptOrder((v) => v + 1);
      await load();
    } catch (e: any) {
      setError(e?.message || "Something went wrong");
    }
  };

  const selectedQuestion = items.find((q) => q.quizQuestionId === selectedQuestionId) || null;

  useEffect(() => {
    if (!selectedQuestion) return;
    setOptOrder((selectedQuestion.options?.length ?? 0) + 1);
  }, [selectedQuestionId]);

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-2xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-300">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <GlassCard title="Questions" subtitle={`QuizId: ${moduleQuizId}`}>
          {loading ? (
            <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-6 text-center text-sm text-body-color backdrop-blur-xl dark:border-white/10 dark:bg-white/5 dark:text-body-color-dark">
              Loading...
            </div>
          ) : items.length === 0 ? (
            <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-6 text-center text-sm text-body-color backdrop-blur-xl dark:border-white/10 dark:bg-white/5 dark:text-body-color-dark">
              No questions yet.
            </div>
          ) : (
            <div className="space-y-2">
              {items.map((q) => (
                <button
                  key={q.quizQuestionId}
                  onClick={() => setSelectedQuestionId(q.quizQuestionId)}
                  className={`w-full rounded-2xl border px-4 py-3 text-left text-sm backdrop-blur-xl transition
                    ${selectedQuestionId === q.quizQuestionId
                      ? "border-primary/40 bg-primary/10 text-black dark:text-white"
                      : "border-white/15 bg-white/10 text-black hover:bg-white/15 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
                    }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0 truncate font-semibold">{q.text}</div>
                    <div className="shrink-0 text-xs opacity-70">Order {q.order}</div>
                  </div>
                  <div className="mt-1 text-xs text-body-color dark:text-body-color-dark">
                    Options: {q.options?.length ?? 0}
                  </div>
                </button>
              ))}
            </div>
          )}

          <form onSubmit={createQuestion} className="mt-5 space-y-4">
            <Field label="New Question Text">
              <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-xl transition focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/20 dark:border-white/10 dark:bg-white/5">
                <input
                  value={qText}
                  onChange={(e) => setQText(e.target.value)}
                  required
                  placeholder="e.g. What is React?"
                  className="w-full bg-transparent text-sm text-black outline-none placeholder:text-black/50 dark:text-white dark:placeholder:text-white/40"
                />
              </div>
            </Field>

            <Field label="Order">
              <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
                <input
                  type="number"
                  min={1}
                  value={qOrder}
                  onChange={(e) => setQOrder(Number(e.target.value))}
                  className="w-full bg-transparent text-sm text-black outline-none dark:text-white"
                />
              </div>
            </Field>

            <MiniButton type="submit">Create Question</MiniButton>
          </form>
        </GlassCard>

        <GlassCard
          title="Options"
          subtitle={
            selectedQuestion
              ? `QuestionId: ${selectedQuestion.quizQuestionId}`
              : "Select a question first"
          }
        >
          {!selectedQuestion ? (
            <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-6 text-center text-sm text-body-color backdrop-blur-xl dark:border-white/10 dark:bg-white/5 dark:text-body-color-dark">
              Select a question from the left.
            </div>
          ) : (
            <div className="space-y-2">
              {(selectedQuestion.options ?? []).map((o) => (
                <div
                  key={o.quizOptionId}
                  className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-black backdrop-blur-xl dark:border-white/10 dark:bg-white/5 dark:text-white"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0 truncate font-semibold">{o.text}</div>
                    <div className="shrink-0 text-xs opacity-70">Order {o.order}</div>
                  </div>
                  <div className="mt-1 text-xs text-body-color dark:text-body-color-dark">
                    {o.isCorrect ? "✅ Correct" : "❌ Not Correct"}
                  </div>
                </div>
              ))}
            </div>
          )}

          <form onSubmit={createOption} className="mt-5 space-y-4">
            <Field label="New Option Text">
              <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-xl transition focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/20 dark:border-white/10 dark:bg-white/5">
                <input
                  value={optText}
                  onChange={(e) => setOptText(e.target.value)}
                  required
                  placeholder="e.g. A JavaScript library"
                  className="w-full bg-transparent text-sm text-black outline-none placeholder:text-black/50 dark:text-white dark:placeholder:text-white/40"
                />
              </div>
            </Field>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field label="Order">
                <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
                  <input
                    type="number"
                    min={1}
                    value={optOrder}
                    onChange={(e) => setOptOrder(Number(e.target.value))}
                    className="w-full bg-transparent text-sm text-black outline-none dark:text-white"
                  />
                </div>
              </Field>

              <Field label="Is Correct?">
                <div className="flex items-center justify-between rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
                  <span className="text-sm text-black dark:text-white">
                    {optIsCorrect ? "Correct" : "Not Correct"}
                  </span>
                  <button
                    type="button"
                    onClick={() => setOptIsCorrect((v) => !v)}
                    className="rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-xs font-semibold text-black backdrop-blur-xl transition hover:bg-white/15 dark:border-white/10 dark:bg-white/5 dark:text-white"
                  >
                    Toggle
                  </button>
                </div>
              </Field>
            </div>

            <MiniButton type="submit" disabled={!selectedQuestionId}>
              Create Option
            </MiniButton>
          </form>
        </GlassCard>
      </div>
    </div>
  );
}