import { useEffect, useState } from "react";
import { listProjects } from "../services/projects.service";

const SKILLS_A = ["React", "Next.js", "TypeScript", "Node.js", "Express", "REST APIs", "Tailwind", "Vite", "Prisma", "MySQL", "MongoDB", "Redis"];
const SKILLS_B = ["Python", "Flask", "AWS", "AI Tools", "SQLAlchemy", "Alembic", "RabbitMQ", "JWT / NextAuth", "Docker", "Vercel", "Git", "Figma", "shadcn/ui", "Stripe"];
const DOT_COLORS = ["#5b6cff", "#ff6f91", "#36c3a3", "#ffb547", "#a78bfa", "#7ce2ff"];

function makeChips(skills: string[], variant: (i: number) => string) {
  return [...skills, ...skills, ...skills].map((name, i) => {
    const color = DOT_COLORS[i % DOT_COLORS.length];
    const cls = variant(i % skills.length);
    return (
      <span key={i} className={`chip${cls ? " " + cls : ""}`}>
        <span className="d" style={{ background: color }} />
        {name}
      </span>
    );
  });
}

// Visual/layout config per project. The backend DB only stores content
// (title, description, image, links) — design fields like grid span,
// gradient colors, badge text and tags live here, keyed by slug.
type ProjectMeta = {
  slug: string;
  cls: string;
  c1: string;
  c2: string;
  badge: string;
  tags: string[];
  delay: string;
  // Fallback content used if the API is unreachable or the slug isn't seeded yet.
  fallbackTitle: string;
  fallbackDesc: string;
  fallbackImage: string;
  fallbackHref: string;
};

type ProjectCard = {
  slug: string;
  cls: string;
  c1: string;
  c2: string;
  badge: string;
  tags: string[];
  delay: string;
  title: string;
  desc: string;
  image: string;
  href: string;
};

const PROJECT_META: ProjectMeta[] = [
  {
    slug: "crypto-streamer",
    cls: "p p1",
    c1: "#b9f0e3", c2: "#ffe7c4",
    badge: "Realtime · TypeScript",
    tags: ["TypeScript", "WebSockets", "React", "Charts"],
    delay: "",
    fallbackTitle: "crypto‑streamer",
    fallbackDesc: "A realtime crypto price stream — websocket feed into a typed React UI with live charts and watchlists. Built to learn backpressure, reconnects, throttled re‑renders.",
    fallbackImage: "https://res.cloudinary.com/dipx5fuza/image/upload/v1760530334/Screenshot_2025-08-25_at_16.18.39_m9mtq9.png",
    fallbackHref: "https://github.com/SivanPesahov/crypto-streamer",
  },
  {
    slug: "market-tracker",
    cls: "p p2",
    c1: "#ffe7c4", c2: "#ffd9e6",
    badge: "Dashboard · JS",
    tags: ["JavaScript", "Charts", "API"],
    delay: "d1",
    fallbackTitle: "market‑tracker",
    fallbackDesc: "Watchlist + portfolio dashboard: tickers, deltas, history charts.",
    fallbackImage: "https://res.cloudinary.com/dipx5fuza/image/upload/v1781976218/8b366e02-1650-4dcc-a1b8-ca2a305001d2.png",
    fallbackHref: "https://github.com/SivanPesahov/market-tracker",
  },
  {
    slug: "job-flow",
    cls: "p p3",
    c1: "#c5d3ff", c2: "#ffd9e6",
    badge: "Featured · TypeScript",
    tags: ["TypeScript", "React", "Node", "MongoDB", "JWT"],
    delay: "",
    fallbackTitle: "Job‑Flow",
    fallbackDesc: "A job‑application tracker built for the actual chaos of a job hunt — pipeline columns, status changes, follow‑up reminders, and notes per role. Full‑stack TypeScript, end‑to‑end typed.",
    fallbackImage: "https://res.cloudinary.com/dipx5fuza/image/upload/v1761481848/Screenshot_2025-10-26_at_14.30.42_ffraku.png",
    fallbackHref: "https://github.com/SivanPesahov/Job-Flow",
  },
  {
    slug: "relyon-landing",
    cls: "p p4",
    c1: "#b9f0e3", c2: "#c5d3ff",
    badge: "Landing Page · Intern",
    tags: ["Next.js", "React", "Design"],
    delay: "d1",
    fallbackTitle: "Relyon.ai",
    fallbackDesc: "Landing page built during my internship. Marketing site for Relyon's real‑time personal security platform.",
    fallbackImage: "https://res.cloudinary.com/dipx5fuza/image/upload/v1760530336/Screenshot_2025-08-25_at_16.46.12_yi6jf5.png",
    fallbackHref: "https://relyon.ai",
  },
  {
    slug: "taskify",
    cls: "p p5",
    c1: "#ffd9e6", c2: "#c5d3ff",
    badge: "Full‑stack · JS",
    tags: ["Node", "Express", "MongoDB"],
    delay: "d2",
    fallbackTitle: "Task‑Management",
    fallbackDesc: "Multi‑user tasks app: auth, projects, drag‑and‑drop boards, role permissions.",
    fallbackImage: "https://res.cloudinary.com/dipx5fuza/image/upload/v1760530336/Screenshot_2025-09-01_at_13.35.41_zdp1jy.png",
    fallbackHref: "https://github.com/SivanPesahov/Task-Management",
  },
];

