"use client";

import { useState } from "react";

import { LuSendHorizontal } from "react-icons/lu";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
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
import { QueryState } from "@/components/ui/query-state";

import {
  useCreateTaskComment,
  useTaskComments,
} from "@/hooks/comments/use-comments";

interface TaskCommentsProps {
  taskId: string;
}

const TaskComments = ({ taskId }: TaskCommentsProps) => {
  const {
    data: comments = [],
    isPending: loading,
    error,
    refetch,
  } = useTaskComments(taskId);

  const { mutate: createComment, isPending } = useCreateTaskComment();

  const [content, setContent] = useState("");

  const [replyContent, setReplyContent] = useState<Record<string, string>>({});

  const topLevelComments = comments.filter(
    (comment) => comment.parentId === null
  );

  const getReplies = (commentId: string) =>
    comments.filter((comment) => comment.parentId === commentId);

  const handleCreateComment = () => {
    const trimmedContent = content.trim();

    if (!trimmedContent || isPending) {
      return;
    }

    createComment(
      {
        taskId,

        data: {
          content: trimmedContent,

          parentId: null,
        },
      },

      {
        onSuccess: () => {
          setContent("");
        },
      }
    );
  };

  const handleCreateReply = (commentId: string) => {
    const trimmedContent = (replyContent[commentId] ?? "").trim();

    if (!trimmedContent || isPending) {
      return;
    }

    createComment(
      {
        taskId,

        data: {
          content: trimmedContent,

          parentId: commentId,
        },
      },

      {
        onSuccess: () => {
          setReplyContent((prev) => {
            const next = { ...prev };

            delete next[commentId];

            return next;
          });
        },
      }
    );
  };

  return (
    <div className={"flex border-border gap-5"}>
      <div className={"flex flex-col flex-1 gap-5 pt-2"}>
        <h2 className="text-sm font-semibold">Comments</h2>

        {loading && <QueryState loading title="Loading comments…" />}

        {error && (
          <QueryState
            error
            title="Comments unavailable"
            onRetry={() => void refetch()}
          />
        )}

        {!loading && !error && comments.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Start the conversation. Add the first comment below.
          </p>
        )}

        {topLevelComments.map((comment) => {
          const replies = getReplies(comment.id);

          return (
            <Card key={comment.id} className={"rounded-md gap-3"}>
              <CardHeader className={"space-y-2"}>
                <CardTitle className={"text-xs flex gap-2 items-center"}>
                  <Avatar size={"sm"}>
                    <AvatarImage src={comment.author.avatar ?? undefined} />

                    <AvatarFallback>
                      {comment.author.name?.charAt(0).toUpperCase() ?? "U"}
                    </AvatarFallback>
                  </Avatar>

                  {comment.author.name ?? "User"}

                  <span className={"text-muted-foreground"}>
                    {new Date(comment.createdAt).toLocaleString()}
                  </span>
                </CardTitle>

                <CardDescription>{comment.content}</CardDescription>
              </CardHeader>

              {replies.map((reply) => (
                <div key={reply.id} className={"ml-6 border-l pl-4"}>
                  <div className={"flex gap-2 items-start"}>
                    <Avatar size={"sm"}>
                      <AvatarImage src={reply.author.avatar ?? undefined} />

                      <AvatarFallback>
                        {reply.author.name?.charAt(0).toUpperCase() ?? "U"}
                      </AvatarFallback>
                    </Avatar>

                    <div>
                      <div className={"text-xs font-medium"}>
                        {reply.author.name ?? "User"}
                      </div>

                      <div className={"text-sm text-muted-foreground"}>
                        {reply.content}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <CardFooter className={"p-0 rounded-none bg-transparent"}>
                <InputGroup
                  className={"w-full h-full px-4 py-1.5 rounded-none border-0"}
                >
                  <InputGroupAddon className={"p-0 mr-2"}>
                    <Avatar size={"sm"}>
                      <AvatarFallback>{"U"}</AvatarFallback>
                    </Avatar>
                  </InputGroupAddon>

                  <InputGroupInput
                    value={replyContent[comment.id] ?? ""}
                    onChange={(event) => {
                      setReplyContent((prev) => ({
                        ...prev,

                        [comment.id]: event.target.value,
                      }));
                    }}
                    aria-label="Reply"
                    placeholder={"Leave a reply…"}
                    onKeyDown={(event) => {
                      if (
                        event.key === "Enter" &&
                        !event.nativeEvent.isComposing
                      ) {
                        event.preventDefault();

                        handleCreateReply(comment.id);
                      }
                    }}
                  />

                  <InputGroupAddon
                    align={"inline-end"}
                    className={"pr-0 text-primary"}
                  >
                    <Button
                      type={"button"}
                      variant={"ghost"}
                      aria-label="Send reply"
                      disabled={
                        isPending || !(replyContent[comment.id] ?? "").trim()
                      }
                      onClick={() => {
                        handleCreateReply(comment.id);
                      }}
                    >
                      <LuSendHorizontal />
                    </Button>
                  </InputGroupAddon>
                </InputGroup>
              </CardFooter>
            </Card>
          );
        })}

        <Card className={"rounded-md gap-3 p-0"}>
          <CardContent className={"p-0"}>
            <InputGroup
              className={"w-full h-full px-4 py-1.5 rounded-none border-0"}
            >
              <InputGroupAddon className={"p-0 mr-2"}>
                <Avatar size={"sm"}>
                  <AvatarFallback>{"U"}</AvatarFallback>
                </Avatar>
              </InputGroupAddon>

              <InputGroupInput
                value={content}
                onChange={(event) => {
                  setContent(event.target.value);
                }}
                aria-label="Comment"
                placeholder={"Leave a comment…"}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.nativeEvent.isComposing) {
                    event.preventDefault();

                    handleCreateComment();
                  }
                }}
              />

              <InputGroupAddon
                align={"inline-end"}
                className={"pr-0 text-primary"}
              >
                <Button
                  type={"button"}
                  variant={"ghost"}
                  aria-label="Send comment"
                  disabled={isPending || !content.trim()}
                  onClick={handleCreateComment}
                >
                  <LuSendHorizontal />
                </Button>
              </InputGroupAddon>
            </InputGroup>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TaskComments;
