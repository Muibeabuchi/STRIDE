import { z } from "zod";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { useState } from "react";
import { useRouter } from "@tanstack/react-router";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthActions } from "@convex-dev/auth/react";
import { DottedSeparator } from "@/components/doted-separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { signupSchema } from "../schema";

export function SignUpCard() {
  const router = useRouter();
  const [isRegistering, setIsRegistering] = useState(false);
  const { signIn } = useAuthActions();

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async ({
    email,
    name,
    password,
  }: z.infer<typeof signupSchema>) => {
    setIsRegistering(true);
    try {
      await signIn("password", { email, password, name, flow: "signUp" });
      toast.success("Registered Successfully");
      //   router.replace("/");
    } catch (error) {
      toast.error("Failed to Register");
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <Card className="w-full h-full md:w-[486px] border-none shadow-none ">
      <CardHeader className="flex flex-col items-center justify-center text-center p-7">
        <CardTitle className="text-2xl">Sign Up</CardTitle>
        {/* <CardDescription className="text-2xl">
          By signing up you agree to our {""}
          <Link to=".">
            <span className="text-blue-700">Privacy policy</span>
          </Link>
          and {""}
          <Link to=".">
            <span className="text-blue-700">Terms of Service</span>
          </Link>
        </CardDescription> */}
      </CardHeader>
      <div className="px-7 ">
        <DottedSeparator />
      </div>
      <CardContent className="flex flex-col p-7 gap-y-4">
        <Button
          variant="outline"
          size="lg"
          className="w-full"
          disabled={false}
          onClick={() => void signIn("google")}
        >
          <FcGoogle className="mr-2 size-5" />
          Log In with Google
        </Button>
        <Button variant="outline" size="lg" className="w-full" disabled={false}>
          <FaGithub className="mr-2 size-5" />
          Log In with Github
        </Button>
      </CardContent>
      <div className="px-7">
        <DottedSeparator />
      </div>
      {/* <CardContent className="p-7">
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder="Enter your Name"
                      disabled={true}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="Enter Email address"
                      disabled={true}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="Enter your Password"
                      disabled={true}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={true} size="lg" className="w-full">
              Sign Up
            </Button>
          </form>
        </Form>
      </CardContent>
      <div className="px-7">
        <DottedSeparator />
      </div> */}

      <CardContent className="p-7 flex items-center justify-center">
        <p className="">
          Already have an account?
          <Link to="/sign-in/$">
            <span className="text-blue-700"> Sign In</span>
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
