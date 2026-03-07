import type {
  CourseResponseDto,
  CourseStructureDto,
  CreateModuleDto,
  CreateModuleQuizDto,
  CreateSectionDto,
  CreateTrackDto,
  UpdateCourseDto,
  UpdateModuleDto,
  UpdateModuleQuizDto,
  UpdateSectionDto,
  UpdateTrackDto,
  QuizQuestionDto,
  CreateQuizQuestionDto,
  UpdateQuizQuestionDto,
  CreateQuizOptionDto,
  UpdateQuizOptionDto,
} from "./../types";

const API = "https://localhost:7145/api/courses";

function getToken() {
  return localStorage.getItem("token") || localStorage.getItem("Token") || "";
}

async function req<T>(url: string, init?: RequestInit): Promise<T> {
  const token = getToken();

  const res = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(txt || `Request failed (${res.status})`);
  }

  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) return (await res.json()) as T;
  return (await res.text()) as unknown as T;
}

export const CoursesApi = {
  getCourseStructure: (courseId: number) =>
    req<CourseStructureDto>(`${API}/GetCourseStructure/${courseId}`, { method: "GET" }),

  getCourse: (courseId: number) =>
    req<CourseResponseDto>(`${API}/GetCourse/${courseId}`, { method: "GET" }),

  updateCourse: (courseId: number, dto: UpdateCourseDto) =>
    req<string>(`${API}/UpdateCourse/${courseId}`, {
      method: "PUT",
      body: JSON.stringify(dto),
    }),

  deleteCourse: (courseId: number) =>
    req<string>(`${API}/DeleteCourse/${courseId}`, { method: "DELETE" }),

  // Tracks
  createTrack: (dto: CreateTrackDto) =>
    req<number>(`${API}/CreateTrack`, { method: "POST", body: JSON.stringify(dto) }),

  updateTrack: (trackId: number, dto: UpdateTrackDto) =>
    req<string>(`${API}/UpdateTrack/${trackId}`, { method: "PUT", body: JSON.stringify(dto) }),

  deleteTrack: (trackId: number) =>
    req<string>(`${API}/DeleteTrack/${trackId}`, { method: "DELETE" }),

  // Modules
  createModule: (dto: CreateModuleDto) =>
    req<number>(`${API}/CreateModule`, { method: "POST", body: JSON.stringify(dto) }),

  updateModule: (moduleId: number, dto: UpdateModuleDto) =>
    req<string>(`${API}/UpdateModule/${moduleId}`, { method: "PUT", body: JSON.stringify(dto) }),

  deleteModule: (moduleId: number) =>
    req<string>(`${API}/DeleteModule/${moduleId}`, { method: "DELETE" }),

  // Sections
  createSection: (dto: CreateSectionDto) =>
    req<number>(`${API}/CreateSection`, { method: "POST", body: JSON.stringify(dto) }),

  updateSection: (sectionId: number, dto: UpdateSectionDto) =>
    req<string>(`${API}/UpdateSection/${sectionId}`, { method: "PUT", body: JSON.stringify(dto) }),

  deleteSection: (sectionId: number) =>
    req<string>(`${API}/DeleteSection/${sectionId}`, { method: "DELETE" }),

  // Quizzes
  createModuleQuiz: (dto: CreateModuleQuizDto) =>
    req<number>(`${API}/CreateModuleQuiz`, { method: "POST", body: JSON.stringify(dto) }),

  updateModuleQuiz: (quizId: number, dto: UpdateModuleQuizDto) =>
    req<string>(`${API}/UpdateModuleQuiz/${quizId}`, { method: "PUT", body: JSON.stringify(dto) }),

  deleteModuleQuiz: (quizId: number) =>
    req<string>(`${API}/DeleteModuleQuiz/${quizId}`, { method: "DELETE" }),

  // -------- Optional (only if you add endpoints in CoursesController) --------
  getQuizQuestions: (quizId: number) =>
    req<QuizQuestionDto[]>(`${API}/GetQuizQuestions/${quizId}`, { method: "GET" }),

  createQuizQuestion: (dto: CreateQuizQuestionDto) =>
    req<number>(`${API}/CreateQuizQuestion`, { method: "POST", body: JSON.stringify(dto) }),

  updateQuizQuestion: (questionId: number, dto: UpdateQuizQuestionDto) =>
    req<string>(`${API}/UpdateQuizQuestion/${questionId}`, { method: "PUT", body: JSON.stringify(dto) }),

  deleteQuizQuestion: (questionId: number) =>
    req<string>(`${API}/DeleteQuizQuestion/${questionId}`, { method: "DELETE" }),

  createQuizOption: (dto: CreateQuizOptionDto) =>
    req<number>(`${API}/CreateQuizOption`, { method: "POST", body: JSON.stringify(dto) }),

  updateQuizOption: (optionId: number, dto: UpdateQuizOptionDto) =>
    req<string>(`${API}/UpdateQuizOption/${optionId}`, { method: "PUT", body: JSON.stringify(dto) }),

  deleteQuizOption: (optionId: number) =>
    req<string>(`${API}/DeleteQuizOption/${optionId}`, { method: "DELETE" }),
};