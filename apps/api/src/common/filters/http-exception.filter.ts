import {
  ArgumentsHost,
  Catch,
  type ExceptionFilter,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import type { ApiErrorCode } from "@repo/types";
import type { Request, Response } from "express";

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const context = host.switchToHttp();

    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let code: ApiErrorCode = "INTERNAL_ERROR";
    let message = "Internal server error";
    let retryable = status >= 500 || status === 429;
    let retryAfter: number | undefined;
    let errors: Record<string, string[]> | undefined;

    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === "string") {
        message = exceptionResponse;
      } else if (
        typeof exceptionResponse === "object" &&
        exceptionResponse !== null
      ) {
        const body = exceptionResponse as {
          code?: ApiErrorCode;
          message?: string | string[];
          retryable?: boolean;
          errors?: Record<string, string[]>;
          retryAfter?: number;
        };

        if (body.code) {
          code = body.code;
        }

        if (body.message) {
          message = Array.isArray(body.message)
            ? body.message.join(", ")
            : body.message;
        }

        if (body.retryable !== undefined) {
          retryable = body.retryable;
        }

        errors = body.errors;
        if (body.retryAfter && Number.isFinite(body.retryAfter))
          retryAfter = Math.ceil(body.retryAfter);
      }

      if (code === "INTERNAL_ERROR") {
        code = this.getErrorCode(status);
      }
    } else {
      console.error(
        `[${new Date().toISOString()}] ${request.method} ${request.url}`,
        exception
      );
    }

    if (retryAfter) response.setHeader("Retry-After", retryAfter);
    response.status(status).json({
      success: false,
      error: {
        code,
        message,
        retryable,
        ...(errors ? { errors } : {}),
        ...(retryAfter ? { retryAfter } : {}),
      },
    });
  }

  private getErrorCode(status: number): ApiErrorCode {
    switch (status) {
      case HttpStatus.BAD_REQUEST:
        return "VALIDATION_ERROR";

      case HttpStatus.UNAUTHORIZED:
        return "UNAUTHORIZED";

      case HttpStatus.FORBIDDEN:
        return "FORBIDDEN";

      case HttpStatus.NOT_FOUND:
        return "NOT_FOUND";

      case HttpStatus.CONFLICT:
        return "CONFLICT";

      case HttpStatus.SERVICE_UNAVAILABLE:
        return "SERVICE_UNAVAILABLE";
      case HttpStatus.TOO_MANY_REQUESTS:
        return "RATE_LIMITED";

      default:
        return "INTERNAL_ERROR";
    }
  }
}
