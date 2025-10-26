import ContactForm from "../components/ContactForm";
import Typing from "../components/Typing";

export default function ContactPage() {
  return (
    <main className="h-full flex flex-col justify-between items-center px-4 lg:text-left lg:py-[4vh]">
      <section className="sm:mb-10 py-[2vh] lg:py-0 px-6">
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl bg-gradient-to-r from-black/80 to-black/60 bg-clip-text text-transparent dark:from-white/90 dark:to-white/70">
          <Typing strArr={["Get in touch"]} />
        </h1>
        <p className="mt-2 max-w-prose text-sm text-black/70 dark:text-white/70">
          Have a question or want to discuss a project? Fill out the form and
          I’ll get back to you.
        </p>
      </section>

      <section className="my-2 w-[95%] md:w-[60%]">
        <ContactForm />
      </section>

      <footer className="mt-2">
        <p className="text-center text-xs text-black/60 dark:text-white/60">
          I usually reply within 1-2 business days.
        </p>
      </footer>
    </main>
  );
}
