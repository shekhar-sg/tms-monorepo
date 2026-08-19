"use client";

import { type AccentColor, Theme } from "@repo/types";
import { ChevronsUpDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { PiGearBold } from "react-icons/pi";
import PreferenceSelectOption from "@/components/prefferences/preference-select-option";
import {
  ACCENT_COLOR_OPTIONS,
  THEME_OPTIONS,
} from "@/components/prefferences/setting-config";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useCurrentUser } from "@/hooks/auth/use-auth";
import {
  usePreferences,
  useUpdatePreferences,
} from "@/hooks/preferences/use-preferences";

const UserMenu = () => {
  const { data: user } = useCurrentUser();
  const { data: preferences, isLoading: isPreferencesLoading } =
    usePreferences();

  const { mutate: updatePreferences, isPending: isUpdatingPreferences } =
    useUpdatePreferences();

  const handleThemeChange = (theme: Theme) => {
    if (!theme) return;
    updatePreferences({
      theme,
    });
  };

  const handleAccentColorChange = (accentColor: AccentColor) => {
    if (!accentColor) return;
    updatePreferences({
      accentColor,
    });
  };

  const router = useRouter();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size={"lg"}
                className={
                  "data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                }
              >
                <Avatar>
                  <AvatarImage
                    src={"https://github.com/shadcn.png"}
                    alt={user?.name ?? "User"}
                  />

                  <AvatarFallback>
                    {user?.name?.slice(0, 2).toUpperCase() ?? "US"}
                  </AvatarFallback>
                </Avatar>
                <div className={"flex flex-col gap-0.5 leading-none"}>
                  <span className="text-sm font-semibold">
                    {user?.name ?? "User"}
                  </span>
                </div>

                <ChevronsUpDown className={"ml-auto"} />
              </SidebarMenuButton>
            }
          />

          <DropdownMenuContent sideOffset={8}>
            <DropdownMenuGroup>
              <DropdownMenuItem
                className={
                  "h-30 flex flex-col items-center justify-center gap-4"
                }
              >
                <Avatar size={"lg"}>
                  <AvatarImage
                    src={"https://github.com/shadcn.png"}
                    alt={user?.name ?? "User"}
                  />

                  <AvatarFallback>
                    {user?.name?.slice(0, 2).toUpperCase() ?? "US"}
                  </AvatarFallback>
                </Avatar>

                <div className={"flex flex-col items-center"}>
                  <span className={"font-medium"}>{user?.name ?? "User"}</span>
                  <span className={"text-muted-foreground"}>
                    {user?.email ?? ""}
                  </span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <PreferenceSelectOption
                title={"Change Theme"}
                value={preferences?.theme}
                options={THEME_OPTIONS}
                disabled={isPreferencesLoading || isUpdatingPreferences}
                onChange={handleThemeChange}
              />
              <PreferenceSelectOption
                title={"Color Mode"}
                value={preferences?.accentColor}
                options={ACCENT_COLOR_OPTIONS}
                disabled={isPreferencesLoading || isUpdatingPreferences}
                onChange={handleAccentColorChange}
              />
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={()=>router.push("/profile")}>
                <PiGearBold />
                Settings
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

export default UserMenu;
