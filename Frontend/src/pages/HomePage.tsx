function HomePage() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 flex flex-col items-center text-center gap-6">
        {/* Profile image (place a file at /public/profile.jpg) */}
        <img
          src="/Profile.jpeg"
          alt="Sivan Pesahov portrait"
          className="h-32 w-32 rounded-full object-cover shadow-md"
          loading="eager"
        />

        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          Hi, I’m Sivan Pesahov — Full‑Stack Developer
        </h1>

        <p className="max-w-2xl text-base sm:text-lg text-gray-600">
          I build modern, performant web applications with React/Next.js on the
          frontend and Python/Flask on the backend. Passionate about clean UX,
          type‑safe code, and shipping value fast.
        </p>

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <a
            href="/contact"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
            aria-label="Contact Me"
          >
            Contact Me
          </a>
          <a
            href="https://www.linkedin.com/in/sivanpesahov/"
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center justify-center rounded-md border px-5 py-2.5 text-sm font-medium text-gray-900 border-gray-300 hover:bg-gray-50"
            aria-label="LinkedIn profile"
          >
            LinkedIn
          </a>
          <a
            href="https://github.com/SivanPesahov"
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center justify-center rounded-md border px-5 py-2.5 text-sm font-medium text-gray-900 border-gray-300 hover:bg-gray-50"
            aria-label="GitHub profile"
          >
            GitHub
          </a>
        </div>
      </section>
    </main>
  );
}

export default HomePage;
