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
import GlassSurface from "../components/GlassSurface";

import CommentComponent from "../components/CommentComponent";
import ProjectPicsCarusel from "../components/ProjectPicsCarusel";

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
  const imageList: string[] = Array.isArray(project.images_json)
    ? (project.images_json as unknown as string[])
    : (() => {
        try {
          return project.images_json
            ? JSON.parse(String(project.images_json))
            : [];
        } catch {
          return [];
        }
      })();

  return (
    <section className="relative h-full overflow-hidden pt-[2vh]">
      <div className="h-full overflow-y-auto px-[2%] mb-[6%]">
        <div className="max-w-4xl mx-auto">
          <header className="text-center mb-8">
            <h1 className="mt-0 text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-neutral-900 via-neutral-700 to-neutral-900 dark:from-white dark:via-neutral-300 dark:to-white drop-shadow-sm">
              {project.title}
            </h1>
            <p className="mt-2 text-base text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto leading-relaxed">
              {project.short_description}
            </p>

            <div className="flex justify-center flex-wrap gap-4 mt-4">
              {project.live_url && (
                <a
                  href={project.live_url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-2 text-sm font-medium rounded-full border border-neutral-300 dark:border-neutral-700 bg-white/40 dark:bg-neutral-900/40 backdrop-blur-md text-neutral-800 dark:text-neutral-100 hover:bg-white/60 dark:hover:bg-neutral-800/60 transition-all"
                >
                  🌐 Live Site
                </a>
              )}
              {project.repo_url && (
                <a
                  href={project.repo_url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-2 text-sm font-medium rounded-full border border-neutral-300 dark:border-neutral-700 bg-white/40 dark:bg-neutral-900/40 backdrop-blur-md text-neutral-800 dark:text-neutral-100 hover:bg-white/60 dark:hover:bg-neutral-800/60 transition-all"
                >
                  💻 Repository
                </a>
              )}
            </div>
          </header>

          {imageList.length > 0 ? (
            <ProjectPicsCarusel images={imageList} title={project.title} />
          ) : (
            project.image_url_desktop && (
              <div className="mt-4">
                <img
                  src={project.image_url_desktop}
                  alt={project.title}
                  className="w-full h-auto rounded-lg border border-gray-200 dark:border-gray-700"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://placehold.co/1200x675/png?text=Image+not+available";
                  }}
                />
              </div>
            )
          )}

          <section className="mt-10">
            <GlassSurface width={"100%"} height={"auto"} borderRadius={24}>
              <div className="p-6 text-left">
                <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
                  Description
                </h2>
                <div className="prose dark:prose-invert max-w-none leading-relaxed text-neutral-700 dark:text-neutral-300">
                  <ReactMarkdown>{project.description_md || ""}</ReactMarkdown>
                </div>
              </div>
            </GlassSurface>
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
                <li key={c.id} className="my-2">
                  <CommentComponent
                    name={c.name}
                    created_at={c.created_at}
                    content={c.content}
                  />
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
      <div className="my-[8vh]">
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
      </div>
    </section>
  );
}

export default ProjectPage;
