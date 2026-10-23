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
            <SidebarInset
              className={"flex min-w-0 flex-col h-svh overflow-hidden"}
            >
              <header
                className={
                  "relative z-30 flex h-14 shrink-0 items-center gap-2 border-b bg-card/95 px-4 backdrop-blur-sm sm:px-6"
                }
              >
                <SidebarTrigger className={"-ml-1"} />
                <Separator
                  orientation="vertical"
                  className={"mr-2 h-4 self-center!"}
                />
                <DashboardBreadcrumb />
              </header>
              <div className="min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-hidden">
                {children}
              </div>
            </SidebarInset>
          </SidebarProvider>
        </BreadcrumbProvider>
      </NavigationTransitionProvider>
    </PreferencesProvider>
  );
};

export default DashboardLayout;
