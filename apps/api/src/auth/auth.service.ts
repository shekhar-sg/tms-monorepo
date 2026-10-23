import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import type { AuthResponse } from "@repo/types";

import { UsersService } from "../users/users.service";

type AuthResult = {
  accessToken: string;
  user: AuthResponse["user"];
};

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  async guestLogin(token?: string): Promise<AuthResult> {
    let current: Awaited<ReturnType<UsersService["findById"]>> = null;
    if (token) {
      try {
        const payload = await this.jwtService.verifyAsync<{
          sub: string;
          isGuest: boolean;
        }>(token);
        const candidate = await this.usersService.findById(payload.sub);
        current = candidate?.isGuest === payload.isGuest ? candidate : null;
      } catch {
        /* Expired guests start a new session. */
      }
    }
    const user =
      current && !current.disabledAt
        ? current
        : await this.usersService.createGuest();

    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      isGuest: user.isGuest,
    });

    return {
      accessToken,
      user: {
        ...user,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      },
    };
  }
}
