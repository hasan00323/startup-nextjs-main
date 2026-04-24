"use client";

import { useCallback, useEffect, useState } from "react";
import { getErrorMessage } from "@/lib/errors";
import {
  createCourse,
  deleteCourse,
  getAllCourses,
  getCourse,
  getCourseStructure,
  isoLocalNow,
  updateCourse,
  type CourseForm,
  type CreateCourseForm,
} from "@/services/courseService";
import type { CourseStructureDto } from "@/components/Courses/types";
import type { CourseListItem } from "@/components/Courses/types";
import { useRequireAuth } from "@/hooks/useRequireAuth";

export function useCourses() {
  const [courses, setCourses] = useState<CourseListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getAllCourses();
        if (!cancelled) setCourses(data);
      } catch (error) {
        if (!cancelled) setError(getErrorMessage(error, "Failed to load courses."));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  return { courses, loading, error };
}

export function useCreateCourse() {
  const { router, token, isAuthenticated } = useRequireAuth();
  const [form, setForm] = useState<CreateCourseForm>(() => ({
    title: "",
    description: "",
    price: 0,
    startDate: isoLocalNow(),
    endDate: isoLocalNow(),
    categoryId: 1,
  }));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated && token === null) router.push("/signin");
  }, [isAuthenticated, router, token]);

  const updateField = <K extends keyof CreateCourseForm>(name: K, value: CreateCourseForm[K]) => {
    setError(null);
    setForm((current) => ({ ...current, [name]: value }));
  };

  const submit = async () => {
    setLoading(true);
    setError(null);

    try {
      await createCourse(form, router);
      return true;
    } catch (error) {
      setError(getErrorMessage(error, "Something went wrong"));
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { form, loading, error, updateField, submit, router };
}

export function useEditCourse(id: string) {
  const { router, token, isAuthenticated } = useRequireAuth();
  const [form, setForm] = useState<CourseForm | null>(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id || !isAuthenticated) return;

    let cancelled = false;

    const load = async () => {
      setPageLoading(true);
      setError(null);

      try {
        const course = await getCourse(id, router);
        if (!cancelled) setForm(course);
      } catch (error) {
        if (!cancelled) setError(getErrorMessage(error, "Failed to load course"));
      } finally {
        if (!cancelled) setPageLoading(false);
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [id, isAuthenticated, router, token]);

  const updateField = <K extends keyof CourseForm>(name: K, value: CourseForm[K]) => {
    setError(null);
    setForm((current) => (current ? { ...current, [name]: value } : current));
  };

  const submit = async () => {
    if (!form) return false;

    setSaving(true);
    setError(null);

    try {
      await updateCourse(id, form, router);
      return true;
    } catch (error) {
      setError(getErrorMessage(error, "Something went wrong"));
      return false;
    } finally {
      setSaving(false);
    }
  };

  return { form, pageLoading, saving, error, updateField, submit, router };
}

export function useDeleteCourse(id: string) {
  const { router } = useRequireAuth();
  const [error, setError] = useState<string | null>(null);

  const remove = useCallback(async () => {
    setError(null);

    try {
      await deleteCourse(id, router);
      return true;
    } catch (error) {
      setError(getErrorMessage(error, "Failed to delete course"));
      return false;
    }
  }, [id, router]);

  return { error, remove, router };
}

export function useCourseStructure(courseId: number) {
  const [loading, setLoading] = useState(true);
  const [structure, setStructure] = useState<CourseStructureDto | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!courseId || Number.isNaN(courseId)) {
      setError("Invalid course id.");
      setLoading(false);
      return;
    }

    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        setStructure(await getCourseStructure(courseId));
      } catch (error) {
        setError(getErrorMessage(error, "Something went wrong"));
        setStructure(null);
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [courseId]);

  return { loading, structure, error };
}
