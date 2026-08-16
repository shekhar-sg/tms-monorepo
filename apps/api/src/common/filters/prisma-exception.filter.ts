import {
  ArgumentsHost,
  Catch,
  ConflictException,
  type ExceptionFilter,
  NotFoundException,
  ServiceUnavailableException,
} from "@nestjs/common";
import { Prisma } from "../../../generated/prisma/client";

@Catch(
  Prisma.PrismaClientKnownRequestError,
  Prisma.PrismaClientInitializationError
)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(
    exception:
      | Prisma.PrismaClientKnownRequestError
      | Prisma.PrismaClientInitializationError,
    _host: ArgumentsHost
  ) {
    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      switch (exception.code) {
        case "P2002":
          throw new ConflictException({
            code: "CONFLICT",
            message: "A resource with the same value already exists",
            retryable: false,
          });

        case "P2003":
          throw new ConflictException({
            code: "CONFLICT",
            message: "That change conflicts with related data",
            retryable: false,
          });

        case "P2025":
          throw new NotFoundException({
            code: "NOT_FOUND",
            message: "Resource not found",
            retryable: false,
          });
      }
    }

    if (exception instanceof Prisma.PrismaClientInitializationError) {
      throw new ServiceUnavailableException({
        code: "DATABASE_UNAVAILABLE",
        message: "Database temporarily unavailable",
        retryable: true,
      });
    }

    throw exception;
  }
}
