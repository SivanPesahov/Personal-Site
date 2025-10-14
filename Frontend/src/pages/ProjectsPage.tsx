import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { listProjects, type Project } from "../services/projects.service";

function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get("q") || "";

  useEffect(() => {
    let cancelled = false;
    async function run() {
      setLoading(true);
      setError(null);
      try {
        const res = await listProjects({ q, page: 1, page_size: 12 });
        if (!cancelled) {
          setProjects(res.items);
          setTotal(res.total);
        }
      } catch (e: any) {
        if (!cancelled) setError(e?.message || "Failed to load projects");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [q]);

  const onSearchChange = (value: string) => {
    if (value) setSearchParams({ q: value });
    else setSearchParams({});
  };

  return (
    <div style={{ maxWidth: 920, margin: "0 auto", padding: 16 }}>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
        }}
      >
        <h1 style={{ margin: 0 }}>Projects</h1>
        <input
          type="text"
          value={q}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search projects…"
          aria-label="Search projects"
          style={{ padding: 8, minWidth: 240 }}
        />
      </header>

      {loading && <p style={{ marginTop: 16 }}>Loading…</p>}
      {error && <p style={{ marginTop: 16, color: "red" }}>Error: {error}</p>}

      {!loading && !error && (
        <>
          <p style={{ marginTop: 8, color: "#666" }}>
            {total} result{total === 1 ? "" : "s"}
          </p>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              marginTop: 16,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: 16,
            }}
          >
            {projects.map((p) => (
              <li
                key={p.id}
                style={{
                  border: "1px solid #eee",
                  borderRadius: 8,
                  padding: 16,
                }}
              >
                <h3 style={{ marginTop: 0, marginBottom: 8 }}>
                  <Link to={`/projects/${encodeURIComponent(p.slug)}`}>
                    {p.title}
                  </Link>
                </h3>
                <p style={{ margin: 0, color: "#555" }}>
                  {p.short_description}
                </p>
                <div
                  style={{
                    display: "flex",
                    gap: 12,
                    marginTop: 12,
                    flexWrap: "wrap",
                  }}
                >
                  <Link to={`/projects/${encodeURIComponent(p.slug)}`}>
                    View details
                  </Link>
                  {p.live_url && (
                    <a href={p.live_url} target="_blank" rel="noreferrer">
                      Live
                    </a>
                  )}
                  {p.repo_url && (
                    <a href={p.repo_url} target="_blank" rel="noreferrer">
                      Repo
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default ProjectsPage;
