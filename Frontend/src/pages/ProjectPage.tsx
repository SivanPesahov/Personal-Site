import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { PROJECTS, PROJECT_COMMENTS } from "../data/projects";
import GlassSurface from "../components/GlassSurface";

import CommentComponent from "../components/CommentComponent";
import ProjectPicsCarusel from "../components/ProjectPicsCarusel";
import Typing from "../components/Typing";

// Fully static page: content comes from the frozen snapshot in
// ../data/projects.ts (no server/DB — see that file's header comment).
function ProjectPage() {
  const { slug = "" } = useParams();
  const project = PROJECTS[slug];
  const comments = PROJECT_COMMENTS[slug] ?? [];

  if (!project) {
    return (
      <div className="p-4">
        Project not found. <Link to="/">Back home</Link>
      </div>
    );
  }

  const imageList = project.images;

  return (
    <section className="relative  overflow-hidden pt-[2vh]">
      <div className="h-full overflow-y-auto px-[2%] mb-[6%]">
        <div className="max-w-4xl mx-auto">
          <header className="text-center mb-8">
            <h1 className="mt-0 text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-neutral-900 via-neutral-700 to-neutral-900 dark:from-white dark:via-neutral-300 dark:to-white drop-shadow-sm">
              <Typing strArr={[project.title]} />
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
              <div className="p-6 text-left w-full">
                <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
                  Description
                </h2>
                <div className="prose dark:prose-invert max-w-none leading-relaxed text-neutral-700 dark:text-neutral-300">
                  <ReactMarkdown>{project.description_md || ""}</ReactMarkdown>
                </div>
              </div>
            </GlassSurface>
          </section>

          {comments.length > 0 && (
            <section className="mt-8">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                Comments
              </h2>
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
            </section>
          )}
        </div>
      </div>
    </section>
  );
}

export default ProjectPage;
