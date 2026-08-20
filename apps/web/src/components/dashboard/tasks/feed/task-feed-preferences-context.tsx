"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  DEFAULT_TASK_FIELDS,
  getTaskPreferences,
  type TaskView,
  updateTaskPreferences,
} from "@/lib/tasks/task-preferences";

type TaskFeedPreferencesContextValue = {
  view: TaskView;
  visibleFields: string[];
  setView: (view: TaskView) => void;
  setVisibleFields: (fields: string[]) => void;
};

const TaskFeedPreferencesContext =
  createContext<TaskFeedPreferencesContextValue | null>(null);

export function TaskFeedPreferencesProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [view, setView] = useState<TaskView>("board");

  const [visibleFields, setVisibleFields] = useState<string[]>([
    ...DEFAULT_TASK_FIELDS,
  ]);

  useEffect(() => {
    const preferences = getTaskPreferences();
    setView(preferences.view);
    setVisibleFields(preferences.fields);
  }, []);

  const handleViewChange = (view: TaskView) => {
    setView(view);
    updateTaskPreferences({ view });
  };

  const handleFieldsChange = (fields: string[]) => {
    setVisibleFields(fields);
    updateTaskPreferences({ fields });
  };

  return (
    <TaskFeedPreferencesContext.Provider
      value={{
        view,
        visibleFields,
        setView: handleViewChange,
        setVisibleFields: handleFieldsChange,
      }}
    >
      {children}
    </TaskFeedPreferencesContext.Provider>
  );
}

export function useTaskFeedPreferences() {
  const context = useContext(TaskFeedPreferencesContext);

  if (!context) {
    throw new Error(
      "useTaskFeedPreferences must be used within TaskFeedPreferencesProvider"
    );
  }

  return context;
}
