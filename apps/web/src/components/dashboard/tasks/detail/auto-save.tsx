"use client";

import { useEffect } from "react";
import {
  type Control,
  type FieldValues,
  useFormState,
  useWatch,
} from "react-hook-form";

interface AutoSaveProps<TFormValues extends FieldValues, TPayload> {
  control: Control<TFormValues>;
  getValues: () => TFormValues;
  enabled?: boolean;
  delay?: number;
  transform: (values: TFormValues) => TPayload;
  onSave: (payload: TPayload) => void;
}

const AutoSave = <TFormValues extends Record<string, unknown>, TPayload>({
  control,
  getValues,
  enabled = true,
  delay = 700,
  transform,
  onSave,
}: AutoSaveProps<TFormValues, TPayload>) => {
  useWatch<TFormValues>({
    control,
  });

  const { isDirty } = useFormState({
    control,
  });

  useEffect(() => {
    if (!enabled || !isDirty) {
      return;
    }

    const timeout = setTimeout(() => {
      const payload = transform(getValues());
      onSave(payload);
    }, delay);

    return () => {
      clearTimeout(timeout);
    };
  }, [enabled, isDirty, delay, transform, onSave, getValues]);

  return null;
};

export default AutoSave;
