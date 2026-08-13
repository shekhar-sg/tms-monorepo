import type { Request } from "express";
import type { GoogleProfile } from "./google-profile";

export type GoogleAuthRequest = Request & {
  user: GoogleProfile;
};
