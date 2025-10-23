import ContactForm from "../components/ContactForm";
import TextType from "../components/TextType";
import { useDarkMode } from "../contexts/DarkmodeContext";

export default function ContactPage() {
  const { darkMode } = useDarkMode();

  return (
    <div className="flex flex-col justify-start items-center min-h-screen px-4 sm:py-6 pt-20 text-left">
      <div className="relative mx-auto max-w-3xl">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
        ></div>

        <div className="sm:mb-10">
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl bg-gradient-to-r from-black/80 to-black/60 bg-clip-text text-transparent dark:from-white/90 dark:to-white/70">
            <TextType
              text={["Contact me!"]}
              typingSpeed={75}
              pauseDuration={1500}
              showCursor={true}
              cursorCharacter="|"
              textColors={[darkMode ? "white" : "black"]}
            />
          </h1>
          <p className="mt-2 max-w-prose text-sm text-black/70 dark:text-white/70">
            Have a question or want to discuss a project? Fill out the form and
            I’ll get back to you.
          </p>
        </div>

        <div
          className="pointer-events-none -mb-6 mt-2 h-10 w-full rounded-3xl bg-black/5 blur-xl dark:bg-black/40"
          aria-hidden
        />

        <ContactForm />

        <p className="mt-6 text-center text-xs text-black/60 dark:text-white/60">
          I usually reply within 1-2 business days.
        </p>
      </div>
    </div>
  );
}
