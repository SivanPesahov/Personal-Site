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
              <strong>Full Stack Developer</strong> with a strong foundation in
              building scalable, user-centric web applications. I come from a
              background as a<strong> combat soldier</strong> in a{" "}
              <strong>special operations unit</strong>, where I gained
              discipline, resilience, and the ability to perform under pressure
              - qualities that continue to shape the way I approach engineering
              challenges.
            </p>

            <p className="mb-4 text-neutral-700 dark:text-neutral-200">
              After completing the intensive{" "}
              <strong>“Warriors to High‑Tech”</strong> program and a hands‑on
              full stack internship at <strong>Relyon.ai</strong>, I
              transitioned into the industry and now work as a{" "}
              <strong>JavaScript Developer at Konimbo</strong>, developing
              production‑grade features for high‑traffic e‑commerce platforms.
            </p>

            <p className="mb-6 text-neutral-700 dark:text-neutral-200">
              My daily work spans <strong>React</strong>,{" "}
              <strong>Next.js</strong>,<strong>Node.js</strong>,{" "}
              <strong>TypeScript</strong>, <strong>MongoDB</strong>,
              <strong>MySQL</strong> and modern development practices. I enjoy
              solving complex problems, optimizing user experience, and building
              clean, maintainable systems at scale.
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
