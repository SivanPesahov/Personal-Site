import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import CommentForm from "../components/CommentForm";
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
        // Comments are non-critical; fail silently for now
      } finally {
        if (!cancelled) setLoadingComments(false);
      }
    }
    if (slug) loadComments();
    return () => {
      cancelled = true;
    };
  }, [slug, commentsRefreshKey]);

  if (loading) return <div style={{ padding: 16 }}>Loading…</div>;
  if (error)
    return <div style={{ padding: 16, color: "red" }}>Error: {error}</div>;
  if (!project) return <div style={{ padding: 16 }}>Project not found.</div>;

  return (
    <div style={{ maxWidth: 920, margin: "0 auto", padding: 16 }}>
      <nav style={{ marginBottom: 12 }}>
        <Link to="/">← Back to projects</Link>
      </nav>

      <header>
        <h1 style={{ marginTop: 0 }}>{project.title}</h1>
        <p style={{ color: "#555", marginTop: 4 }}>
          {project.short_description}
        </p>
        <div
          style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 8 }}
        >
          {project.live_url && (
            <a href={project.live_url} target="_blank" rel="noreferrer">
              Live Site
            </a>
          )}
          {project.repo_url && (
            <a href={project.repo_url} target="_blank" rel="noreferrer">
              Repository
            </a>
          )}
        </div>
      </header>

      {project.image_url && (
        <div style={{ marginTop: 16 }}>
          <img
            src={project.image_url}
            alt={project.title}
            style={{
              width: "100%",
              height: "auto",
              borderRadius: 8,
              border: "1px solid #eee",
            }}
          />
        </div>
      )}

      <section style={{ marginTop: 24 }}>
        <h2>Description</h2>
        {/* react-markdown כבר אינו מציג HTML גולמי כברירת מחדל, כך שהרינדור בטוח. */}
        <div style={{ lineHeight: 1.7 }}>
          <ReactMarkdown>{project.description_md || ""}</ReactMarkdown>
        </div>
      </section>

      <section style={{ marginTop: 32 }}>
        <h2>Comments</h2>
        {loadingComments && <p>Loading comments…</p>}
        {!loadingComments && comments.length === 0 && <p>No comments yet.</p>}
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {comments.map((c) => (
            <li
              key={c.id}
              style={{ borderTop: "1px solid #eee", padding: "12px 0" }}
            >
              <div style={{ fontWeight: 600 }}>{c.name}</div>
              <div style={{ color: "#666", fontSize: 12 }}>
                {new Date(c.created_at).toLocaleString()}
              </div>
              <p style={{ marginTop: 6, whiteSpace: "pre-wrap" }}>
                {c.content}
              </p>
            </li>
          ))}
        </ul>
        <div style={{ marginTop: 16 }}>
          <CommentForm
            projectSlug={slug}
            onSuccess={() => setCommentsRefreshKey((k) => k + 1)}
          />
        </div>
      </section>
    </div>
  );
}

export default ProjectPage;
