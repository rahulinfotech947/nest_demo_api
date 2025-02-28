import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwt: JwtService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('Invalid token');
    }
    try {
      const payload = this.jwt.verify(token);
      request.user = payload;
      return true;
    } catch (error) {
      Logger.error(error.message);
      throw new UnauthorizedException(error.message);
    }
  }
  private extractTokenFromHeader = (request): string | undefined => {
    return request.headers.authorization?.split(' ')[1];
  };
}
