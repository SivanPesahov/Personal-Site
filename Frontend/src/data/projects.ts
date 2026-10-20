// Static snapshot of project content, frozen on 2026-10-17 from the live
// Railway-backed API before the backend was retired. The personal site no
// longer talks to a server or database at runtime — this file (plus the
// Cloudinary-hosted images it references, which are independent of Railway)
// *is* the data source. Source JSON lives in /migration-snapshot for reference.
//
// To refresh this later (e.g. a new project shipped), edit this file by hand.

export type StaticProject = {
  slug: string;
  title: string;
  short_description: string;
  description_md: string;
  image_url_desktop: string;
  image_url_mobile: string;
  images: string[];
  repo_url: string;
  live_url: string;
};

export type StaticComment = {
  id: number;
  name: string;
  content: string;
  created_at: string;
};

export const PROJECTS: Record<string, StaticProject> = {
  "crypto-streamer": {
    slug: "crypto-streamer",
    title: "Crypto Streamer",
    short_description: "Realtime crypto dashboard with queues & caching",
    description_md: "# Crypto Streamer\n\nNext.js App Router + RabbitMQ + Redis + MySQL + Prisma.\nRealtime prices, risers/fallers, and 7-day history persisted to DB.",
    image_url_desktop: "https://res.cloudinary.com/dipx5fuza/image/upload/v1760530334/Screenshot_2025-08-25_at_16.18.39_m9mtq9.png",
    image_url_mobile: "https://res.cloudinary.com/dipx5fuza/image/upload/v1761128257/Screenshot_2025-10-22_at_13.17.05_o7nt40.png",
    images: ["https://res.cloudinary.com/dipx5fuza/image/upload/v1760530334/Screenshot_2025-08-29_at_17.00.25_eodu7u.png", "https://res.cloudinary.com/dipx5fuza/image/upload/v1760530334/Screenshot_2025-08-29_at_16.58.48_afpgkt.png"],
    repo_url: "https://github.com/SivanPesahov/crypto-streamer",
    live_url: "",
  },
  "market-tracker": {
    slug: "market-tracker",
    title: "Market Tracker",
    short_description: "Watchlist + portfolio dashboard: tickers, deltas, history charts.",
    description_md: "# Market Tracker\n\nWatchlist and portfolio dashboard with live tickers, deltas, and history charts.",
    image_url_desktop: "https://res.cloudinary.com/dipx5fuza/image/upload/v1781976218/8b366e02-1650-4dcc-a1b8-ca2a305001d2.png",
    image_url_mobile: "https://res.cloudinary.com/dipx5fuza/image/upload/v1781976218/8b366e02-1650-4dcc-a1b8-ca2a305001d2.png",
    images: ["https://res.cloudinary.com/dipx5fuza/image/upload/v1781976218/8b366e02-1650-4dcc-a1b8-ca2a305001d2.png"],
    repo_url: "https://github.com/SivanPesahov/market-tracker",
    live_url: "",
  },
  "job-flow": {
    slug: "job-flow",
    title: "Job Flow",
    short_description: "AI-powered job tracking app for smarter career management",
    description_md: "# Job Flow\n\nAn AI-powered application for job seekers to track applications, get AI insights, and optimize job search strategies.\n\nBuilt with React, Node.js, TypeScript, Express, MongoDB, and ShadCN UI.",
    image_url_desktop: "https://res.cloudinary.com/dipx5fuza/image/upload/v1761481848/Screenshot_2025-10-26_at_14.30.42_ffraku.png",
    image_url_mobile: "https://res.cloudinary.com/dipx5fuza/image/upload/v1761481899/Screenshot_2025-10-26_at_14.31.35_xjccem.png",
    images: ["https://res.cloudinary.com/dipx5fuza/image/upload/v1761481848/Screenshot_2025-10-26_at_14.30.42_ffraku.png"],
    repo_url: "https://github.com/SivanPesahov/Job-Flow",
    live_url: "",
  },
  "relyon-landing": {
    slug: "relyon-landing",
    title: "Relyon Landing",
    short_description: "Product landing page with clean UX & SEO",
    description_md: "# Relyon Landing\n\nMarketing landing with responsive layout, SEO meta, and mobile-first design. Built with Next.js.",
    image_url_desktop: "https://res.cloudinary.com/dipx5fuza/image/upload/v1760530336/Screenshot_2025-08-25_at_16.46.12_yi6jf5.png",
    image_url_mobile: "https://res.cloudinary.com/dipx5fuza/image/upload/v1760530336/Screenshot_2025-08-25_at_16.46.12_yi6jf5.png",
    images: ["https://res.cloudinary.com/dipx5fuza/image/upload/v1760530990/Screenshot_2025-10-15_at_15.23.03_lmrjjp.png", "https://res.cloudinary.com/dipx5fuza/image/upload/v1760530960/Screenshot_2025-10-15_at_15.22.35_ge6nga.png", "https://res.cloudinary.com/dipx5fuza/image/upload/v1760530933/Screenshot_2025-10-15_at_15.22.05_uzgds1.png"],
    repo_url: "",
    live_url: "https://www.relyon.ai/",
  },
  "taskify": {
    slug: "taskify",
    title: "Taskify",
    short_description: "Task management with Kanban & analytics",
    description_md: "# Taskify\n\nTask manager that Includes task creation, categorization, and real-time updates. Built with React, Node + Express, and MongoDB.",
    image_url_desktop: "https://res.cloudinary.com/dipx5fuza/image/upload/v1760530336/Screenshot_2025-09-01_at_13.35.41_zdp1jy.png",
    image_url_mobile: "https://res.cloudinary.com/dipx5fuza/image/upload/v1761127784/Screenshot_2025-10-22_at_13.09.11_wkwiju.png",
    images: ["https://res.cloudinary.com/dipx5fuza/image/upload/v1760530337/Screenshot_2025-09-01_at_13.34.36_exprld.png", "https://res.cloudinary.com/dipx5fuza/image/upload/v1760530337/Screenshot_2025-09-01_at_13.36.39_b56jiw.png", "https://res.cloudinary.com/dipx5fuza/image/upload/v1760530337/Screenshot_2025-09-01_at_13.36.58_a5cvu0.png", "https://res.cloudinary.com/dipx5fuza/image/upload/v1760530336/Screenshot_2025-09-01_at_13.35.09_aiyyf1.png", "https://res.cloudinary.com/dipx5fuza/image/upload/v1760530335/Screenshot_2025-09-01_at_13.36.14_ucb8wx.png", "https://res.cloudinary.com/dipx5fuza/image/upload/v1760530334/Screenshot_2025-09-01_at_13.35.58_lk0for.png"],
    repo_url: "https://github.com/SivanPesahov/Task-Management",
    live_url: "https://task-management-e4on.onrender.com/",
  }
};

export const PROJECT_COMMENTS: Record<string, StaticComment[]> = {
  "crypto-streamer": [
    { id: 1, name: "Sivan", content: "Awesome work!", created_at: "2025-10-26T14:07:28" }
  ],
  "market-tracker": [

  ],
  "job-flow": [

  ],
  "relyon-landing": [
    { id: 5, name: "Elad", content: "greate!!!!!!!", created_at: "2025-11-24T19:23:02" },
    { id: 4, name: "Shaked", content: "it looks amazing!", created_at: "2025-10-27T11:23:22" },
    { id: 2, name: "Sivan", content: "great job!", created_at: "2025-10-26T21:45:04" }
  ],
  "taskify": [
    { id: 3, name: "Shaked", content: "great job sivan!", created_at: "2025-10-26T22:17:52" }
  ]
};