const FALLBACK_PROJECTS: ProjectCard[] = PROJECT_META.map((m) => ({
  slug: m.slug, cls: m.cls, c1: m.c1, c2: m.c2, badge: m.badge, tags: m.tags, delay: m.delay,
  title: m.fallbackTitle, desc: m.fallbackDesc, image: m.fallbackImage, href: m.fallbackHref,
}));

function useProjects(): ProjectCard[] {
  const [projects, setProjects] = useState<ProjectCard[]>(FALLBACK_PROJECTS);

  useEffect(() => {
    let cancelled = false;
    listProjects()
      .then(({ items }) => {
        if (cancelled || !items?.length) return;
        const bySlug = new Map(items.map((p) => [p.slug, p]));
        setProjects(
          PROJECT_META.map((m) => {
            const db = bySlug.get(m.slug);
            if (!db) {
              return {
                slug: m.slug, cls: m.cls, c1: m.c1, c2: m.c2, badge: m.badge, tags: m.tags, delay: m.delay,
                title: m.fallbackTitle, desc: m.fallbackDesc, image: m.fallbackImage, href: m.fallbackHref,
              };
            }
            return {
              slug: m.slug, cls: m.cls, c1: m.c1, c2: m.c2, badge: m.badge, tags: m.tags, delay: m.delay,
              title: db.title || m.fallbackTitle,
              desc: db.short_description || m.fallbackDesc,
              image: db.image_url_desktop || db.image_url || m.fallbackImage,
              href: db.live_url || db.repo_url || m.fallbackHref,
            };
          })
        );
      })
      .catch(() => {
        // Keep the static fallback content — never break the page if the API is down.
      });
    return () => { cancelled = true; };
  }, []);

  return projects;
}

