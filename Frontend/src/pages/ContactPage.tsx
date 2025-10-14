import ContactForm from "../components/ContactForm";

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-semibold tracking-tight">Contact</h1>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
        Have a question or want to discuss a project? Fill out the form and I’ll
        get back to you.
      </p>
      <ContactForm />
    </div>
  );
}
