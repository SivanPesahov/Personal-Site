import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Turnstile from "react-turnstile";
import { cn } from "../lib/utils";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { postProjectComment } from "../services/projects.service";
import { Textarea } from "./ui/textarea";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "./ui/form";
import { CAPTCHA_SITE_KEY } from "../config";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email"),
  content: z.string().min(5, "Comment must be at least 5 characters"),
});

type FormValues = z.infer<typeof schema>;

type Props = {
  projectSlug: string;
  className?: string;
  onSuccess?: () => void;
};

export default function CommentForm({
  projectSlug,
  className,
  onSuccess,
}: Props) {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: { name: "", email: "", content: "" },
  });
  const {
    handleSubmit,
    formState: { isSubmitting, isValid, isSubmitSuccessful },
    reset,
  } = form;

  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [captchaKey, setCaptchaKey] = useState(0);

  useEffect(() => {
    if (serverError) setServerError(null);
  }, [serverError]);

  const onSubmit = async (values: FormValues) => {
    setServerError(null);

    if (!captchaToken) {
      setServerError("Please verify yourself in the CAPTCHA");
      return;
    }

    try {
      await postProjectComment(projectSlug, {
        name: values.name,
        email: values.email,
        content: values.content,
        captchaToken,
      });

      reset();
      setCaptchaToken(null);
      setCaptchaKey((k) => k + 1);

      onSuccess?.();
    } catch (err: any) {
      const message =
        err?.response?.data?.error?.message ||
        err?.message ||
        "An error occurred while submitting the comment. Please try again.";
      setServerError(message);
    }
  };

  return (
    <div className={cn("rounded-2xl border p-4 md:p-6 space-y-4", className)}>
      <h3 className="text-lg font-semibold">Add a Comment</h3>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm">Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your full name" {...field} />
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
                <FormLabel className="text-sm">Email</FormLabel>
                <FormControl>
                  <Input placeholder="your@email.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm">Comment Content</FormLabel>
                <FormControl>
                  <Textarea
                    rows={5}
                    placeholder="What did you think about the project?"
                    {...field}
                  />
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
              onError={() => setServerError("CAPTCHA error, please refresh")}
              onExpire={() => setCaptchaToken(null)}
            />
            {!captchaToken && (
              <p className="text-xs text-muted-foreground">
                You must verify CAPTCHA before submitting.
              </p>
            )}
          </div>

          {serverError && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
              {serverError}
            </div>
          )}
          {isSubmitSuccessful && !serverError && (
            <div className="rounded-md bg-green-50 p-3 text-sm text-green-700">
              Your comment has been submitted and is awaiting approval (if
              applicable).
            </div>
          )}

          <Button
            type="submit"
            disabled={!isValid || isSubmitting || !captchaToken}
          >
            {isSubmitting ? "Sending…" : "Submit Comment"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
