import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { CommonService } from 'src/common/common.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private common: CommonService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Invalid token');
    }
    try {
      const decoded = await this.common.verifyToken(token);
      req['user'] = decoded;
      next();
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }
}
