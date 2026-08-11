import { ChevronRight, GalleryVerticalEnd, LayoutDashboard } from "lucide-react"
import Link from "next/link"
import type * as React from "react"
import UserMenuButton from "@/components/dashboard/user-menu-button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const navMain = [
  {
    title: "Workspace",
    items: [
      {
        title: "Tasks",
        url: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        title: "Projects",
        url: "/projects",
        icon: GalleryVerticalEnd,
      },
    ],
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <UserMenuButton />
      </SidebarHeader>
      <SidebarContent>
        {navMain.map((item) => (
          <Collapsible
            key={item.title}
            title={item.title}
            defaultOpen
            className={"group/collapsible"}
          >
            <SidebarGroup>
              <SidebarGroupLabel
                className={
                  "group/label text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }
                render={
                  <CollapsibleTrigger>
                    {item.title}
                    <ChevronRight
                      className={
                        "ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90"
                      }
                    />
                  </CollapsibleTrigger>
                }
              ></SidebarGroupLabel>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {item.items.map((subItem) => {
                      const { title, url, icon: Icon } = subItem
                      return (
                        <SidebarMenuItem key={title}>
                          <SidebarMenuButton
                            isActive={false}
                            render={
                              <Link href={url}>
                                <Icon />
                                {title}
                              </Link>
                            }
                          ></SidebarMenuButton>
                        </SidebarMenuItem>
                      )
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        ))}
      </SidebarContent>
    </Sidebar>
  )
}
