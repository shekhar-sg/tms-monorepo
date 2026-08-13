import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../users/users.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  async guestLogin() {
    const user = await this.usersService.createGuest();

    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      isGuest: true,
    });

    return {
      accessToken,
      user,
    };
  }

  async googleLogin(profile: {
    providerAccountId: string;
    email?: string;
    name?: string;
    avatar?: string;
  }) {
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
      user,
    };
  }
}
