import type { Metadata } from "next";
import "./globals.css";
// import { Analytics } from "@vercel/analytics/next";
import type { ReactNode } from "react";
import { Toaster } from "@/components/ui/toast";
// import { VisitorTracker } from "@/components/visitor-tracker";
import { QueryProvider } from "@/providers/query-provider";
import { ThemeProvider } from "@/providers/theme-provider";

export const metadata: Metadata = {
  title: { default: "Task Manager", template: "%s · Task Manager" },
  description:
    "A focused workspace for projects, tasks, and team collaboration.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" className="font-sans" suppressHydrationWarning>
      <body>
        <QueryProvider>
          <ThemeProvider
            attribute={"class"}
            defaultTheme={"system"}
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </QueryProvider>
        {/*<Analytics />*/}
        {/*<VisitorTracker />*/}
      </body>
    </html>
  );
}
