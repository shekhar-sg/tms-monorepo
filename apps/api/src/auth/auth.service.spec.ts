import { JwtService } from "@nestjs/jwt";
import { Test, TestingModule } from "@nestjs/testing";
import { UsersService } from "../users/users.service";
import { AuthService } from "./auth.service";

describe("AuthService", () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: {} },
        { provide: JwtService, useValue: {} },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
  it("does not exchange an old guest token for an upgraded Google session", async () => {
    const now = new Date();
    const guest = {
      id: "new-guest",
      isGuest: true,
      createdAt: now,
      updatedAt: now,
    };
    const createGuest = jest.fn().mockResolvedValue(guest);
    const users = {
      findById: jest.fn().mockResolvedValue({ id: "upgraded", isGuest: false }),
      createGuest,
    };
    const signAsync = jest.fn().mockResolvedValue("new-token");
    const jwt = {
      verifyAsync: jest
        .fn()
        .mockResolvedValue({ sub: "upgraded", isGuest: true }),
      signAsync,
    };
    const auth = new AuthService(
      users as unknown as UsersService,
      jwt as unknown as JwtService
    );
    const result = await auth.guestLogin("old-token");
    expect(createGuest).toHaveBeenCalled();
    expect(result.user.id).toBe("new-guest");
    expect(signAsync).toHaveBeenCalledWith({ sub: "new-guest", isGuest: true });
  });
});
