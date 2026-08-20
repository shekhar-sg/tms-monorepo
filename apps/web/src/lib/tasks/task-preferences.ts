export type TaskView = "board" | "list";

export const DEFAULT_TASK_VIEW: TaskView = "board";

export const DEFAULT_TASK_FIELDS = [
  "priority",
  "members",
  "dueDate",
  "actions",
] as const;

const STORAGE_KEY = "task-view-preferences";

export type TaskPreferences = {
  view: TaskView;
  fields: string[];
};

export function getTaskPreferences(): TaskPreferences {
  if (typeof window === "undefined") {
    return {
      view: DEFAULT_TASK_VIEW,
      fields: [...DEFAULT_TASK_FIELDS],
    };
  }

  const stored = localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    return {
      view: DEFAULT_TASK_VIEW,
      fields: [...DEFAULT_TASK_FIELDS],
    };
  }

  try {
    const preferences = JSON.parse(stored);

    return {
      view:
        preferences.view === "list" || preferences.view === "board"
          ? preferences.view
          : DEFAULT_TASK_VIEW,

      fields: Array.isArray(preferences.fields)
        ? preferences.fields
        : [...DEFAULT_TASK_FIELDS],
    };
  } catch {
    return {
      view: DEFAULT_TASK_VIEW,
      fields: [...DEFAULT_TASK_FIELDS],
    };
  }
}

export function saveTaskPreferences(preferences: TaskPreferences) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
}

export const updateTaskPreferences = (
    updates: Partial<TaskPreferences>,
) => {
  const preferences = getTaskPreferences();

  saveTaskPreferences({
    ...preferences,
    ...updates,
  });
};