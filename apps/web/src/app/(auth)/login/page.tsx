"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { RiGoogleFill } from "react-icons/ri";
import { TbBrandPrisma } from "react-icons/tb";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useGuestLogin } from "@/hooks/auth/use-auth";

const LoginPage = () => {
  const router = useRouter();

  const { mutate: loginAsGuest, isPending } = useGuestLogin();
  const handleGuestLogin = () => {
    loginAsGuest(undefined, {
      onSuccess: () => {
        router.push("/dashboard/tasks");
      },
    });
  };
  return (
    <div
      className={"flex flex-col min-h-screen items-center justify-center gap-6"}
    >
      <div className={"flex items-center gap-2"}>
        <div
          className={
            "bg-sidebar-primary size-6 rounded-md flex items-center justify-center"
          }
        >
          <TbBrandPrisma
            className={"text-sidebar-primary-foreground"}
            strokeWidth={2.2}
          />
        </div>
        <span className={"text-sm leading-none font-semibold"}>Pyramid</span>
      </div>
      <Card
        className={
          "rounded-4xl ring-1 shadow-xs p-6! gap-6 max-w-96 w-full text-center"
        }
      >
        <CardHeader className={"gap-1.5"}>
          <CardTitle className={"text-xl font-semibold lead-[100%]"}>
            Let's get back on track
          </CardTitle>
          <CardDescription>
            Enter your email below to login to your account.
          </CardDescription>
        </CardHeader>
        <CardContent className={"flex flex-col gap-3"}>
          <Button
            className={"cursor-pointer rounded-full"}
            onClick={handleGuestLogin}
            disabled={isPending}
          >
            {isPending ? "Signing in..." : "Continue as Guest"}
          </Button>
          <Button
            variant={"outline"}
            className={"cursor-pointer rounded-full"}
            disabled
          >
            <RiGoogleFill />
            Login with Google
          </Button>
        </CardContent>
      </Card>
      <div
        className={
          "w-full max-w-52 font-normal text-xs text-muted-foreground text-center"
        }
      >
        By clicking continue, you agree to our{" "}
        <Link href={"/"} className={"underline! underline-offset-3!"}>
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link href={"/"} className={"underline! underline-offset-3!"}>
          Privacy Policy
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
