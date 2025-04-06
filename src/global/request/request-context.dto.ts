import { UserAccessTokenClaims } from './auth-token-output.dto';

export class RequestContext {
  requestID: string;
  url: string;
  ip: string;
  user?: UserAccessTokenClaims;
}
