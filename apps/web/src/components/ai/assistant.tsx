"use client";
import type { AiAnswer, AiProposal } from "@repo/types";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import {
  ArrowUp,
  Check,
  Loader2,
  MessageSquare,
  Plus,
  RotateCcw,
  Square,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { useProjects } from "@/hooks/projects/use-projects";
import { api } from "@/lib/api/client-api";

const AssistantContext = createContext<(() => void) | null>(null);
export function AskAiButton() {
  const open = useContext(AssistantContext);
  return (
    <Button variant="outline" size="sm" onClick={() => open?.()}>
      <MessageSquare className="size-4" />
      Ask AI
    </Button>
  );
}
type Turn = { prompt: string; answer: AiAnswer };
export function AssistantProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [turns, setTurns] = useState<Turn[]>([]);
  const [proposal, setProposal] = useState<AiProposal | null>(null);
  const [key, setKey] = useState("");
  const [busy, setBusy] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [lastPrompt, setLastPrompt] = useState("");
  const [available, setAvailable] = useState<boolean | null>(null);
  const abort = useRef<AbortController | null>(null);
  const path = usePathname();
  const queryClient = useQueryClient();
  const { data: projects } = useProjects();
  useEffect(() => {
    if (open)
      void api
        .get("/auth/providers")
        .then((r) => setAvailable(r.data.data.ai))
        .catch(() => setAvailable(null));
  }, [open]);
  useEffect(() => () => abort.current?.abort(), []);
  const submit = async (text = prompt) => {
    if (!text.trim() || abort.current || saving) return;
    setBusy(true);
    setError("");
    setLastPrompt(text);
    const controller = new AbortController();
    abort.current = controller;
    const projectId = path.match(/\/projects\/([\w-]+)$/)?.[1];
    const taskId = path.match(/\/tasks\/([\w-]+)$/)?.[1];
    try {
      const response = await api.post(
        "/ai/assist",
        {
          prompt: text,
          projectId,
          taskId: taskId === "new" ? undefined : taskId,
          draft: proposal,
          history: turns.slice(-1).flatMap((t) => [
            { role: "user", content: t.prompt.slice(0, 3000) },
            { role: "assistant", content: t.answer.message.slice(0, 3000) },
          ]),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        { signal: controller.signal, timeout: 45000 }
      );
      const answer: AiAnswer = response.data.data;
      setAvailable(true);
      setTurns((old) => [...old.slice(-9), { prompt: text, answer }]);
      setProposal(answer.proposal);
      setKey(crypto.randomUUID());
      setPrompt((current) => (current === text ? "" : current));
    } catch (e) {
      if (!axios.isCancel(e))
        setError(
          axios.isAxiosError(e)
            ? (e.response?.data?.error?.message ??
                "Could not reach the assistant. Try again.")
            : "Could not complete your request."
        );
    } finally {
      setBusy(false);
      abort.current = null;
    }
  };
  const apply = async () => {
    if (!proposal || saving) return;
    setSaving(true);
    setError("");
    try {
      const { data } = await api.post("/ai/apply", { key, proposal });
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["tasks"] }),
        queryClient.invalidateQueries({ queryKey: ["projects"] }),
      ]);
      setProposal(null);
      toast.add({
        title: "Your plan is ready",
        description: `${data.data.taskIds.length} tasks created.`,
        type: "success",
      });
      setTurns((old) => [
        ...old,
        {
          prompt: "Create selected",
          answer: {
            kind: "answer",
            message:
              "Created your selected work. Open the project to continue.",
            proposal: null,
            references: [
              {
                type: "project",
                id: data.data.projectId,
                title:
                  proposal.projectTitle ??
                  projects?.find((p) => p.id === data.data.projectId)?.title ??
                  "Open project",
              },
            ],
          },
        },
      ]);
    } catch (e) {
      setError(
        axios.isAxiosError(e)
          ? (e.response?.data?.error?.message ??
              "Could not save. Retry uses the same request to avoid duplicates.")
          : "Could not save your plan."
      );
    } finally {
      setSaving(false);
    }
  };
  return (
    <AssistantContext.Provider value={() => setOpen(true)}>
      {children}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="w-full! sm:max-w-[480px]! gap-0 p-0">
          <SheetHeader className="border-b px-6 py-5 pr-14">
            <SheetTitle className="flex items-center gap-2">
              <MessageSquare className="size-4" />
              Workspace assistant
            </SheetTitle>
            <SheetDescription>
              Plan work, break down tasks, and find your next step.
            </SheetDescription>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
            {!turns.length && (
              <div className="py-6">
                <p className="font-medium">What would you like to work on?</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Start with a goal. Review and edit any suggested work before
                  creating it.
                </p>
                <div className="mt-5 grid gap-2">
                  {[
                    "Plan a website launch project",
                    "Break this task into practical subtasks",
                    "Help me prioritize the work in this view",
                  ].map((text) => (
                    <button
                      type="button"
                      key={text}
                      className="rounded-lg border p-3 text-left text-sm hover:bg-muted"
                      onClick={() => setPrompt(text)}
                    >
                      {text}
                      <Plus className="float-right size-4 text-muted-foreground" />
                    </button>
                  ))}
                </div>
              </div>
            )}
            {turns.map((turn, index) => (
              <div key={`${index}-${turn.prompt}`} className="space-y-3">
                <p className="ml-8 rounded-lg bg-muted px-4 py-3 text-sm whitespace-pre-wrap">
                  {turn.prompt}
                </p>
                <p className="text-sm leading-6 whitespace-pre-wrap">
                  {turn.answer.message}
                </p>
                {!!turn.answer.references.length && (
                  <div className="flex flex-wrap gap-2">
                    {turn.answer.references.map((r) => (
                      <Link
                        key={r.id}
                        href={`/dashboard/${r.type === "task" ? "tasks" : "projects"}/${r.id}`}
                        className="rounded border px-2 py-1 text-xs hover:bg-muted"
                        onClick={() => setOpen(false)}
                      >
                        {r.title} ↗
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {proposal && (
              <ProposalEditor
                key={key}
                value={proposal}
                onChange={setProposal}
                disabled={saving}
                projects={projects ?? []}
              />
            )}
            {busy && (
              <p
                role="status"
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <Loader2 className="size-4 animate-spin" />
                Working on your request…
              </p>
            )}
            {error && (
              <div
                role="alert"
                className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm"
              >
                {typeof error === "string"
                  ? error
                  : "Please check your request and try again."}
                {!proposal && lastPrompt && (
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={busy}
                    onClick={() => void submit(lastPrompt)}
                  >
                    <RotateCcw />
                    Retry
                  </Button>
                )}
              </div>
            )}
            {available === false && (
              <p className="rounded-lg border p-3 text-xs text-muted-foreground">
                The server reported that AI is not configured. You can retry
                your message after the server configuration is updated.
              </p>
            )}
          </div>
          <div className="border-t p-4 space-y-3">
            {proposal && (
              <div className="flex gap-2">
                <Button
                  className="flex-1"
                  disabled={
                    saving ||
                    busy ||
                    (!proposal.projectId && !proposal.projectTitle?.trim())
                  }
                  onClick={() => void apply()}
                >
                  {saving ? <Loader2 className="animate-spin" /> : <Check />}{" "}
                  {saving ? "Creating…" : "Create selected"}
                </Button>
                <Button
                  variant="outline"
                  disabled={saving}
                  onClick={() => setProposal(null)}
                >
                  Discard
                </Button>
              </div>
            )}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void submit();
              }}
              className="rounded-lg border bg-background p-2 focus-within:ring-2 focus-within:ring-ring/30"
            >
              <Textarea
                aria-label="Ask AI"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (
                    e.key === "Enter" &&
                    !e.shiftKey &&
                    !e.nativeEvent.isComposing
                  ) {
                    e.preventDefault();
                    void submit();
                  }
                }}
                maxLength={3000}
                placeholder={
                  proposal ? "Refine this plan…" : "Describe what you need…"
                }
                className="min-h-20 resize-none border-0 shadow-none focus-visible:ring-0"
              />
              <div className="flex items-center justify-between px-1">
                <span className="text-[11px] text-muted-foreground">
                  Groq · limited free-plan allowance
                </span>
                {busy ? (
                  <Button
                    type="button"
                    size="icon-sm"
                    aria-label="Cancel AI request"
                    variant="outline"
                    onClick={() => abort.current?.abort()}
                  >
                    <Square />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    size="icon-sm"
                    aria-label="Send request"
                    disabled={!prompt.trim() || saving || busy}
                  >
                    <ArrowUp />
                  </Button>
                )}
              </div>
            </form>
          </div>
        </SheetContent>
      </Sheet>
    </AssistantContext.Provider>
  );
}

function ProposalEditor({
  value,
  onChange,
  disabled,
  projects,
}: {
  value: AiProposal;
  onChange: (p: AiProposal) => void;
  disabled: boolean;
  projects: { id: string; title: string }[];
}) {
  const [excluded, setExcluded] = useState<Set<number>>(new Set());
  const [allTasks] = useState(value.tasks);
  const [drafts, setDrafts] = useState(value.tasks);
  const updateTasks = (next: typeof drafts, omitted = excluded) => {
    setDrafts(next);
    onChange({ ...value, tasks: next.filter((_, i) => !omitted.has(i)) });
  };
  return (
    <fieldset
      disabled={disabled}
      className="rounded-lg border bg-card p-4 space-y-4"
    >
      <legend className="px-1 text-xs font-semibold">Review your plan</legend>
      <label className="block space-y-1 text-xs font-medium">
        Destination
        <select
          className="h-9 w-full rounded-md border bg-background px-2 text-sm"
          value={value.projectId ?? "new"}
          onChange={(e) =>
            onChange({
              ...value,
              projectId: e.target.value === "new" ? null : e.target.value,
              projectTitle: e.target.value === "new" ? "New project" : null,
              parentId: null,
            })
          }
        >
          <option value="new">New project</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.title}
            </option>
          ))}
        </select>
      </label>
      {!value.projectId && (
        <Input
          aria-label="Project name"
          maxLength={200}
          value={value.projectTitle ?? ""}
          onChange={(e) => onChange({ ...value, projectTitle: e.target.value })}
        />
      )}
      {value.parentId && (
        <p className="text-xs text-muted-foreground">
          These items will be subtasks of the current task.
        </p>
      )}
      {allTasks.map((_, i) => {
        const item = drafts[i]!;
        return (
          <div key={i} className="space-y-2 border-t pt-3">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                aria-label={`Include task ${i + 1}`}
                checked={!excluded.has(i)}
                onChange={(e) => {
                  const next = new Set(excluded);
                  e.target.checked ? next.delete(i) : next.add(i);
                  setExcluded(next);
                  updateTasks(drafts, next);
                }}
              />
              <Input
                aria-label={`Task ${i + 1} title`}
                maxLength={200}
                value={item.title}
                onChange={(e) =>
                  updateTasks(
                    drafts.map((t, n) =>
                      n === i ? { ...t, title: e.target.value } : t
                    )
                  )
                }
              />
            </div>
            <Textarea
              aria-label={`Task ${i + 1} description`}
              value={item.description ?? ""}
              className="min-h-16 text-xs"
              onChange={(e) =>
                updateTasks(
                  drafts.map((t, n) =>
                    n === i ? { ...t, description: e.target.value || null } : t
                  )
                )
              }
            />
            <div className="flex flex-wrap gap-2">
              <select
                aria-label={`Task ${i + 1} priority`}
                className="rounded border bg-background px-2 py-1 text-xs"
                value={item.priority}
                onChange={(e) =>
                  updateTasks(
                    drafts.map((t, n) =>
                      n === i
                        ? {
                            ...t,
                            priority: e.target.value as typeof item.priority,
                          }
                        : t
                    )
                  )
                }
              >
                {["NONE", "LOW", "MEDIUM", "HIGH", "URGENT"].map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
              <select
                aria-label={`Task ${i + 1} status`}
                className="rounded border bg-background px-2 py-1 text-xs"
                value={item.status}
                onChange={(e) =>
                  updateTasks(
                    drafts.map((t, n) =>
                      n === i
                        ? { ...t, status: e.target.value as typeof item.status }
                        : t
                    )
                  )
                }
              >
                {["BACKLOG", "TODO", "IN_PROGRESS", "REVIEW", "DONE"].map(
                  (p) => (
                    <option key={p}>{p}</option>
                  )
                )}
              </select>
              <input
                aria-label={`Task ${i + 1} due date`}
                type="date"
                className="rounded border bg-background px-2 py-1 text-xs"
                value={item.endDate?.slice(0, 10) ?? ""}
                onChange={(e) =>
                  updateTasks(
                    drafts.map((t, n) =>
                      n === i
                        ? {
                            ...t,
                            endDate: e.target.value
                              ? new Date(
                                  `${e.target.value}T12:00:00`
                                ).toISOString()
                              : null,
                          }
                        : t
                    )
                  )
                }
              />
            </div>
            {item.subtasks.map((subtask, n) => (
              <div key={n} className="ml-5 flex items-center gap-1">
                <span className="text-muted-foreground">↳</span>
                <Input
                  aria-label={`Subtask ${n + 1} title`}
                  value={subtask.title}
                  onChange={(e) =>
                    updateTasks(
                      drafts.map((t, ti) =>
                        ti === i
                          ? {
                              ...t,
                              subtasks: t.subtasks.map((s, si) =>
                                si === n ? { ...s, title: e.target.value } : s
                              ),
                            }
                          : t
                      )
                    )
                  }
                />
                <Button
                  variant="ghost"
                  size="sm"
                  aria-label={`Remove subtask ${n + 1}`}
                  onClick={() =>
                    updateTasks(
                      drafts.map((t, ti) =>
                        ti === i
                          ? {
                              ...t,
                              subtasks: t.subtasks.filter((_, si) => si !== n),
                            }
                          : t
                      )
                    )
                  }
                >
                  ×
                </Button>
              </div>
            ))}
          </div>
        );
      })}
      <p className="text-xs text-muted-foreground">
        {value.tasks.length} tasks selected. Nothing is saved until you create.
      </p>
    </fieldset>
  );
}
