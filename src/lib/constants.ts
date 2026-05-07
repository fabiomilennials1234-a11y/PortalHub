export const APP_NAME = "PortalHub"
export const APP_DESCRIPTION =
  "Plataforma all-in-one de comunidades e cursos online"

export const ROUTES = {
  home: "/",
  login: "/login",
  signup: "/signup",
  pricing: "/pricing",
  community: (orgSlug: string) => `/${orgSlug}/community`,
  post: (orgSlug: string, postId: string) =>
    `/${orgSlug}/community/${postId}`,
  courses: (orgSlug: string) => `/${orgSlug}/courses`,
  course: (orgSlug: string, courseId: string) =>
    `/${orgSlug}/courses/${courseId}`,
  lesson: (orgSlug: string, courseId: string, lessonId: string) =>
    `/${orgSlug}/courses/${courseId}/${lessonId}`,
  events: (orgSlug: string) => `/${orgSlug}/events`,
  leaderboard: (orgSlug: string) => `/${orgSlug}/leaderboard`,
  members: (orgSlug: string) => `/${orgSlug}/members`,
  profile: (orgSlug: string, userId: string) =>
    `/${orgSlug}/members/${userId}`,
  settings: (orgSlug: string) => `/${orgSlug}/settings`,
} as const

export const LIMITS = {
  POST_TITLE_MAX: 200,
  POST_BODY_MAX: 50_000,
  COMMENT_MAX: 5_000,
  ORG_NAME_MAX: 100,
  SLUG_MAX: 50,
  AVATAR_MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ATTACHMENT_MAX_SIZE: 50 * 1024 * 1024, // 50MB
  PAGE_SIZE: 20,
} as const
