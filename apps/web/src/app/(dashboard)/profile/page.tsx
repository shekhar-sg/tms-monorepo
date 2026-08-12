import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Item,
  ItemDescription,
  ItemContent,
  ItemTitle,
  ItemActions,
} from "@/components/ui/item";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { LuPen } from "react-icons/lu";
import { Button } from "@/components/ui/button";

const ProfilePage = () => {
  return (
    <div
      className={
        "flex flex-col gap-12 max-sm:gap-8 min-h-[calc(100svh-300px)] items-center justify-center p-10"
      }
    >
      <div
        className={
          "flex w-full max-w-160 flex-col justify-center gap-8 max-sm:gap-2"
        }
      >
        <h1 className={"text-2xl font-medium ml-4"}>Profile</h1>
        <Card className={"rounded-md"}>
          <CardHeader className={"flex justify-between items-center"}>
            <CardTitle>Profile picture</CardTitle>
            <Avatar size={"lg"}>
              <AvatarImage src={"https://github.com/shadcn.png"} />
              <AvatarFallback>ME</AvatarFallback>
            </Avatar>
          </CardHeader>
          <Separator />
          <CardContent className={"space-y-8 max-sm:space-y-2"}>
            <Item className={"px-0"}>
              <ItemContent>
                <ItemTitle>Email</ItemTitle>
              </ItemContent>
              <ItemActions>
                <InputGroup className={"border-none"}>
                  <InputGroupAddon align={"inline-end"}>
                    <Button
                      variant={"secondary"}
                      size={"icon"}
                      className={"rounded-full"}
                    >
                      <LuPen />
                    </Button>
                  </InputGroupAddon>
                  <InputGroupInput
                    value={"dexter@gmail.com"}
                    className={"w-fit"}
                  />
                </InputGroup>
              </ItemActions>
              <Separator />
            </Item>
            <Item className={"p-0 gap-1"}>
              <ItemContent>
                <ItemTitle>Full name</ItemTitle>
              </ItemContent>
              <ItemActions>
                <Input
                  placeholder={"Full name"}
                  className={"focus-visible:ring-0 bg-secondary border-none"}
                />
              </ItemActions>
              <Separator />
            </Item>
            <Item className={"p-0 gap-1 items-end"}>
              <ItemContent>
                <ItemTitle>Title</ItemTitle>
                <ItemDescription>Your job title or role</ItemDescription>
              </ItemContent>
              <ItemActions>
                <Input
                  placeholder={"Title"}
                  className={"focus-visible:ring-0 bg-secondary border-none"}
                />
              </ItemActions>
              <Separator />
            </Item>
            <Item className={"p-0 gap-1 items-end"}>
              <ItemContent>
                <ItemTitle>Username</ItemTitle>
                <ItemDescription>
                  One word, like a nickname or first name
                </ItemDescription>
              </ItemContent>
              <ItemActions>
                <Input
                  placeholder={"Username"}
                  className={"focus-visible:ring-0 bg-secondary border-none"}
                />
              </ItemActions>
            </Item>
          </CardContent>
          <CardFooter>
            <Button className={"ml-auto"} size={"lg"}>
              Save
            </Button>
          </CardFooter>
        </Card>
        <div className={"w-full space-y-6 max-sm:space-y-2"}>
          <h2 className={"ml-4"}>Workspace access</h2>
          <Card className={"rounded-md"}>
            <CardContent>
              <Item className={"p-0"}>
                <ItemContent>
                  <ItemDescription className={"text-xs"}>
                    Remove yourself from the workspace
                  </ItemDescription>
                </ItemContent>
                <ItemActions>
                  <Button
                    className={"capitalize"}
                    variant={"destructive"}
                    size={"lg"}
                  >
                    leave workspace
                  </Button>
                </ItemActions>
              </Item>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
