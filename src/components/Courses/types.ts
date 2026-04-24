export type CourseStructureDto = {
  courseId: number;
  title: string;
  tracks: TrackDto[];
};

export type TrackDto = {
  courseTrackId: number;
  title: string;
  description?: string | null;
  order: number;
  isRequired: boolean;
  modules: ModuleDto[];
};

export type ModuleDto = {
  courseModuleId: number;
  title: string;
  description?: string | null;
  order: number;
  sections: SectionDto[];
  quizzes: ModuleQuizDto[];
};

export type SectionDto = {
  courseSectionId: number;
  title: string;
  contentType: number;
  contentUrl?: string | null;
  durationSeconds: number;
  order: number;
  isPreview: boolean;
};

export type ModuleQuizDto = {
  moduleQuizId: number;
  title: string;
  description?: string | null;
  passingScore: number;
  maxAttempts: number;
  isFinalInModule: boolean;
  order: number;
};

export type CourseListItem = {
  id?: number;
  Id?: number;
  CourseId?: number;
  courseId: number;
  Title?: string;
  title: string;
  Description?: string | null;
  description?: string | null;
  Price?: number;
  price: number;
  StartDate?: string;
  startDate: string;
  EndDate?: string;
  endDate: string;
  CategoryName?: string | null;
  categoryName?: string | null;
};

export type CategoryItem = {
  categoryName: string;
};

export type Selection =
  | { kind: "course"; courseId: number }
  | { kind: "track"; courseId: number; courseTrackId: number }
  | { kind: "module"; courseId: number; courseTrackId: number; courseModuleId: number }
  | { kind: "quiz"; courseId: number; courseTrackId: number; courseModuleId: number; moduleQuizId: number };

export type CourseResponseDto = {
  courseId: number;
  title: string;
  description: string;
  price: number;
  startDate: string;
  endDate: string;
  categoryName?: string | null;
};

export type CreateTrackDto = {
  courseId: number;
  title: string;
  description?: string | null;
  order: number;
  isRequired: boolean;
};

export type UpdateTrackDto = {
  title: string;
  description?: string | null;
  order: number;
  isRequired: boolean;
};

export type CreateModuleDto = {
  courseTrackId: number;
  title: string;
  description?: string | null;
  order: number;
};

export type UpdateModuleDto = {
  title: string;
  description?: string | null;
  order: number;
};

export type CreateSectionDto = {
  courseModuleId: number;
  title: string;
  contentType: number | string;
  contentUrl?: string | null;
  durationSeconds?: number | null;
  order: number;
  isPreview: boolean;
};

export type UpdateSectionDto = {
  title: string;
  contentType: number | string;
  contentUrl?: string | null;
  durationSeconds?: number | null;
  order: number;
  isPreview: boolean;
};

export type CreateModuleQuizDto = {
  courseModuleId: number;
  title: string;
  description?: string | null;
  passingScore: number;
  maxAttempts: number;
  isFinalInModule: boolean;
  order: number;
};

export type UpdateModuleQuizDto = {
  title: string;
  description?: string | null;
  passingScore: number;
  maxAttempts: number;
  isFinalInModule: boolean;
  order: number;
};

// Optional (if you add endpoints)
export type QuizQuestionDto = {
  quizQuestionId: number;
  moduleQuizId: number;
  text: string;
  order: number;
  options: QuizOptionDto[];
};

export type QuizOptionDto = {
  quizOptionId: number;
  quizQuestionId: number;
  text: string;
  isCorrect: boolean;
  order: number;
};

export type CreateQuizQuestionDto = {
  moduleQuizId: number;
  text: string;
  order: number;
};

export type UpdateQuizQuestionDto = {
  text: string;
  order: number;
};

export type CreateQuizOptionDto = {
  quizQuestionId: number;
  text: string;
  isCorrect: boolean;
  order: number;
};

export type UpdateQuizOptionDto = {
  text: string;
  isCorrect: boolean;
  order: number;
};

// Root update (حسب DTO تبعك: فيه CategoryId + ParentCourseId + IsPro)
export type UpdateCourseDto = {
  title: string;
  description: string;
  price: number;
  startDate: string;
  endDate: string;
  categoryId: number;
  parentCourseId: number; // إذا عندك nullable عدّلها لـ number | null
  isPro: boolean;
};
