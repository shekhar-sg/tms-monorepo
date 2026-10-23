import type { Response } from "express";
import { AuthController } from "./auth.controller";
import type { AuthService } from "./auth.service";

describe("Session cookies", () => {
  const guestLogin = jest
    .fn()
    .mockResolvedValue({ accessToken: "token", user: { id: "guest" } });
  const controller = new AuthController({
    guestLogin,
  } as unknown as AuthService);
  const cookie = jest.fn();
  const clearCookie = jest.fn();
  const response = { cookie, clearCookie } as unknown as Response;
  it("sets a same-site guest cookie usable over local HTTP", async () => {
    await controller.guestLogin(response);
    expect(cookie).toHaveBeenCalledWith(
      "accessToken",
      "token",
      expect.objectContaining({
        httpOnly: true,
        sameSite: "lax",
        secure: false,
      })
    );
  });
  it("clears the HttpOnly cookie when a session expires", () => {
    controller.logout(response);
    expect(clearCookie).toHaveBeenCalledWith(
      "accessToken",
      expect.objectContaining({ path: "/", httpOnly: true, sameSite: "lax" })
    );
  });
});
