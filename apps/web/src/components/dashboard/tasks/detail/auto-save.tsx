"use client";

import { useEffect, useRef, useState } from "react";
import {
  type Control,
  type FieldValues,
  useFormState,
  useWatch,
} from "react-hook-form";
import { Button } from "@/components/ui/button";

interface AutoSaveProps<T extends FieldValues, P> {
  control: Control<T>;
  getValues: () => T;
  validate: () => Promise<boolean>;
  enabled?: boolean;
  delay?: number;
  transform: (values: T) => P;
  onSave: (payload: P) => Promise<unknown>;
}

export default function AutoSave<T extends FieldValues, P>({
  control,
  getValues,
  validate,
  enabled = true,
  delay = 700,
  transform,
  onSave,
}: AutoSaveProps<T, P>) {
  const values = useWatch({ control });
  const { isDirty } = useFormState({ control });
  const fingerprint = JSON.stringify(values);
  const [status, setStatus] = useState("saved");
  const [retry, setRetry] = useState(0);
  const latest = useRef({ getValues, validate, transform, onSave });
  latest.current = { getValues, validate, transform, onSave };
  const running = useRef(false);
  const pending = useRef(false);
  const acknowledged = useRef<string | undefined>(undefined);
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (!enabled || !isDirty) return;
    let cancelled = false;
    const timeout = setTimeout(async () => {
      if (running.current) {
        pending.current = true;
        return;
      }
      running.current = true;
      try {
        if (!(await latest.current.validate())) {
          if (mounted.current && !cancelled) setStatus("invalid");
          return;
        }
        if (cancelled) return;
        const payload = latest.current.transform(latest.current.getValues());
        const key = JSON.stringify(payload);
        if (key === acknowledged.current) return;
        if (mounted.current) setStatus("saving");
        await latest.current.onSave(payload);
        acknowledged.current = key;
        if (mounted.current) setStatus("saved");
      } catch {
        if (mounted.current) setStatus("failed");
      } finally {
        running.current = false;
        if (pending.current && mounted.current) {
          pending.current = false;
          setRetry((value) => value + 1);
        }
      }
    }, delay);
    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [fingerprint, enabled, isDirty, delay, retry]);

  return (
    <div
      className="flex items-center gap-2 text-xs text-muted-foreground"
      role="status"
      aria-live="polite"
    >
      <span
        className={
          status === "failed" || status === "invalid" ? "text-destructive" : ""
        }
      >
        {status === "saving"
          ? "Saving changes…"
          : status === "failed"
            ? "Changes not saved"
            : status === "invalid"
              ? "Fix the highlighted fields to save"
              : "All changes saved"}
      </span>
      {status === "failed" && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setRetry((value) => value + 1)}
        >
          Retry save
        </Button>
      )}
    </div>
  );
}
