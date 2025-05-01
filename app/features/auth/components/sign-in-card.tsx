import { z } from "zod";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

import { useState } from "react";

import { Link, useRouter } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthActions } from "@convex-dev/auth/react";
import { DottedSeparator } from "@/components/doted-separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { loginSchema } from "../schema";

export function SignInCard() {
  const router = useRouter();

  const { signIn } = useAuthActions();
  const [isSigningIn, setIsSigningIn] = useState(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    setIsSigningIn(true);
    try {
      await signIn("password", { ...values, flow: "signIn" });
      toast.success("Signed In Successfully");
      //   router.refresh();
    } catch (error) {
      toast.error("Failed to Sign In");
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <Card className="w-full h-full md:w-[486px] border-none shadow-none ">
      <CardHeader className="flex items-center justify-center text-center p-7">
        <CardTitle className="text-2xl">Welcome back!</CardTitle>
      </CardHeader>
      <div className="px-7 ">
        <DottedSeparator />
      </div>

      <CardContent className="flex flex-col p-7 gap-y-4">
        <Button
          variant="secondary"
          size="lg"
          className="w-full"
          disabled={isSigningIn}
          onClick={() => {
            setIsSigningIn(true);
            void signIn("google");
          }}
        >
          <FcGoogle className="mr-2 size-5" />
          Log In with Google
        </Button>
        <Button
          variant="secondary"
          size="lg"
          className="w-full"
          disabled={isSigningIn}
          onClick={() => {
            setIsSigningIn(true);
            void signIn("github");
          }}
        >
          <FaGithub className="mr-2 size-5" />
          Log In with Github
        </Button>
      </CardContent>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7">
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={true}
                      type="email"
                      placeholder="Enter Email address"
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
                      disabled={true}
                      {...field}
                      type="password"
                      placeholder="Enter Password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              disabled={true}
              size="lg"
              className="w-full disabled:bg-red-500"
            >
              Sign In
            </Button>
          </form>
        </Form>
      </CardContent>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7 flex items-center justify-center">
        <p className="">
          Don&apos;t have an account?
          <Link to="/sign-up/$">
            <span className="text-blue-700">Sign Up</span>
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
