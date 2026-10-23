import Link from "next/link";
export default function AuthError() {
  return (
    <main className="flex min-h-svh items-center justify-center p-6">
      <section className="max-w-md rounded-xl border bg-card p-8 space-y-4">
        <h1 className="text-xl font-semibold">Sign-in wasn’t completed</h1>
        <p className="text-sm leading-6 text-muted-foreground">
          Your existing guest work is still available. Google sign-in may have
          been cancelled or the request expired.
        </p>
        <div className="flex flex-wrap gap-4 text-sm">
          <a className="text-primary underline" href="/api/auth/google">
            Try Google again
          </a>
          <Link className="underline" href="/dashboard">
            Return to your workspace
          </Link>
          <Link className="underline" href="/login">
            Back to sign-in
          </Link>
        </div>
      </section>
    </main>
  );
}
