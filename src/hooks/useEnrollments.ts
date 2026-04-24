"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getErrorMessage } from "@/lib/errors";
import {
  type CreateEnrollmentForm,
  type Enrollment,
} from "@/models/enrollment";
import {
  createEnrollment,
  deleteEnrollmentById,
  deleteEnrollmentByStudentCourse,
  getAllEnrollments,
  getMyEnrollments,
  getStudentEnrollments,
} from "@/services/enrollmentService";
import { useRequireAuth } from "@/hooks/useRequireAuth";

type Feedback = { type: "error" | "success"; text: string } | null;

function useEnrollmentList(loader: () => Promise<Enrollment[]>, fallbackError: string) {
  const { router, token, isAuthenticated } = useRequireAuth();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!isAuthenticated) return;

    setLoading(true);
    setError(null);

    try {
      setEnrollments(await loader());
    } catch (error) {
      setError(getErrorMessage(error, fallbackError));
    } finally {
      setLoading(false);
    }
  }, [fallbackError, isAuthenticated, loader]);

  useEffect(() => {
    void load();
  }, [load, token]);

  return { enrollments, loading, error, reload: load, router };
}

export function useAllEnrollments() {
  const { router } = useRequireAuth();
  const loader = useCallback(() => getAllEnrollments(router), [router]);
  return useEnrollmentList(loader, "Something went wrong");
}

export function useMyEnrollments() {
  const { router } = useRequireAuth();
  const loader = useCallback(() => getMyEnrollments(router), [router]);
  return useEnrollmentList(loader, "Failed to load enrollments.");
}

export function useStudentEnrollments(studentId: string) {
  const { router, token, isAuthenticated } = useRequireAuth();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingKey, setDeletingKey] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!studentId || !isAuthenticated) return;

    setLoading(true);
    setError(null);

    try {
      setEnrollments(await getStudentEnrollments(studentId, router));
    } catch (error) {
      setError(getErrorMessage(error, "Something went wrong"));
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, router, studentId]);

  useEffect(() => {
    void load();
  }, [load, token]);

  const deleteStudentCourse = async (key: string, courseId: string | number) => {
    setDeletingKey(key);

    try {
      await deleteEnrollmentByStudentCourse(studentId, courseId, router);
      await load();
      return true;
    } catch (error) {
      setError(getErrorMessage(error, "Failed to delete enrollment"));
      return false;
    } finally {
      setDeletingKey(null);
    }
  };

  return { enrollments, loading, error, deletingKey, deleteStudentCourse, reload: load, router };
}

export function useCreateEnrollment() {
  const { router, token, isAuthenticated } = useRequireAuth();
  const [form, setForm] = useState<CreateEnrollmentForm>(() => ({
    studentId: "",
    courseId: "",
    createdAt: new Date().toISOString().slice(0, 16),
  }));
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);

  useEffect(() => {
    if (!isAuthenticated && token === null) router.push("/signin");
  }, [isAuthenticated, router, token]);

  const isValid = useMemo(
    () => Boolean(form.studentId && form.courseId && form.createdAt),
    [form.courseId, form.createdAt, form.studentId]
  );

  const updateField = (name: keyof CreateEnrollmentForm, value: string | number) => {
    setFeedback(null);
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const submit = async () => {
    if (!isValid) {
      setFeedback({ type: "error", text: "Please fill in all required fields." });
      return false;
    }

    setLoading(true);
    setFeedback(null);

    try {
      await createEnrollment(
        {
          studentId: Number(form.studentId),
          courseId: Number(form.courseId),
          createdAt: new Date(form.createdAt).toISOString(),
        },
        router
      );
      setFeedback({ type: "success", text: "Enrollment created successfully. Redirecting..." });
      return true;
    } catch (error) {
      setFeedback({
        type: "error",
        text: getErrorMessage(error, "Something went wrong. Please try again."),
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { form, loading, feedback, updateField, submit, router };
}

export function useDeleteEnrollment(id: string) {
  const { router, token, isAuthenticated } = useRequireAuth();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) router.push("/enrollments");
    if (!isAuthenticated && token === null) router.push("/signin");
  }, [id, isAuthenticated, router, token]);

  const remove = async () => {
    if (!id) return false;

    setSubmitting(true);
    setError(null);

    try {
      await deleteEnrollmentById(id, router);
      return true;
    } catch (error) {
      setError(getErrorMessage(error, "Failed to delete enrollment"));
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  return { submitting, error, remove, router };
}
