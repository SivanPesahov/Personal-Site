import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../contexts/AuthContext";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import type { FormItemForLogin } from "../types/formType";

// -- redux
// import { useDispatch, useSelector } from "react-redux";
// import { login, fetchUser } from "../store/authSlice";
// import type { RootState, AppDispatch } from "../store/store";

const loginSchema = z.object({
  username: z.string().min(3, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginData = z.infer<typeof loginSchema>;

function LoginPage() {
  const { login, loggedInUser } = useAuth();

  // -- redux
  // const dispatch = useDispatch<AppDispatch>();
  // const loggedInUser = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();

  const form = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const formItemRenderList: FormItemForLogin[] = [
    { name: "username", placeholder: "johndoe123", label: "User name" },
    {
      name: "password",
      placeholder: "******",
      inputType: "password",
      label: "Password",
    },
  ];

  useEffect(() => {
    if (loggedInUser) {
      navigate("/route2", { replace: true });
    }
  }, [loggedInUser, navigate]);

  const onSubmit = async (values: LoginData) => {
    try {
      await login(values);

      // -- redux
      // await dispatch(login(values)).unwrap();
      // await dispatch(fetchUser()).unwrap();
      console.log("Login successful:", values);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <Card className="w-full max-w-sm ">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>
          Enter your username and password below to login to your account
        </CardDescription>
      </CardHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 ">
          <CardContent className="space-y-4">
            {formItemRenderList.map((fieldToRender: FormItemForLogin) => {
              return (
                <FormField
                  key={fieldToRender.name}
                  control={form.control}
                  name={fieldToRender.name}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{fieldToRender.label}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={fieldToRender.placeholder}
                          type={fieldToRender.inputType ?? "text"}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              );
            })}
          </CardContent>

          <CardFooter className="flex-col w-full">
            <Button type="submit" className="w-full">
              Login
            </Button>
            <Link to="/auth/register" className="w-full">
              <Button variant="outline" className="w-full mt-2">
                Register
              </Button>
            </Link>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

export default LoginPage;
