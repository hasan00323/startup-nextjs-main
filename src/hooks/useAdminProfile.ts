"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getErrorMessage } from "@/lib/errors";
import { toAdminProfileForm, type AdminProfile, type AdminProfileForm } from "@/models/admin";
import { getAdminProfile, updateAdminProfile } from "@/services/adminService";
import { useRequireAuth } from "@/hooks/useRequireAuth";

type Feedback = { type: "error" | "success"; text: string } | null;

export function useAdminProfile() {
  const { router, token, isAuthenticated } = useRequireAuth();
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = useCallback(async () => {
    if (!isAuthenticated) return;

    setLoading(true);
    setError(null);

    try {
      setProfile(await getAdminProfile(router));
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

export function useUpdateAdminProfile() {
  const { profile, loading, error, router } = useAdminProfile();
  const [form, setForm] = useState<AdminProfileForm>(() => toAdminProfileForm(null));
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);

  useEffect(() => {
    setForm(toAdminProfileForm(profile));
  }, [profile]);

  const isValid = useMemo(
    () => Boolean(form.fullName.trim() && form.email.trim()),
    [form.email, form.fullName]
  );

  const updateField = (name: keyof AdminProfileForm, value: string) => {
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
      await updateAdminProfile(form, router);
      setFeedback({ type: "success", text: "Profile updated successfully." });
      return true;
    } catch (error) {
      setFeedback({ type: "error", text: getErrorMessage(error, "Something went wrong.") });
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
