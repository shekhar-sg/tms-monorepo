import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findOrCreateGoogleUser(data: {
    providerAccountId: string;
    email: string;
    name?: string;
    avatar?: string;
  }) {
    const existingAccount = await this.prisma.account.findUnique({
      where: {
        provider_providerAccountId: {
          provider: "GOOGLE",
          providerAccountId: data.providerAccountId,
        },
      },
      include: {
        user: true,
      },
    });

    if (existingAccount) {
      return existingAccount.user;
    }

    const existingUser = await this.findByEmail(data.email);

    if (existingUser) {
      return this.prisma.user.update({
        where: { id: existingUser.id },
        data: {
          name: data.name ?? existingUser.name,
          avatar: data.avatar ?? existingUser.avatar,
          accounts: {
            create: {
              provider: "GOOGLE",
              providerAccountId: data.providerAccountId,
            },
          },
        },
      });
    }

    return this.prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        avatar: data.avatar,
        accounts: {
          create: {
            provider: "GOOGLE",
            providerAccountId: data.providerAccountId,
          },
        },
      },
    });
  }

  async createGuest() {
    return this.prisma.user.create({
      data: {
        name: "Guest",
        isGuest: true,
      },
    });
  }
}
