export type AdminProfileResponse = {
  userId?: string | number;
  UserId?: string | number;
  fullName?: string;
  FullName?: string;
  email?: string;
  Email?: string;
  phoneNumber?: string;
  PhoneNumber?: string;
};

export type AdminProfile = {
  userId: string;
  fullName: string;
  email: string;
  phoneNumber: string;
};

export type AdminProfileForm = {
  fullName: string;
  email: string;
  phoneNumber: string;
};

export function mapAdminProfile(data: AdminProfileResponse | null | undefined): AdminProfile | null {
  if (!data) return null;

  return {
    userId: String(data.userId ?? data.UserId ?? ""),
    fullName: String(data.fullName ?? data.FullName ?? ""),
    email: String(data.email ?? data.Email ?? ""),
    phoneNumber: String(data.phoneNumber ?? data.PhoneNumber ?? ""),
  };
}

export function toAdminProfileForm(profile: AdminProfile | null): AdminProfileForm {
  return {
    fullName: profile?.fullName ?? "",
    email: profile?.email ?? "",
    phoneNumber: profile?.phoneNumber ?? "",
  };
}
