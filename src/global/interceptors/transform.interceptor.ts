import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpResponse } from '../request/api-response.dto';

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, HttpResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<HttpResponse<T>> {
    const response = context.switchToHttp().getResponse();
    const statusCode = response.statusCode || HttpStatus.OK;

    return next.handle().pipe(
      map((res) => {
        if (!res?.success) return res;

        const transformedResponse: HttpResponse<T> = {
          statusCode,
          success: true,
          message: 'Success',
          data: res?.data !== undefined ? res.data : res,
        };

        if (res?.meta) transformedResponse.meta = res.meta;
        return transformedResponse;
      }),
    );
  }
}
