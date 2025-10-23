import { Link } from "react-router-dom";
import GlassSurface from "../components/GlassSurface";

function HomePage() {
  return (
    <>
      <main className="flex flex-col lg:flex-row lg:justify-around items-center">
        <section className="order-2 lg:order-1 w-[90%] flex flex-col lg:w-[50vw] lg:py-[20vh] ">
          <p className="text-sm font-semibold tracking-widest text-gray-600 text-center lg:text-start py-2">
            HI, I’M SIVAN
          </p>

          <h1 className="text-4xl sm:text-6xl font-extrabold leading-tight tracking-tight py-2">
            I’M A FULL-STACK DEVELOPER
          </h1>

          <p className="  mx-auto text-base sm:text-lg text-gray-600 py-2 lg:text-start">
            I design and build modern, performant web apps with React/Next.js on
            the frontend and Flask/Python on the backend. Clean UX, strong
            engineering, and shipping value fast.
          </p>

          <div className="flex mt-2 lg:w-[40vw]">
            <GlassSurface
              width={"auto"}
              height={"auto"}
              borderRadius={12}
              className="mx-2"
            >
              <Link
                to={"/projects"}
                aria-label="View my projects"
                className="text-[12px] px-[20vw] "
              >
                VIEW MY PROJECTS
              </Link>
            </GlassSurface>
            <GlassSurface
              width={"auto"}
              height={"auto"}
              borderRadius={12}
              className="mx-2"
            >
              <a
                href="https://www.linkedin.com/in/sivanpesahov/"
                target="_blank"
                rel="noreferrer noopener"
                className="text-[12px] px-[20vw]"
                aria-label="LinkedIn profile"
              >
                LinkedIn
              </a>
            </GlassSurface>
            <GlassSurface
              width={"auto"}
              height={"auto"}
              borderRadius={12}
              className="mx-2"
            >
              <a
                href="https://github.com/SivanPesahov"
                target="_blank"
                rel="noreferrer noopener"
                className="text-[12px] px-[20vw]"
                aria-label="GitHub profile"
              >
                GitHub
              </a>
            </GlassSurface>
          </div>
        </section>
        <section className="order-1 lg:order-2 flex justify-center ">
          <img
            src="/ProfileWithoutBG.png"
            alt="Sivan Pesahov portrait"
            className="rounded-[2rem] object-cover h-[32vh] lg:h-[64vh]"
            loading="eager"
          />
        </section>
      </main>
    </>
  );
}

export default HomePage;
