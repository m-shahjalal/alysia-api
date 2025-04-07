import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { Request } from 'express-serve-static-core';
import { UserAccessTokenClaims } from './auth-response.dto';

export const REQUEST_ID_TOKEN_HEADER = 'x-request-id';
export const FORWARDED_FOR_TOKEN_HEADER = 'x-forwarded-for';

export class RequestContext {
  requestID: string;
  url: string;
  ip: string;
  user?: UserAccessTokenClaims;
}

export const ReqContext = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): RequestContext => {
    const request = ctx.switchToHttp().getRequest();

    return createRequestContext(request);
  },
);

function createRequestContext(
  request: Request & ExpressRequest,
): RequestContext {
  const ctx = new RequestContext();

  ctx.requestID = request.header(REQUEST_ID_TOKEN_HEADER) || '';
  ctx.url = request.url;
  ctx.ip = request.header(FORWARDED_FOR_TOKEN_HEADER) || request.ip;

  return ctx;
}
