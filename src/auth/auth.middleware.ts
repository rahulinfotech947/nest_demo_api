import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { CommonService } from 'src/common/common.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private common: CommonService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Token is missing or invalid' });
    }
    try {
      const decoded = await this.common.verifyToken(token);
      req['user'] = decoded;
      next();
    } catch (error) {
      return res.status(401).json({ message: error.message });
    }
  }
}