function HomePage() {
  const projects = useProjects();

  // Reveal on scroll
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <>
      {/* ── HERO ── */}
      <section id="hero" className="hero wrap">
        <div className="tile h-name reveal">
          <h1>
            I build <span className="tag">software</span>
            <br />
            that <span className="scribble">actually</span> ships
            <span className="dotEnd">.</span>
          </h1>

          <div className="h-currently" aria-label="Currently">
            <span className="pulseDot" />
            <span className="ctext">
              <span className="clab">Currently</span>
              <span className="cval">
                Shipping at <em>Konimbo</em> — production e‑commerce at scale.
              </span>
            </span>
          </div>

          <div className="meta">
            <span className="chip">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="9" />
                <path d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18" />
              </svg>
              Remote / Israel
            </span>
            <span className="chip">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 11l9-7 9 7" /><path d="M5 10v9h14v-9" />
              </svg>
              Konimbo · JS Developer
            </span>
          </div>
        </div>

        <div className="tile h-photo reveal d1">
          <div className="ph" />
          <img src="/ProfileWithoutBG.png" alt="Sivan portrait" />
          <div className="frameLabel">SP · 2026</div>
          <div className="frameTag">
            <b>Sivan Pesahov</b>Full‑Stack Developer
          </div>
        </div>

        <div className="tile h-bio reveal d2">
          <p>
            <strong>Hey, I'm Sivan.</strong> Full‑stack developer crafting modern web apps
            with React, Next.js, Node and Python. Former special‑ops combat soldier —
            same discipline, different keyboard.
          </p>
        </div>

        <div className="tile h-stats reveal d2">
          <div className="s">
            <div className="v"><em>2+</em></div>
            <div className="l">Years</div>
          </div>
          <div className="s">
            <div className="v"><em>20+</em></div>
            <div className="l">Shipped</div>
          </div>
          <div className="s">
            <div className="v">100<em>%</em></div>
            <div className="l">Coffee</div>
          </div>
          <div className="s">
            <div className="v">∞</div>
            <div className="l">Curiosity</div>
          </div>
        </div>

        <div className="tile h-cta reveal d3">
          <a
            className="btn primary"
            href="#projects"
            onClick={(e) => { e.preventDefault(); document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" }) }}
          >
            View work <span className="arrow">→</span>
          </a>
          <a className="btn" href="/CV-Sivan-Pesahov.pdf" download="CV-Sivan-Pesahov.pdf">CV</a>
          <a
            className="btn"
            href="#contact"
            onClick={(e) => { e.preventDefault(); document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }) }}
          >
            Say hi
          </a>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" className="about wrap">
        <div className="secHead">
          <div>
            <div className="secLabel"><span className="bar" />01 — About</div>
            <h2>
              Field <span className="tag">discipline</span>,
              <br />
              <span className="scribble">frontend</span> craft.
            </h2>
          </div>
          <div style={{ maxWidth: 360, color: "var(--ink-soft)", fontSize: 15, lineHeight: 1.6 }}>
            The path is unusual. The throughline is calm execution under pressure.
          </div>
        </div>
        <div className="aboutGrid">
          <div className="tile a-bio reveal">
            <p>
              <strong>Full Stack Developer</strong> with a strong foundation in scalable, user‑centric
              web applications. I come from a background as a <strong>combat soldier</strong> in a{" "}
              <strong>special operations unit</strong>, where I gained discipline, resilience, and the
              ability to perform under pressure — qualities that continue to shape the way I approach
              engineering challenges.
            </p>
            <p>
              After completing the intensive <strong>"Warriors to High‑Tech"</strong> program and a
              hands‑on full‑stack internship at <strong>Relyon.ai</strong>, I transitioned into the
              industry and now work as a <strong>JavaScript Developer at Konimbo</strong>, developing
              production‑grade features for high‑traffic e‑commerce platforms.
            </p>
            <p>
              My daily work spans React, Next.js, Node.js, TypeScript, MongoDB, MySQL and modern dev
              practices. I love solving complex problems, optimizing UX, and building clean systems at scale.
            </p>
          </div>
          <div className="a-side">
            <div className="tile a-quote reveal d1">
              <div className="l">Currently</div>
              <div className="v" style={{ marginTop: 8 }}>JS Dev at <em>Konimbo</em></div>
              <div className="role" style={{ marginTop: 6 }}>
                Production e‑commerce. High‑traffic stores. Strict perf budgets.
              </div>
            </div>
            <div className="tile a-pic reveal d2">
              <div className="ph" />
              <img src="https://res.cloudinary.com/dipx5fuza/image/upload/v1781976290/D792F933-3C76-4A4A-8222-D9F2BC2283F7_1_105_c_zoiboq.jpg" alt="Sivan presenting at work" />
              <div className="lbl">In the field</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SKILLS ── */}
      <section id="skills" className="skills">
        <div className="wrap">
          <div className="secHead">
            <div>
              <div className="secLabel"><span className="bar" />02 — Stack</div>
              <h2>
                The <span className="scribble">toolbox</span>
                <br />I reach for.
              </h2>
            </div>
            <div style={{ maxWidth: 360, color: "var(--ink-soft)", fontSize: 15, lineHeight: 1.6 }}>
              Strong on the JS side. Comfortable on the Python side. Always learning
              whatever the problem calls for.
            </div>
          </div>
        </div>
        <div className="marquee">
          <div className="track">
            {makeChips(SKILLS_A, (i) => (i % 5 === 0 ? "accent" : ""))}
          </div>
        </div>
        <div className="marquee" style={{ marginTop: 12 }}>
          <div className="track rev">
            {makeChips(SKILLS_B, (i) => (i % 5 === 0 ? "dark" : ""))}
          </div>
        </div>
      </section>

      {/* ── WORK ── */}
      <section id="work" className="work wrap">
        <div className="workInner">
          <div className="workLeft">
            <div className="secLabel"><span className="bar" />03 — Experience</div>
            <h2>
              A path forged
              <br />under <span className="scribble">pressure</span>.
            </h2>
            <p>Four checkpoints. Each one taught me something the next one needed.</p>
            <div className="miniGrid">
              <div className="tile m">
                <div className="v"><em>2+</em></div>
                <div className="l">Years coding</div>
              </div>
              <div className="tile m">
                <div className="v"><em>4</em></div>
                <div className="l">Checkpoints</div>
              </div>
            </div>
          </div>
          <div className="rail">
            <div className="step reveal">
              <div className="tile">
                <div className="stepHead">
                  <div>
                    <h3>Konimbo</h3>
                    <div className="role">JavaScript Developer · Production e‑commerce at scale</div>
                  </div>
                  <div className="when">2024 — present</div>
                </div>
                <div className="stepBody">
                  Building production‑grade features for high‑traffic stores. Performance budgets, edge
                  cases, and the kind of engineering rigor you only learn in the field.
                </div>
                <div className="stepTags">
                  <span>JavaScript</span><span>Node</span><span>MySQL</span><span>Performance</span>
                </div>
              </div>
            </div>

            <div className="step reveal d1">
              <div className="tile">
                <div className="stepHead">
                  <div>
                    <h3>Relyon.ai</h3>
                    <div className="role">Full‑Stack Intern · Real product, real users</div>
                  </div>
                  <div className="when">2024</div>
                </div>
                <div className="stepBody">
                  Shipped end‑to‑end features across React/Next on the frontend and Node/Python on the
                  backend. First taste of the velocity industry expects.
                </div>
                <div className="stepTags">
                  <span>Next.js</span><span>React</span><span>Python</span><span>REST</span>
                </div>
              </div>
            </div>

            <div className="step reveal d2">
              <div className="tile">
                <div className="stepHead">
                  <div>
                    <h3>Warriors to High‑Tech</h3>
                    <div className="role">Intensive full‑stack program for elite veterans</div>
                  </div>
                  <div className="when">2023 — 2024</div>
                </div>
                <div className="stepBody">
                  Twelve months of structured learning across the modern web stack. Earned my place
                  by output, not pedigree.
                </div>
                <div className="stepTags">
                  <span>TypeScript</span><span>Express</span><span>MongoDB</span><span>Redis</span>
                </div>
              </div>
            </div>

            <div className="step reveal d3">
              <div className="tile">
                <div className="stepHead">
                  <div>
                    <h3>IDF — Special Operations</h3>
                    <div className="role">Combat soldier · Where the mindset was built</div>
                  </div>
                  <div className="when">earlier</div>
                </div>
                <div className="stepBody">
                  Discipline, resilience, decision‑making under pressure. I bring all of it to my keyboard.
                </div>
                <div className="stepTags">
                  <span>Discipline</span><span>Pressure</span><span>Teamwork</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PROJECTS ── */}
      <section id="projects" className="projects wrap">
        <div className="secHead">
          <div>
            <div className="secLabel"><span className="bar" />04 — Selected work</div>
            <h2>Things I've <span className="scribble">shipped</span>.</h2>
          </div>
          <a
            href="https://github.com/SivanPesahov?tab=repositories"
            target="_blank"
            rel="noreferrer"
            className="btn"
          >
            All repos on GitHub →
          </a>
        </div>
        <div className="pGrid">
          {projects.map((proj) => (
            <a
              key={proj.slug}
              className={`${proj.cls} reveal${proj.delay ? " " + proj.delay : ""}${proj.image ? " has-img" : ""}`}
              href={proj.href}
              target="_blank"
              rel="noreferrer"
              style={{ "--c1": proj.c1, "--c2": proj.c2 } as React.CSSProperties}
            >
              <div className="pBg" />
              {proj.image && <img className="pScreen" src={proj.image} alt={proj.title} />}
              <div className="pArrow">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M7 17 17 7M9 7h8v8" />
                </svg>
              </div>
              <div className="pInner">
                <span className="pBadge">{proj.badge}</span>
                <div>
                  <h3 className="pTitle">{proj.title}</h3>
                  <p className="pDesc" style={{ marginTop: proj.cls.includes("p1") || proj.cls.includes("p2") ? 8 : 6 }}>
                    {proj.desc}
                  </p>
                  <div className="pTags" style={{ marginTop: proj.cls.includes("p1") || proj.cls.includes("p2") ? 16 : 12 }}>
                    {proj.tags.map((t) => <span key={t}>{t}</span>)}
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" className="contact wrap">
        <div className="contactGrid">
          <div className="tile c-main reveal">
            <div className="blob" />
            <div className="secLabel" style={{ marginBottom: 14 }}>
              <span className="bar" />05 — Let's talk
            </div>
            <h2>
              Got an idea
              <br />worth <span className="tag">building</span>?
            </h2>
            <p>
              I'm currently open to roles and freelance collaborations where the work is meaningful
              and the team cares about craft. Drop a line — I reply quickly.
            </p>
            <div className="row">
              <a className="btn primary" href="mailto:sivanp27540@gmail.com">
                sivanp27540@gmail.com <span className="arrow">→</span>
              </a>
              <a className="btn" href="https://www.linkedin.com/in/sivanpesahov/" target="_blank" rel="noreferrer">
                LinkedIn
              </a>
              <a className="btn" href="https://github.com/SivanPesahov" target="_blank" rel="noreferrer">
                GitHub
              </a>
            </div>
          </div>
          <div className="c-side">
            <div className="tile c-mini reveal d1">
              <div className="l">Email</div>
              <div className="v"><a href="mailto:sivanp27540@gmail.com">sivanp27540@gmail.com</a></div>
            </div>
            <div className="tile c-mini reveal d2">
              <div className="l">Response time</div>
              <div className="v">Within <em>24h</em>, usually faster.</div>
            </div>
            <div className="tile c-mini reveal d3">
              <div className="l">CV</div>
              <div className="v"><a href="/CV-Sivan-Pesahov.pdf" download="CV-Sivan-Pesahov.pdf">Download PDF →</a></div>
            </div>
          </div>
        </div>
      </section>

      <footer className="v3 wrap">
        <div>© 2026 Sivan Pesahov · Bento variant</div>
        <div className="links">
          <a href="#hero" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }) }}>Top ↑</a>
          <a href="https://github.com/SivanPesahov" target="_blank" rel="noreferrer">GitHub</a>
          <a href="https://www.linkedin.com/in/sivanpesahov/" target="_blank" rel="noreferrer">LinkedIn</a>
        </div>
      </footer>
    </>
  );
}

export default HomePage;
