"use client";

import {
  ArrowRight,
  CheckCheck,
  Layers3,
  LayoutDashboard,
  ListTodo,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useGuestLogin } from "@/hooks/auth/use-auth";
import { api } from "@/lib/api/client-api";

export default function LoginPage() {
  const router = useRouter();
  const [googlePending, setGooglePending] = useState(false);
  const [googleError, setGoogleError] = useState("");
  const loginWithGoogle = async () => {
    if (googlePending) return;
    setGooglePending(true);
    setGoogleError("");
    try {
      const response = await api.get("/auth/providers", { timeout: 10000 });
      if (!response.data.data.google) {
        setGoogleError(
          "Google sign-in is temporarily unavailable. Please try again or continue as a guest."
        );
        setGooglePending(false);
        return;
      }
      window.location.assign("/api/auth/google");
    } catch {
      setGoogleError("Could not reach the sign-in service. Please try again.");
      setGooglePending(false);
    }
  };
  const { mutate: loginAsGuest, isPending } = useGuestLogin();
  return (
    <main className="grid min-h-svh lg:grid-cols-2">
      <section className="relative hidden flex-col justify-between overflow-hidden bg-zinc-950 p-12 text-white lg:flex xl:p-16">
        <div className="flex items-center gap-3 text-lg font-semibold">
          <Layers3 className="size-7" />
          Task Manager
        </div>
        <div className="relative z-10 max-w-lg space-y-6">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-400">
            Clarity for every workday
          </p>
          <h1 className="text-5xl font-semibold leading-[1.1] tracking-tight xl:text-6xl">
            Great work starts
            <br />
            with a clear plan.
          </h1>
          <p className="max-w-md text-base leading-relaxed text-zinc-400">
            Bring projects, tasks, and conversations into one focused workspace.
            Know what matters. Keep moving forward.
          </p>
          <div className="space-y-4 pt-6">
            {[
              { icon: ListTodo, text: "Track every task from idea to done" },
              {
                icon: LayoutDashboard,
                text: "See your priorities in a single view",
              },
              { icon: CheckCheck, text: "Keep project updates in context" },
            ].map(({ icon: Icon, text }) => (
              <div
                key={text}
                className="flex items-center gap-3 text-sm text-zinc-300"
              >
                <span className="rounded-lg border border-white/10 bg-white/5 p-2">
                  <Icon className="size-4" />
                </span>
                {text}
              </div>
            ))}
          </div>
        </div>
        <p className="text-xs text-zinc-500">Less friction. More focus.</p>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-40 -bottom-48 size-[32rem] rounded-full border border-white/5 shadow-[0_0_0_80px_#ffffff03,0_0_0_160px_#ffffff02]"
        />
      </section>
      <section className="flex flex-col items-center justify-center bg-background px-6 py-12 sm:px-12">
        <div className="w-full max-w-sm">
          <div className="mb-12 flex items-center gap-3 text-sm font-semibold lg:hidden">
            <Layers3 className="size-6" />
            Task Manager
          </div>
          <span className="mb-6 flex size-12 items-center justify-center rounded-2xl border bg-card shadow-sm">
            <Layers3 className="size-6" />
          </span>
          <h2 className="text-3xl font-semibold tracking-tight">
            Welcome to your workspace
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Get organized, set priorities, and bring your next project to life.
          </p>
          <Button
            className="mt-8 h-11 w-full"
            disabled={googlePending || isPending}
            onClick={() => void loginWithGoogle()}
          >
            <span aria-hidden="true" className="font-bold">
              G
            </span>
            {googlePending ? "Connecting to Google…" : "Continue with Google"}
          </Button>
          {googleError && (
            <p role="alert" className="mt-3 text-sm text-destructive">
              {googleError}
            </p>
          )}
          <Button
            variant="outline"
            className="mt-3 h-11 w-full"
            disabled={isPending}
            onClick={() => {
              if (!isPending)
                loginAsGuest(undefined, {
                  onSuccess: () => router.replace("/dashboard"),
                });
            }}
          >
            {isPending ? "Preparing your workspace…" : "Continue as guest"}
            <ArrowRight />
          </Button>
          <p className="mt-4 text-center text-xs leading-relaxed text-muted-foreground">
            Try a guest workspace. Sign in with Google later to keep your work.
          </p>
        </div>
      </section>
    </main>
  );
}
