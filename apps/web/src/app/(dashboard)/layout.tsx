import type { ReactNode } from "react";
import AppSidebar from "@/components/dashboard/app-sidebar";
import DashboardBreadcrumb from "@/components/dashboard/dashboard-breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { BreadcrumbProvider } from "@/providers/breadcrumb-context";
import { NavigationTransitionProvider } from "@/providers/navigation-transition-context";
import PreferencesProvider from "@/providers/preferences-provider";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <PreferencesProvider>
      <NavigationTransitionProvider>
        <BreadcrumbProvider>
          <SidebarProvider className={"min-h-screen"}>
            <AppSidebar />
            <SidebarInset className={"flex flex-col h-screen overflow-scroll"}>
              <header
                className={
                  "sticky top-0 flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4"
                }
              >
                <SidebarTrigger className={"-ml-1"} />
                <Separator
                  orientation="vertical"
                  className={"mr-2 h-4 self-center!"}
                />
                <DashboardBreadcrumb />
              </header>
              <main>{children}</main>
            </SidebarInset>
          </SidebarProvider>
        </BreadcrumbProvider>
      </NavigationTransitionProvider>
    </PreferencesProvider>
  );
};

export default DashboardLayout;
