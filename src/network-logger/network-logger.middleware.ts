import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class NetworkLoggerMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    console.log('🚀 ~ Global middleware.....');
    next();
  }
}
