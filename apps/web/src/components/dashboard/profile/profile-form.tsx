"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { type UpdateUserInput, type User, updateUserSchema } from "@repo/types";
import { useForm } from "react-hook-form";
import { LuPen } from "react-icons/lu";
import AutoSave from "@/components/dashboard/tasks/detail/auto-save";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import { Separator } from "@/components/ui/separator";
import { useLeaveWorkspace, useUpdateUser } from "@/hooks/users/use-users";
import { cn } from "@/lib/utils";

type ProfileFormProps = {
  user: User;
};

const ProfileForm = ({ user }: ProfileFormProps) => {
  const defaultValues: UpdateUserInput = {
    name: user.name ?? "",
    username: user.username ?? "",
    title: user.title ?? "",
    email: user.email ?? "",
    avatar: user.avatar ?? "",
  };

  const {
    register,
    control,
    reset,
    getValues,
    formState: { errors },
  } = useForm<UpdateUserInput>({
    defaultValues,
    resolver: zodResolver(updateUserSchema),
    mode: "onChange",
  });

  const { mutateAsync: updateUser } = useUpdateUser();

  const handleSave = async (data: UpdateUserInput) => {
    const payload = user.isGuest
      ? (() => {
          const { email, ...profileData } = data;
          return profileData;
        })()
      : data;

    if (Object.keys(payload).length === 0) {
      return;
    }

    const updatedUser = await updateUser(payload);

    reset({
      name: updatedUser.name ?? "",
      username: updatedUser.username ?? "",
      title: updatedUser.title ?? "",
      email: updatedUser.email ?? "",
      avatar: updatedUser.avatar ?? "",
    });
  };

  const { mutateAsync: leaveWorkspace, isPending: isLeaving } =
    useLeaveWorkspace();

  return (
    <div
      className={
        "flex min-h-[calc(100svh-300px)] flex-col items-center justify-center gap-12 p-10 max-sm:gap-8 max-sm:p-4"
      }
    >
      <div className={"flex w-full max-w-160 flex-col gap-8"}>
        <h1 className={"ml-4 text-2xl font-medium"}>Profile</h1>

        <Card className={"rounded-md"}>
          <CardHeader className={"flex items-center justify-between"}>
            <CardTitle>Profile picture</CardTitle>

            <Avatar size={"lg"}>
              <AvatarImage src={user.avatar ?? undefined} />
              <AvatarFallback>
                {user.name?.slice(0, 2).toUpperCase() ?? "ME"}
              </AvatarFallback>
            </Avatar>
          </CardHeader>

          <Separator />

          <CardContent className={"space-y-6"}>
            <Item className={"p-0"}>
              <ItemContent>
                <ItemTitle>Email</ItemTitle>
              </ItemContent>

              <ItemActions>
                <Field data-invalid={!!errors.email}>
                  <InputGroup
                    className={cn("border-none", {
                      "cursor-not-allowed": user.isGuest,
                    })}
                  >
                    <InputGroupInput
                      disabled={user.isGuest}
                      {...register("email")}
                      readOnly={user.isGuest}
                      aria-invalid={!!errors.email}
                      className={"w-fit underline"}
                      placeholder={user.email ?? "guest can't update email"}
                    />

                    <InputGroupAddon align={"inline-end"}>
                      <Button
                        type={"button"}
                        variant={"ghost"}
                        size={"icon"}
                        className={"rounded-full"}
                        disabled={user.isGuest}
                      >
                        <LuPen />
                      </Button>
                    </InputGroupAddon>
                  </InputGroup>

                  <FieldError errors={[errors.email]} />
                </Field>
              </ItemActions>
            </Item>

            <Separator />

            <Item className={"items-center gap-1 p-0"}>
              <ItemContent>
                <ItemTitle>Full name</ItemTitle>
              </ItemContent>

              <ItemActions>
                <Field data-invalid={!!errors.name}>
                  <Input
                    {...register("name")}
                    placeholder={"Full name"}
                    aria-invalid={!!errors.name}
                    className={"border-none bg-secondary focus-visible:ring-0"}
                  />

                  <FieldError errors={[errors.name]} />
                </Field>
              </ItemActions>
            </Item>

            <Separator />

            <Item className={"items-center gap-1 p-0"}>
              <ItemContent>
                <ItemTitle>Title</ItemTitle>
                <ItemDescription>Your job title or role</ItemDescription>
              </ItemContent>

              <ItemActions>
                <Field data-invalid={!!errors.title}>
                  <Input
                    {...register("title")}
                    placeholder={"Title"}
                    aria-invalid={!!errors.title}
                    className={"border-none bg-secondary focus-visible:ring-0"}
                  />

                  <FieldError errors={[errors.title]} />
                </Field>
              </ItemActions>
            </Item>

            <Separator />

            <Item className={"items-center gap-1 p-0"}>
              <ItemContent>
                <ItemTitle>Username</ItemTitle>
                <ItemDescription>
                  One word, like a nickname or first name
                </ItemDescription>
              </ItemContent>

              <ItemActions>
                <Field data-invalid={!!errors.username}>
                  <Input
                    {...register("username")}
                    placeholder={"Username"}
                    aria-invalid={!!errors.username}
                    className={"border-none bg-secondary focus-visible:ring-0"}
                  />

                  <FieldError errors={[errors.username]} />
                </Field>
              </ItemActions>
            </Item>
          </CardContent>
        </Card>

        <div className={"w-full space-y-6"}>
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
                  <AlertDialog>
                    <AlertDialogTrigger
                      render={
                        <Button
                          className={"capitalize"}
                          variant={"destructive"}
                          size={"lg"}
                        />
                      }
                    >
                      Leave workspace
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Leave workspace?</AlertDialogTitle>

                        <AlertDialogDescription>
                          You will lose access to this workspace and its
                          projects and tasks. This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>

                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>

                        <AlertDialogAction
                          disabled={isLeaving}
                          onClick={async () => {
                            await leaveWorkspace();
                          }}
                        >
                          {isLeaving ? "Leaving..." : "Leave workspace"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </ItemActions>
              </Item>
            </CardContent>
          </Card>
        </div>
      </div>

      <AutoSave
        getValues={getValues}
        control={control}
        transform={(values) => values}
        onSave={handleSave}
      />
    </div>
  );
};

export default ProfileForm;
