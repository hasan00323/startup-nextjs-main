export type StudentProfileResponse = {
  studentId?: string | number;
  StudentId?: string | number;
  universityName?: string;
  UniversityName?: string;
  birthDate?: string;
  BirthDate?: string;
  userId?: string | number;
  UserId?: string | number;
  fullName?: string;
  FullName?: string;
  email?: string;
  Email?: string;
  phoneNumber?: string;
  PhoneNumber?: string;
  userRole?: string;
  UserRole?: string;
};

export type StudentProfile = {
  studentId: string;
  universityName: string;
  birthDate: string;
  userId: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  userRole: string;
};

export type StudentProfileForm = {
  fullName: string;
  phoneNumber: string;
  universityName: string;
  birthDate: string;
};

export function mapStudentProfile(data: StudentProfileResponse | null | undefined): StudentProfile | null {
  if (!data) return null;

  return {
    studentId: String(data.studentId ?? data.StudentId ?? ""),
    universityName: String(data.universityName ?? data.UniversityName ?? ""),
    birthDate: String(data.birthDate ?? data.BirthDate ?? ""),
    userId: String(data.userId ?? data.UserId ?? ""),
    fullName: String(data.fullName ?? data.FullName ?? ""),
    email: String(data.email ?? data.Email ?? ""),
    phoneNumber: String(data.phoneNumber ?? data.PhoneNumber ?? ""),
    userRole: String(data.userRole ?? data.UserRole ?? "Student"),
  };
}

export function toStudentProfileForm(profile: StudentProfile | null): StudentProfileForm {
  return {
    fullName: profile?.fullName ?? "",
    phoneNumber: profile?.phoneNumber ?? "",
    universityName: profile?.universityName ?? "",
    birthDate: profile?.birthDate ?? "",
  };
}
