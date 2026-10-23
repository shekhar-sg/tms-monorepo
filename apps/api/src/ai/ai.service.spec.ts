import {
  BadGatewayException,
  HttpException,
  ServiceUnavailableException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { PrismaService } from "../prisma/prisma.service";
import { AiService } from "./ai.service";

const mockCompletion = jest.fn();
jest.mock("groq-sdk", () => {
  class APIError extends Error {
    status = 429;
  }
  return {
    __esModule: true,
    default: Object.assign(
      jest.fn(() => ({ chat: { completions: { create: mockCompletion } } })),
      { APIError }
    ),
  };
});
describe("Groq free-plan assistant", () => {
  const tx = {
    $executeRaw: jest.fn(),
    aiQuota: { deleteMany: jest.fn(), upsert: jest.fn() },
  };
  const prisma = {
    project: { findMany: jest.fn() },
    task: { findMany: jest.fn() },
    $transaction: jest.fn((fn) => fn(tx)),
  };
  const config = new ConfigService({
    GROQ_API_KEY: "test-key",
    JWT_SECRET: "test-secret",
  });
  const service = new AiService(prisma as unknown as PrismaService, config);
  beforeEach(() => {
    jest.clearAllMocks();
    tx.aiQuota.upsert.mockResolvedValue({ count: 1 });
    prisma.project.findMany.mockResolvedValue([]);
    prisma.task.findMany.mockResolvedValue([]);
  });
  const input = {
    prompt: "Help prioritize",
    history: [],
    timeZone: "Asia/Kolkata",
  };
  const user = { userId: "user", isGuest: true };
  it("does not call Groq when the key is missing", async () => {
    await expect(
      new AiService(
        prisma as unknown as PrismaService,
        new ConfigService()
      ).assist(input, user, "127.0.0.1")
    ).rejects.toBeInstanceOf(ServiceUnavailableException);
    expect(mockCompletion).not.toHaveBeenCalled();
  });
  it("uses the small default model with strict schema, no streaming, and bounded output", async () => {
    mockCompletion.mockResolvedValue({
      choices: [
        {
          finish_reason: "stop",
          message: {
            content: JSON.stringify({
              kind: "answer",
              message: "Here is a plan.",
              proposal: null,
              references: [],
            }),
          },
        },
      ],
    });
    const answer = await service.assist(input, user, "127.0.0.1");
    expect(answer.kind).toBe("answer");
    expect(mockCompletion).toHaveBeenCalledWith(
      expect.objectContaining({
        model: "openai/gpt-oss-20b",
        max_completion_tokens: 1800,
        response_format: expect.objectContaining({ type: "json_schema" }),
      })
    );
  });
  it("rejects truncated or invalid model output without creating work", async () => {
    mockCompletion.mockResolvedValue({
      choices: [{ finish_reason: "length", message: { content: "{}" } }],
    });
    await expect(
      service.assist(input, user, "127.0.0.1")
    ).rejects.toBeInstanceOf(BadGatewayException);
  });
  it("rejects exhausted quotas before contacting Groq", async () => {
    tx.aiQuota.upsert.mockResolvedValue({ count: 999 });
    await expect(
      service.assist(input, user, "127.0.0.1")
    ).rejects.toBeInstanceOf(HttpException);
    expect(mockCompletion).not.toHaveBeenCalled();
  });
});
