import type { AuthUser } from "@repo/types";

declare global {
  namespace Express {
    interface User extends AuthUser {}
  }
}