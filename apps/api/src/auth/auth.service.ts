import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import type { AuthResponse } from "@repo/types";

import { UsersService } from "../users/users.service";
import { GoogleProfile } from "./types/google-profile";

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

  async guestLogin(): Promise<AuthResult> {
    const user = await this.usersService.createGuest();

    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      isGuest: true,
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

  async googleLogin(profile: GoogleProfile): Promise<AuthResult> {
    if (!profile.email) {
      throw new UnauthorizedException("Google account has no email");
    }

    const user = await this.usersService.findOrCreateGoogleUser({
      providerAccountId: profile.providerAccountId,
      email: profile.email,
      name: profile.name,
      avatar: profile.avatar,
    });

    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      isGuest: false,
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
