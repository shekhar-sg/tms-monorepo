import type { ReactNode } from "react"
import { AppSidebar } from "@/components/dashboard/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  return (
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
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className={"hidden md:block"}>
                <BreadcrumbLink href="#">Build Your Application</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className={"hidden md:block"} />
              <BreadcrumbItem>
                <BreadcrumbPage>Data Fetching</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className={"flex flex-1 flex-col gap-4 p-4"}>
          {Array.from({ length: 24 }).map((_, index) => (
            <div
              key={index}
              className={"aspect-video h-12 w-full rounded-lg bg-muted/50"}
            />
          ))}
          <main>{children}</main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default DashboardLayout
