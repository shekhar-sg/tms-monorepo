import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { RiMoreLine } from "react-icons/ri";
import { Badge } from "@/components/ui/badge";
import { LuCalendar, LuTag } from "react-icons/lu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const KanbanCard = () => {
  return (
    <Card data-size={"xs"} className={"min-w-68.25 rounded-md"} size={"sm"}>
      <CardHeader className={"flex justify-between items-center"}>
        <CardTitle className={"text-sm"}>Write Api Documentation</CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant={"ghost"} size={"icon-sm"}>
                <RiMoreLine />
              </Button>
            }
          />
        </DropdownMenu>
      </CardHeader>
      <CardContent className={"space-y-3"}>
        <div className={"flex justify-between items-center"}>
          <Badge variant={"ghost"} className={"h-fit p-0"}>
            <Avatar size={"sm"}>
              <AvatarImage />
              <AvatarFallback>OM</AvatarFallback>
            </Avatar>
            &nbsp;Admin
          </Badge>
          <Badge variant={"destructive"} className={"p-2"}>
            <LuCalendar />
            44 Jul
          </Badge>
        </div>
        <div className={"space-x-1.5"}>
          <Badge variant={"secondary"}>
            <LuTag /> Deployment
          </Badge>
          <Badge variant={"secondary"}>
            <LuTag /> Deployment
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default KanbanCard;
