import api from "./api.service";

// ---- Types (kept local to avoid cross-file coupling) ----
export type Project = {
  id: number;
  slug: string;
  title: string;
  short_description: string;
  description_md: string;
  image_url: string | null;
  repo_url: string | null;
  live_url: string | null;
  is_featured: boolean;
  created_at: string; // ISO
  updated_at: string; // ISO
};

export type Comment = {
  id: number;
  project_id: number;
  name: string;
  email: string;
  content: string;
  is_approved: boolean;
  created_at: string; // ISO
};

export type ListProjectsParams = {
  featured?: 0 | 1;
  q?: string;
  page?: number;
  page_size?: number;
};

export type ListProjectsResult = {
  items: Project[];
  total: number;
};

// ---- API functions ----

/**
 * GET /api/projects
 * Supports: featured=1, q, page, page_size
 * Returns: { items: Project[]; total: number }
 */
export async function listProjects(
  params: ListProjectsParams = {}
): Promise<ListProjectsResult> {
  // axios params builds the query string automatically
  const res = (await api.get("/api/projects/", { params })) as unknown as
    | ListProjectsResult
    | Project[];

  // The backend may return either:
  // 1) { items: Project[]; total: number }
  // 2) Project[] (simple array)
  if (Array.isArray(res)) {
    return { items: res as Project[], total: (res as Project[]).length };
  }
  return res as ListProjectsResult;
}

/**
 * GET /api/projects/:slug
 */
export async function getProjectBySlug(slug: string): Promise<Project> {
  if (!slug) throw new Error("slug is required");
  return (await api.get(
    `/api/projects/${encodeURIComponent(slug)}`
  )) as unknown as Project;
}

/**
 * GET /api/projects/:slug/comments
 * (Returns only approved comments server-side if that's how your backend is configured.)
 */
export async function getProjectComments(slug: string): Promise<Comment[]> {
  if (!slug) throw new Error("slug is required");
  return (await api.get(
    `/api/projects/${encodeURIComponent(slug)}/comments`
  )) as unknown as Comment[];
}

/**
 * POST /api/projects/:slug/comments
 * Backend expects captcha_token along with name, email, content.
 */
export type PostCommentInput = {
  name: string;
  email: string;
  content: string;
  captchaToken: string; // Turnstile/hCaptcha token from the client
};

export async function postProjectComment(
  slug: string,
  input: PostCommentInput
): Promise<{ id: number } & Partial<Comment>> {
  if (!slug) throw new Error("slug is required");
  const payload = {
    name: input.name,
    email: input.email,
    content: input.content,
    captcha_token: input.captchaToken,
  };
  return (await api.post(
    `/api/projects/${encodeURIComponent(slug)}/comments`,
    payload
  )) as unknown as { id: number } & Partial<Comment>;
}

/**
 * (Optional) Helper for contact form could live in a separate service (contact.service.ts),
 * but if you prefer to co-locate, you can add a similar function:
 *   export async function postContact(input: { name: string; email: string; message: string; captchaToken: string }) { ... }
 * We'll keep it separate for now to respect single-responsibility per file.
 */
