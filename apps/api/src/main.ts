import { NestFactory } from "@nestjs/core";
import cookieParser from "cookie-parser";
import type { NextFunction, Request, Response } from "express";
import { AppModule } from "./app.module";
import { HttpExceptionFilter } from "./common/filters/http-exception.filter";
import { PrismaExceptionFilter } from "./common/filters/prisma-exception.filter";
import { ResponseInterceptor } from "./common/interceptors/response.interceptor";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.use((request: Request, response: Response, next: NextFunction) => {
    const origin = request.get("origin");
    if (
      !["GET", "HEAD", "OPTIONS"].includes(request.method) &&
      origin &&
      origin !==
        new URL(process.env.FRONTEND_URL ?? "http://localhost:3000").origin
    ) {
      response.status(403).json({
        success: false,
        error: {
          code: "FORBIDDEN",
          message: "Request origin is not allowed",
          retryable: false,
        },
      });
      return;
    }
    next();
  });
  app.enableCors({
    origin: process.env.FRONTEND_URL ?? "http://localhost:3000",
    credentials: true,
  });

  app.useGlobalFilters(new HttpExceptionFilter(), new PrismaExceptionFilter());

  app.useGlobalInterceptors(new ResponseInterceptor());

  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
