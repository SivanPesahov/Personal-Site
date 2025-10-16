import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import CommentForm from "../components/CommentForm";
import GradualBlur from "../components/GradualBlur";
import {
  getProjectBySlug,
  getProjectComments,
  type Project,
  type Comment,
} from "../services/projects.service";

function ProjectPage() {
  const { slug = "" } = useParams();

  const [project, setProject] = useState<Project | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingComments, setLoadingComments] = useState(false);
  const [commentsRefreshKey, setCommentsRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const p = await getProjectBySlug(slug);
        if (!cancelled) setProject(p);
      } catch (e: any) {
        if (!cancelled) setError(e?.message || "Failed to load project");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    if (slug) load();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  useEffect(() => {
    let cancelled = false;
    async function loadComments() {
      setLoadingComments(true);
      try {
        const list = await getProjectComments(slug);
        if (!cancelled) setComments(list);
      } catch (_) {
      } finally {
        if (!cancelled) setLoadingComments(false);
      }
    }
    if (slug) loadComments();
    return () => {
      cancelled = true;
    };
  }, [slug, commentsRefreshKey]);

  if (loading) return <div className="p-4">Loading…</div>;
  if (error)
    return (
      <div className="p-4 text-red-600 dark:text-red-400">Error: {error}</div>
    );
  if (!project) return <div className="p-4">Project not found.</div>;

  return (
    <section className="relative h-full overflow-hidden">
      <div className="h-full overflow-y-auto px-[2%] mb-[6%]">
        <div className="max-w-4xl mx-auto">
          <header>
            <h1 className="mt-0 text-3xl font-semibold text-gray-900 dark:text-white">
              {project.title}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              {project.short_description}
            </p>
            <div className="flex flex-wrap gap-3 mt-2">
              {project.live_url && (
                <a
                  href={project.live_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-blue-600 hover:underline dark:text-blue-500"
                >
                  Live Site
                </a>
              )}
              {project.repo_url && (
                <a
                  href={project.repo_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-blue-600 hover:underline dark:text-blue-500"
                >
                  Repository
                </a>
              )}
            </div>
          </header>

          {project.image_url && (
            <div className="mt-4">
              <img
                src={project.image_url}
                alt={project.title}
                className="w-full h-auto rounded-lg border border-gray-200 dark:border-gray-700"
              />
            </div>
          )}

          <section className="mt-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
              Description
            </h2>
            <div className="prose dark:prose-invert max-w-none leading-relaxed">
              <ReactMarkdown>{project.description_md || ""}</ReactMarkdown>
            </div>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
              Comments
            </h2>
            {loadingComments && <p>Loading comments…</p>}
            {!loadingComments && comments.length === 0 && (
              <p>No comments yet.</p>
            )}
            <ul className="list-none p-0 m-0">
              {comments.map((c) => (
                <li
                  key={c.id}
                  className="border-t border-gray-200 dark:border-gray-700 py-3"
                >
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {c.name}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(c.created_at).toLocaleString()}
                  </div>
                  <p className="mt-1 whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                    {c.content}
                  </p>
                </li>
              ))}
            </ul>
            <div className="mt-4">
              <CommentForm
                projectSlug={slug}
                onSuccess={() => setCommentsRefreshKey((k) => k + 1)}
              />
            </div>
          </section>
        </div>
      </div>
      <GradualBlur
        target="page"
        position="bottom"
        height="6rem"
        strength={2}
        divCount={5}
        curve="bezier"
        exponential={true}
        opacity={1}
      />
    </section>
  );
}

export default ProjectPage;
