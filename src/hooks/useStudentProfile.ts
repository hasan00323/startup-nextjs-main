"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toDateInputValue } from "@/lib/date";
import { getErrorMessage } from "@/lib/errors";
import {
  getStudentProfile,
  updateStudentProfile,
} from "@/services/studentService";
import {
  toStudentProfileForm,
  type StudentProfile,
  type StudentProfileForm,
} from "@/models/student";
import { useRequireAuth } from "@/hooks/useRequireAuth";

type Feedback = { type: "error" | "success"; text: string } | null;

export function useStudentProfile() {
  const { router, token, isAuthenticated } = useRequireAuth();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = useCallback(async () => {
    if (!isAuthenticated) return;

    setLoading(true);
    setError(null);

    try {
      setProfile(await getStudentProfile(router));
    } catch (error) {
      setError(getErrorMessage(error, "Failed to load profile."));
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    void loadProfile();
  }, [loadProfile, token]);

  return { profile, loading, error, reload: loadProfile, router };
}

export function useUpdateStudentProfile() {
  const { profile, loading, error, router } = useStudentProfile();
  const [form, setForm] = useState<StudentProfileForm>(() => toStudentProfileForm(null));
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);

  useEffect(() => {
    setForm({
      ...toStudentProfileForm(profile),
      birthDate: toDateInputValue(profile?.birthDate),
    });
  }, [profile]);

  const isValid = useMemo(
    () => Boolean(form.fullName.trim() && form.universityName.trim() && form.birthDate),
    [form]
  );

  const updateField = (name: keyof StudentProfileForm, value: string) => {
    setFeedback(null);
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const submit = async () => {
    if (!isValid) {
      setFeedback({ type: "error", text: "Please fill in all required fields." });
      return false;
    }

    setSaving(true);
    setFeedback(null);

    try {
      await updateStudentProfile(form, profile?.email ?? "", router);
      setFeedback({ type: "success", text: "Profile updated successfully." });
      return true;
    } catch (error) {
      setFeedback({ type: "error", text: getErrorMessage(error, "Update failed.") });
      return false;
    } finally {
      setSaving(false);
    }
  };

  return {
    profile,
    form,
    loading,
    saving,
    error,
    feedback: feedback ?? (error ? { type: "error" as const, text: error } : null),
    updateField,
    submit,
    router,
  };
}
