"use client";

import { useEffect, useState } from "react";
import { getErrorMessage } from "@/lib/errors";
import { getAllCourses } from "@/services/courseService";

export function useCourses() {
  const [courses, setCourses] = useState<any[]>([]);
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
