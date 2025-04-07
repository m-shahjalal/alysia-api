import { Injectable, Scope } from '@nestjs/common';
import { currentTime } from '../../lib/date';
import { createLogger, format, Logger, transports } from 'winston';

@Injectable({ scope: Scope.TRANSIENT })
export class AppLogger {
  private context?: string;
  private logger: Logger;

  constructor() {
    this.logger = createLogger({
      format: format.combine(
        format.timestamp(),
        format.printf(({ level, message, context, reqId }) => {
          return `${currentTime()} [${level}] [${context}] ${reqId ? `[${reqId}]` : ''} ${message}`;
        }),
      ),
      transports: [new transports.Console()],
    });
  }

  setContext(context: string) {
    this.context = context;
  }

  error(message: string, trace?: string, context?: string): void {
    this.logger.error({
      message,
      trace,
      context: context || this.context,
    });
  }

  warn(message: string, context?: string): void {
    this.logger.warn({
      message,
      context: context || this.context,
    });
  }

  debug(message: string, context?: string): void {
    this.logger.debug({
      message,
      context: context || this.context,
    });
  }

  verbose(message: string, context?: string): void {
    this.logger.verbose({
      message,
      context: context || this.context,
    });
  }

  log(message: string, context?: string): void {
    this.logger.info({
      message,
      context: context || this.context,
    });
  }
}
