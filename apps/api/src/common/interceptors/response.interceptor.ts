import {
  type CallHandler,
  type ExecutionContext,
  Injectable,
  type NestInterceptor,
} from "@nestjs/common";
import { map } from "rxjs";

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      map((data) => {
        if (
          data &&
          typeof data === "object" &&
          "message" in data &&
          "data" in data
        ) {
          return {
            success: true,
            ...data,
          };
        }

        return {
          success: true,
          data,
        };
      })
    );
  }
}
