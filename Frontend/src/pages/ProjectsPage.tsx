import React, { useEffect, useState, useRef, Suspense } from "react";

import { listProjects, type Project } from "../services/projects.service";
import { GlassContainer } from "../components/GlassContainer";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "../components/ui/carousel";
import { Card, CardContent } from "../components/ui/card";
import { useMediaQuery } from "@uidotdev/usehooks";
import TextType from "../components/TextType";
import { useDarkMode } from "../contexts/DarkmodeContext";
// Remove Next.js dynamic import and use React.lazy instead
const CardSwap = React.lazy(() => import("../components/CardSwap"));
const SwapCard = React.lazy(() =>
  import("../components/CardSwap").then((m) => ({ default: m.Card }))
);

function ProjectsPage() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Stable numeric sizing for CardSwap (avoids intermittent GSAP misplacement)
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [dims, setDims] = useState<{ w: number; h: number }>({ w: 0, h: 0 });
  const [imagesReady, setImagesReady] = useState<boolean>(false);

  // Force fresh mount on BFCache/back navigation
  const [remountKey, setRemountKey] = useState(0);
  useEffect(() => {
    const onPageShow = (e: PageTransitionEvent) => {
      // If restored from bfcache, re-mount CardSwap to reset GSAP state
      if (e && (e as any).persisted) setRemountKey((k) => k + 1);
    };
    window.addEventListener("pageshow", onPageShow);
    // Also detect back/forward navigation via PerformanceNavigationTiming
    try {
      const nav = performance.getEntriesByType(
        "navigation"
      ) as PerformanceNavigationTiming[];
      if (nav && nav[0] && nav[0].type === "back_forward") {
        setRemountKey((k) => k + 1);
      }
    } catch {}
    return () => window.removeEventListener("pageshow", onPageShow);
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      setLoading(true);
      setError(null);
      try {
        const res = await listProjects({ page: 1, page_size: 12 });
        if (!cancelled) {
          setProjects(res.items);
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
  }, []);

  function getPrimaryImage(p: Project): string {
    if (isMobile && p.image_url_mobile) return p.image_url_mobile;
    if (!isMobile && p.image_url_desktop) return p.image_url_desktop;
    if (p.image_url) return p.image_url;
    if (Array.isArray((p as any).images) && (p as any).images.length > 0)
      return (p as any).images[0];
    try {
      const arr = p.images_json ? JSON.parse(p.images_json) : [];
      if (Array.isArray(arr) && arr.length > 0) return arr[0];
    } catch {}
    return "https://picsum.photos/600/600?blur=1";
  }

  function getDesktopImage(p: Project): string {
    if (p.image_url_desktop) return p.image_url_desktop;
    if (p.image_url) return p.image_url;
    try {
      const arr = p.images_json ? JSON.parse(p.images_json) : [];
      if (Array.isArray(arr) && arr.length > 0) return arr[0];
    } catch {}
    return "https://picsum.photos/800/600?blur=1";
  }

  const items = projects.map((p) => ({
    image: getPrimaryImage(p),
    desktopImage: getDesktopImage(p),
    link: `projects/${encodeURIComponent(p.slug)}`,
    title: p.title,
    description: "",
  }));

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    const ro = new ResizeObserver(() => {
      const cw = node.clientWidth || 0;
      const w = Math.max(480, Math.min(640, Math.floor(cw * 0.85)));
      const h = Math.floor(w * 1.05);
      setDims((prev) => (prev.w === w && prev.h === h ? prev : { w, h }));
    });
    ro.observe(node);
    const cw0 = node.clientWidth || 0;
    const w0 = Math.max(480, Math.min(640, Math.floor(cw0 * 0.85)));
    const h0 = Math.floor(w0 * 1.05);
    setDims({ w: w0, h: h0 });
    return () => ro.disconnect();
  }, [projects.length]);

  useEffect(() => {
    const urls = items
      .slice(0, 3)
      .map((it) => it.desktopImage)
      .filter(Boolean) as string[];
    if (urls.length === 0) {
      setImagesReady(true);
      return;
    }
    let loaded = 0;
    const done = () => {
      loaded += 1;
      if (loaded >= urls.length) setImagesReady(true);
    };
    urls.forEach((u) => {
      const img = new Image();
      img.onload = done;
      img.onerror = done;
      img.src = u;
    });
  }, [projects.length]);

  const { darkMode } = useDarkMode();

  return (
    <div className="max-w-5xl  mx-auto py-8">
      {loading && <p style={{ marginTop: 16 }}>Loading…</p>}
      {error && <p style={{ marginTop: 16, color: "red" }}>Error: {error}</p>}

      {isMobile && (
        <div>
          <div className="text-center mb-8">
            <h1 className="text-3xl font-semibold text-gray-900 dark:text-white mb-2">
              <TextType
                text={["My Projects"]}
                typingSpeed={75}
                pauseDuration={1500}
                showCursor={true}
                cursorCharacter="|"
                textColors={[darkMode ? "white" : "black"]}
              />
            </h1>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              <TextType
                text={[
                  "Explore a selection of my personal and professional projects -",
                  "each designed, developed, and refined with attention to detail,",
                  "creativity, and clean code. You can scroll the area to discover more projects!",
                ]}
                typingSpeed={75}
                pauseDuration={1500}
                showCursor={true}
                cursorCharacter="|"
                textColors={[darkMode ? "white" : "black"]}
              />
            </p>
          </div>
          <Carousel
            className="w-full max-w-sm mx-auto"
            opts={{ align: "center", loop: true, containScroll: "keepSnaps" }}
          >
            <CarouselContent className="gap-4 px-6">
              {items.map((item) => (
                <CarouselItem key={item.link} className="basis-[85%]">
                  <div className="p-2">
                    <a href={item.link} className="block">
                      <Card className="overflow-hidden rounded-3xl ring-1 ring-white/10 dark:ring-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.25)] bg-white/5 dark:bg-white/0 backdrop-blur-xl relative">
                        <CardContent className="p-0">
                          <span
                            aria-hidden="true"
                            className="pointer-events-none absolute -top-8 -right-8 h-36 w-36 rounded-full bg-gradient-to-br from-white/40 to-fuchsia-400/30 blur-2xl opacity-30"
                          />
                          <div className="w-full aspect-[3/4] overflow-hidden">
                            <img
                              src={item.image}
                              alt={item.title}
                              className="h-full w-full object-cover"
                              loading="lazy"
                            />
                          </div>
                          <GlassContainer className="relative m-3 p-4 rounded-2xl bg-white/10 dark:bg-white/5 backdrop-blur-xl ring-1 ring-white/20 shadow-[0_6px_24px_rgba(0,0,0,0.20)] text-gray-900 dark:text-gray-100 overflow-hidden before:content-[''] before:absolute before:-inset-0.5 before:rounded-[1.25rem] before:bg-gradient-to-br before:from-white/50 before:to-transparent before:opacity-20 before:blur-xl after:content-[''] after:absolute after:inset-px after:rounded-[1.15rem] after:bg-white/5 after:opacity-60">
                            <h3 className="text-lg font-semibold text-center line-clamp-1">
                              {item.title}
                            </h3>
                          </GlassContainer>
                        </CardContent>
                      </Card>
                    </a>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      )}
      {!isMobile && (
        <div className="flex items-center justify-between gap-8 ">
          <div className="flex-1 text-left space-y-4 max-w-md">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              <TextType
                text={["My Projects"]}
                typingSpeed={75}
                pauseDuration={1500}
                showCursor={true}
                cursorCharacter="|"
                textColors={[darkMode ? "white" : "black"]}
              />
            </h1>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              <TextType
                text={[
                  "Explore a selection of my personal and professional projects -",
                  "each designed, developed, and refined with attention to detail,",
                  "creativity, and clean code. You can scroll the area to discover more projects!",
                ]}
                typingSpeed={75}
                pauseDuration={1500}
                showCursor={true}
                cursorCharacter="|"
                textColors={[darkMode ? "white" : "black"]}
              />
            </p>
          </div>
          <div
            ref={containerRef}
            className="relative flex-1"
            style={{ height: (dims.h || 640) * 0.9, marginTop: "8vh" }}
          >
            <Suspense fallback={null}>
              {mounted && imagesReady && dims.w > 0 && dims.h > 0 && (
                <CardSwap
                  key={`cardswap-${remountKey}-${dims.w}x${dims.h}-${projects.length}`}
                  width={dims.w}
                  height={dims.h}
                  cardDistance={64}
                  verticalDistance={72}
                  skewAmount={6}
                  delay={3000}
                  easing="elastic"
                >
                  {items.map((item) => (
                    <SwapCard
                      key={item.link}
                      onClick={() => (window.location.href = item.link)}
                      className="shadow-2xl hover:scale-[1.02] rounded-3xl ring-1 ring-white/10 backdrop-blur-xl bg-white/5 dark:bg-white/0"
                    >
                      <div className="relative w-full h-full rounded-3xl overflow-hidden">
                        <span
                          aria-hidden="true"
                          className="pointer-events-none absolute -top-10 -left-10 h-44 w-44 rounded-full bg-gradient-to-br from-fuchsia-400/40 to-cyan-300/30 blur-2xl opacity-30"
                        />
                        <img
                          src={item.desktopImage}
                          alt={item.title}
                          className="absolute inset-0 w-full h-full object-cover"
                          loading="lazy"
                        />
                        <GlassContainer className="absolute bottom-3 left-3 right-3 p-4 rounded-2xl bg-white/10 dark:bg-white/5 backdrop-blur-xl ring-1 ring-white/20 shadow-[0_6px_24px_rgba(0,0,0,0.20)] text-white overflow-hidden before:content-[''] before:absolute before:-inset-0.5 before:rounded-[1.25rem] before:bg-gradient-to-br before:from-white/40 before:to-transparent before:opacity-20 before:blur-xl after:content-[''] after:absolute after:inset-px after:rounded-[1.15rem] after:bg-white/5 after:opacity-60">
                          <h3 className="text-lg font-semibold text-center">
                            {item.title}
                          </h3>
                        </GlassContainer>
                      </div>
                    </SwapCard>
                  ))}
                </CardSwap>
              )}
            </Suspense>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProjectsPage;
