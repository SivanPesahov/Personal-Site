import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { postContact } from "../services/contact.service";
import Turnstile from "react-turnstile";
import { CAPTCHA_SITE_KEY } from "../config";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Button } from "../components/ui/button";
import { GlassContainer } from "./GlassContainer";
import GlassSurface from "./GlassSurface";
import { useDarkMode } from "../contexts/DarkmodeContext";

const ContactSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters"),
  email: z.string().email("Invalid email address"),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(1000, "Message is too long"),
});

type ContactFormValues = z.infer<typeof ContactSchema>;

export default function ContactForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [serverSuccess, setServerSuccess] = useState<string | null>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaKey, setCaptchaKey] = useState(0);
  const { darkMode } = useDarkMode();

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(ContactSchema),
  });
  const {
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = form;

  const onSubmit = async (values: ContactFormValues) => {
    setServerError(null);
    setServerSuccess(null);
    try {
      if (!captchaToken) {
        setServerError("Please verify yourself in the CAPTCHA");
        return;
      }
      await postContact({
        name: values.name,
        email: values.email,
        message: values.message,
        captchaToken,
      });
      setServerSuccess("Thanks! Your message has been sent.");
      reset();
      setCaptchaToken(null);
      setCaptchaKey((k) => k + 1);
    } catch (err: any) {
      setServerError(err?.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex justify-center max-w-2xl">
      <GlassSurface width={"60vw"} height={"60vh"} borderRadius={24}>
        <div className="w-full p-4">
          <Form {...form}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="h-full space-y-14 flex flex-col max-w-2xl"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-black/70 dark:text-white/80">
                      Name
                    </FormLabel>
                    <FormControl>
                      <GlassContainer>
                        <Input
                          placeholder="Your name"
                          autoComplete="name"
                          disabled={isSubmitting}
                          className="w-full h-[6vh] rounded-xl border"
                          {...field}
                        />
                      </GlassContainer>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-black/70 dark:text-white/80">
                      Email
                    </FormLabel>
                    <FormControl>
                      <GlassContainer>
                        <Input
                          type="email"
                          placeholder="you@example.com"
                          autoComplete="email"
                          disabled={isSubmitting}
                          className="w-full h-[6vh] rounded-xl border"
                          {...field}
                        />
                      </GlassContainer>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-black/70 dark:text-white/80">
                      Message
                    </FormLabel>
                    <FormControl>
                      <GlassContainer>
                        <Textarea
                          rows={6}
                          placeholder="Write your message..."
                          disabled={isSubmitting}
                          className="w-full h-[12vh] rounded-2xl border border-white/20 bg-white/10 backdrop-blur-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.25)] focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:border-white/60 placeholder:text-black/50 dark:placeholder:text-white/50"
                          {...field}
                        />
                      </GlassContainer>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="hidden">
                <Turnstile
                  key={captchaKey}
                  sitekey={CAPTCHA_SITE_KEY}
                  onVerify={(token) => setCaptchaToken(token)}
                  onError={() =>
                    setServerError("CAPTCHA error, please refresh")
                  }
                  onExpire={() => setCaptchaToken(null)}
                />
                {!captchaToken && (
                  <p className="text-xs text-black/60 dark:text-white/60">
                    You must verify CAPTCHA before submitting.
                  </p>
                )}
              </div>
              <div className="flex justify-center">
                <GlassContainer>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className={`rounded-xl border border-white/20 bg-white/10 backdrop-blur-md px-5 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_8px_24px_rgba(0,0,0,0.2)] transition hover:bg-white/20 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_10px_28px_rgba(0,0,0,0.28)] focus-visible:ring-2 focus-visible:ring-white/40 ${
                      darkMode ? "text-white/90" : "text-black/70"
                    }`}
                  >
                    {serverError
                      ? "Error!"
                      : serverSuccess
                      ? "Sent!"
                      : isSubmitting
                      ? "Sending..."
                      : "Send Message"}
                  </Button>
                </GlassContainer>
              </div>
            </form>
          </Form>
        </div>
      </GlassSurface>
    </div>
  );
}
