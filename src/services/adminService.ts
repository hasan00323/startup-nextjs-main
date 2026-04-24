import { apiFetch, parseApiError, requestJson, type RouterLike } from "@/lib/api";
import {
  mapAdminProfile,
  type AdminProfile,
  type AdminProfileForm,
  type AdminProfileResponse,
} from "@/models/admin";

const ADMIN_ENDPOINTS = {
  profile: "/Users/SystemAdminProfile",
  updateProfile: "/Users/UpdateAdminProfile",
};

export async function getAdminProfile(router?: RouterLike): Promise<AdminProfile | null> {
  const data = await requestJson<AdminProfileResponse>(
    ADMIN_ENDPOINTS.profile,
    { method: "GET" },
    router
  );

  return mapAdminProfile(data);
}

export async function updateAdminProfile(form: AdminProfileForm, router?: RouterLike) {
  const res = await apiFetch(
    ADMIN_ENDPOINTS.updateProfile,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        FullName: form.fullName,
        Email: form.email,
        PhoneNumber: form.phoneNumber,
      }),
    },
    router
  );

  if (!res.ok) throw await parseApiError(res);
  return res;
}
