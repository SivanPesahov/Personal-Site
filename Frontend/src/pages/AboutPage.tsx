import { Link } from "react-router-dom";
import GlassSurface from "../components/GlassSurface";
import Typing from "../components/Typing";

function AboutPage() {
  return (
    <main className="px-4 py-10">
      <div className="max-w-3xl mx-auto">
        <GlassSurface width={"100%"} height={"auto"} borderRadius={24}>
          <section className="p-6 sm:p-8">
            <h1 className="text-3xl sm:text-4xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-neutral-900 via-neutral-700 to-neutral-900 dark:from-neutral-100 dark:via-neutral-300 dark:to-neutral-100">
              <Typing strArr={["About Me - Sivan Pesahov"]} />
            </h1>

            <p className="mb-4 text-neutral-700 dark:text-neutral-200">
              Hi! I'm Sivan Pesahov, a Full-Stack Developer with a strong focus
              on Frontend and real-time systems. I build scalable end-to-end
              applications with <strong>React/Next.js</strong>, backend services
              in <strong>Node.js</strong> or <strong>Python/Flask</strong>, work
              with <strong>REST APIs</strong>, and relational/NoSQL databases.
              I'm a graduate of the “Warriors to High-Tech” program with an
              internship at Relyon, bringing precise execution under pressure,
              smart prioritization, and attention to detail.
            </p>

            <p className="mb-4 text-neutral-700 dark:text-neutral-200">
              Before transitioning into tech, I served as a combat soldier and
              team leader in a classified operational unit within the IDF’s
              Intelligence Directorate. That experience shaped my discipline,
              problem-solving mindset, and ability to perform under pressure —
              qualities I now bring into software development.
            </p>

            <p className="mb-6 text-neutral-700 dark:text-neutral-200">
              I value clean code, thoughtful manual checks, automation, and
              high-performance, accessible UX. I’m open to the next challenge in
              a strong team—places where I can learn fast, take ownership, and
              ship features end-to-end.
            </p>

            <div className="border-t border-neutral-200/60 dark:border-neutral-800/60 my-6" />

            <section aria-label="Skills" className="mb-6">
              <h2 className="text-xl font-semibold mb-3">Stack &amp; Skills</h2>
              <ul className="flex flex-wrap gap-2 justify-center list-none p-0">
                {[
                  "React",
                  "Next.js",
                  "TypeScript",
                  "Node.js",
                  "Express",
                  "Python",
                  "Flask",
                  "REST APIs",
                  "MySQL",
                  "Prisma",
                  "SQLAlchemy",
                  "Alembic",
                  "Redis",
                  "RabbitMQ",
                  "Tailwind CSS",
                  "Auth / JWT / NextAuth",
                ].map((skill) => (
                  <li key={skill} className="p-0 border-0 bg-transparent">
                    <GlassSurface
                      width={"auto"}
                      height={"auto"}
                      borderRadius={999}
                    >
                      <div className="px-3 py-1 text-sm">{skill}</div>
                    </GlassSurface>
                  </li>
                ))}
              </ul>
            </section>

            <div className="flex flex-wrap justify-center items-center gap-3 pt-2">
              <GlassSurface width={"auto"} height={"auto"} borderRadius={12}>
                <a
                  href="/CV-Sivan-Pesahov.pdf"
                  download
                  className="inline-flex items-center px-4 py-2 rounded-md font-semibold hover:opacity-90 transition"
                >
                  Download CV
                </a>
              </GlassSurface>
              <GlassSurface width={"auto"} height={"auto"} borderRadius={12}>
                <Link
                  to="/contact"
                  className="inline-flex items-center px-4 py-2 rounded-md hover:opacity-90 transition"
                >
                  Contact
                </Link>
              </GlassSurface>
            </div>
          </section>
        </GlassSurface>
      </div>
    </main>
  );
}

export default AboutPage;
