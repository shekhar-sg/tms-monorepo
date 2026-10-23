"use client";

import {
  CheckCheck,
  FolderKanban,
  Layers3,
  LayoutDashboard,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps } from "react";
import UserMenu from "@/components/preferences/user-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const links = [
  { title: "Overview", url: "/dashboard", icon: LayoutDashboard },
  { title: "Tasks", url: "/dashboard/tasks", icon: CheckCheck },
  { title: "Projects", url: "/dashboard/projects", icon: FolderKanban },
];

export default function AppSidebar(props: ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  return (
    <Sidebar {...props}>
      <SidebarHeader className="border-b px-5 py-5">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 font-semibold tracking-tight"
        >
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Layers3 className="size-5" />
          </span>
          <span>
            Task Manager
            <span className="mt-0.5 block text-xs font-normal text-muted-foreground">
              Personal workspace
            </span>
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            Workspace
          </SidebarGroupLabel>
          <SidebarMenu className="gap-1">
            {links.map(({ title, url, icon: Icon }) => {
              const active =
                url === "/dashboard"
                  ? pathname === url
                  : pathname.startsWith(url);
              return (
                <SidebarMenuItem key={url}>
                  <SidebarMenuButton
                    isActive={active}
                    className="h-10 px-3"
                    render={
                      <Link
                        href={url}
                        aria-current={active ? "page" : undefined}
                      >
                        <Icon />
                        <span>{title}</span>
                      </Link>
                    }
                  />
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t p-3">
        <UserMenu />
      </SidebarFooter>
    </Sidebar>
  );
}
