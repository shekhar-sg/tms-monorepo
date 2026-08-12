import { LuSendHorizontal, LuSmilePlus } from "react-icons/lu";
import { RiAttachmentLine, RiMoreLine } from "react-icons/ri";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

const TaskComments = () => {
  return (
    <div className={"flex border-border gap-5"}>
      <div className={"flex flex-col flex-1 gap-3 pt-2"}>
        <div>Comments</div>
        <Card className={"rounded-md gap-3"}>
          <CardHeader className={"space-y-2"}>
            <CardTitle className={"text-xs flex gap-2 items-center"}>
              <Avatar size={"sm"}>
                <AvatarImage src={"https://github.com/evilrabbit.png"} />
                <AvatarFallback>ER</AvatarFallback>
              </Avatar>
              User name <span className={"text-muted-foreground"}>3hr ago</span>
            </CardTitle>
            <CardDescription>Hey checkout my comments</CardDescription>
            <CardAction>
              <Button variant={"ghost"}>
                <LuSmilePlus />
              </Button>
              <Button variant={"ghost"}>
                <RiMoreLine />
              </Button>
            </CardAction>
          </CardHeader>
          <CardFooter className={"p-0 rounded-none bg-transparent"}>
            <InputGroup
              className={"w-full h-full px-4 py-1.5 rounded-none border-0"}
            >
              <InputGroupAddon className={"p-0 mr-2"}>
                <Avatar size={"sm"}>
                  <AvatarImage src={"https://github.com/evilrabbit.png"} />
                  <AvatarFallback>ER</AvatarFallback>
                </Avatar>
              </InputGroupAddon>
              <InputGroupInput placeholder={"Leave a reply…"} />
              <InputGroupAddon align={"inline-end"} className={"pr-0 text-primary"}>
                <Button variant={"ghost"}>
                  <RiAttachmentLine />
                </Button>
                <Button variant={"ghost"}>
                  <LuSendHorizontal />
                </Button>
              </InputGroupAddon>
            </InputGroup>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default TaskComments;
