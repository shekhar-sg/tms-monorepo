import { Injectable } from "@nestjs/common";
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
}
