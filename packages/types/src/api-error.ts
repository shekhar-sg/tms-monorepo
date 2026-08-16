export const apiErrorCodes = [
  "VALIDATION_ERROR",
  "UNAUTHORIZED",
  "FORBIDDEN",
  "NOT_FOUND",
  "CONFLICT",
  "DATABASE_UNAVAILABLE",
  "INTERNAL_ERROR",
] as const;

export type ApiErrorCode = (typeof apiErrorCodes)[number];

export interface ApiErrorDetails {
  code: ApiErrorCode;
  message: string;
  retryable: boolean;
  errors?: Record<string, string[]>;
}
