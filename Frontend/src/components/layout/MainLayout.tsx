import { Outlet, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

const NAV_SECTIONS = ["hero", "about", "skills", "work", "projects", "contact"];

function MainLayout() {
  const bgRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState("hero");
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  // Parallax background
  useEffect(() => {
    let raf: number | null = null;
    const bg = bgRef.current;
    if (!bg) return;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = null;
        bg.style.setProperty("--bgY", `-${window.scrollY * 0.18}px`);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Active section via IntersectionObserver (only on home page)
  useEffect(() => {
    if (!isHome) return;
    const ratios: Record<string, number> = {};
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { ratios[e.target.id] = e.intersectionRatio });
        const best = Object.entries(ratios).sort((a, b) => b[1] - a[1])[0];
        if (best && best[1] > 0) setActiveSection(best[0]);
      },
      { threshold: [0.2, 0.4, 0.6, 0.8] }
    );
    const els = NAV_SECTIONS.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [isHome, location.pathname]);

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false) }, [location.pathname]);

  function scrollTo(id: string) {
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({ top: el.offsetTop - 20, behavior: "smooth" });
    }
    setMobileOpen(false);
  }

  const navLabels: { id: string; label: string }[] = [
    { id: "hero", label: "Home" },
    { id: "about", label: "About" },
    { id: "skills", label: "Stack" },
    { id: "work", label: "Work" },
    { id: "projects", label: "Projects" },
  ];

  return (
    <div>
      {/* Parallax background */}
      <div className="v3-bg" ref={bgRef} id="v3-bg" />
      <div className="v3-grid-overlay" />

      {/* Desktop Nav */}
      <nav className="v3-nav">
        <div className="brand">
          Sivan Pesahov
        </div>
        {navLabels.map(({ id, label }) => (
          <a
            key={id}
            className={`pill${isHome && activeSection === id ? " active" : ""}`}
            onClick={(e) => { e.preventDefault(); scrollTo(id) }}
            href={`#${id}`}
          >
            {label}
          </a>
        ))}
        <a
          className="cta"
          onClick={(e) => { e.preventDefault(); scrollTo("contact") }}
          href="#contact"
        >
          Contact me ↗
        </a>
      </nav>

      {/* Mobile hamburger */}
      <button
        className="navBurger"
        aria-label="Open menu"
        onClick={() => setMobileOpen(true)}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      </button>

      {/* Mobile sheet */}
      <div
        className={`mobileSheet${mobileOpen ? " open" : ""}`}
        aria-hidden={!mobileOpen}
      >
        <div className="scrim" onClick={() => setMobileOpen(false)} />
        <div className="panel">
          {navLabels.map(({ id, label }) => (
            <a key={id} href={`#${id}`} onClick={(e) => { e.preventDefault(); scrollTo(id) }}>
              {label}
            </a>
          ))}
          <a href="#contact" onClick={(e) => { e.preventDefault(); scrollTo("contact") }}>
            Contact me ↗
          </a>
        </div>
      </div>

      {/* Page content */}
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;
