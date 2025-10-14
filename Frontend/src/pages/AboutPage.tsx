import React from "react";
import { Link } from "react-router-dom";

function AboutPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-8 leading-7">
      <h1 className="text-3xl font-bold mb-4">About Me — סיון פסחוב</h1>

      <p className="mb-4">
        היי! אני סיון פסחוב, מפתח פול־סטאק עם פוקוס חזק על Frontend ומערכות
        בזמן־אמת. אני בונה אפליקציות סקיילביליות מקצה לקצה עם{" "}
        <strong>React/Next.js</strong>, צד־שרת ב־<strong>Node.js</strong> או{" "}
        <strong>Python/Flask</strong>, עבודה עם
        <strong> REST APIs</strong>, ו־DB רלציוני/NoSQL. בוגר תוכנית
        <strong> “לוחמים להייטק”</strong> עם התמחות ב־Relyon, ועם רקע פיקודי
        מצה"ל שמביא איתו עבודה מדויקת תחת לחץ, תיעדוף נכון ותשומת לב לפרטים.
      </p>

      <p className="mb-4">
        בפרויקטים האחרונים שלי שילבתי <strong>Redis</strong> ו־
        <strong>RabbitMQ</strong> לזרימות נתונים, ו־<strong>MySQL</strong> עם
        ORM כמו
        <strong> Prisma</strong> או <strong>SQLAlchemy</strong> לצד מיגרציות עם
        <strong> Alembic</strong>. בין הפרויקטים הבולטים:{" "}
        <em>Crypto‑Streamer</em>
        (דשבורד בזמן־אמת לנתוני קריפטו), <em>Taskify</em> (ניהול משימות), ו־
        <em>Personal‑Site</em> (האתר הנוכחי) שמחבר Flask + Next.js.
      </p>

      <p className="mb-6">
        אני אוהב קוד נקי, בדיקות ידניות מסודרות, אוטומציה, ו־UX בעל ביצועים
        גבוהים ונגישות. פתוח לאתגר הבא בצוות איכותי — ומחפש סביבות שבהן אפשר
        ללמוד מהר, לקחת אחריות ולהניע פיצ'רים מקצה לקצה.
      </p>

      <section aria-label="Skills" className="mb-7">
        <h2 className="text-xl font-semibold mb-2">Stack ויכולות</h2>
        <ul className="flex flex-wrap gap-2 list-none p-0">
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
            <li
              key={skill}
              className="border border-neutral-200 dark:border-neutral-700 rounded-full px-3 py-1 text-sm bg-white dark:bg-neutral-900"
            >
              {skill}
            </li>
          ))}
        </ul>
      </section>

      <div className="flex gap-3">
        <a
          href="/CV-Sivan-Pesahov.pdf"
          download
          className="inline-flex items-center px-4 py-2 rounded-md border border-neutral-900 dark:border-neutral-100 font-semibold hover:bg-neutral-50 dark:hover:bg-neutral-800 transition"
        >
          Download CV
        </a>
        <Link
          to="/contact"
          className="inline-flex items-center px-4 py-2 rounded-md border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition"
        >
          צור קשר
        </Link>
      </div>
    </main>
  );
}

export default AboutPage;
