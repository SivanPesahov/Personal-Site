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
import type { FormItemForRegister } from "../types/formType";

// -- redux
// import { useDispatch, useSelector } from "react-redux";
// import type { RootState, AppDispatch } from "../store/store";
// import { register } from "../store/slices/authSlice";

const formSchema = z.object({
  username: z.string().min(3),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
});

type FormData = z.infer<typeof formSchema>;

function RegisterPage() {
  const { register, loggedInUser } = useAuth();

  // -- redux
  // const dispatch = useDispatch<AppDispatch>();
  // const loggedInUser = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (loggedInUser) {
      navigate("/route2", { replace: true });
    } else {
      console.log("Error registering");
      console.log(
        "Registration failed, please check your details and try again"
      );
    }
  }, [loggedInUser]);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: FormData) {
    console.log("Submitted user:", values);
    try {
      await register(values);

      // -- redux
      // await dispatch(register(values)).unwrap();
      console.log(values);
    } catch (error: any) {
      console.log(error);
    }
  }

  const formItemRenderList: FormItemForRegister[] = [
    { name: "username", placeholder: "johndoe123", label: "User Name" },
    { name: "firstName", placeholder: "John", label: "First Name" },
    { name: "lastName", placeholder: "Dow", label: "Last Name" },
    {
      name: "email",
      placeholder: "john@example.com",
      inputType: "email",
      label: "Email",
    },
    {
      name: "password",
      placeholder: "******",
      inputType: "password",
      label: "Password",
    },
  ];

  return (
    <Card className="w-full max-w-sm ">
      <CardHeader>
        <CardTitle>Register</CardTitle>
        <CardDescription>
          Fill in your personal details in order to create an account
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <CardContent className="space-y-4">
            {formItemRenderList.map((fieldToRender: FormItemForRegister) => {
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
              Create user
            </Button>
            <Link to="/auth/login" className="w-full">
              <Button variant="outline" className="w-full mt-2">
                Already have an account?
              </Button>
            </Link>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

export default RegisterPage;
