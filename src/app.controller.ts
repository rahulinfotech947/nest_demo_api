import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from './auth/auth.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseGuards(AuthGuard)
  @Get()
  getHelloProtected(@Req() req): string {
    return this.appService.getHello(req.user);
  }

  @Post()
  getPdf(@Res() res: any): any {
    return this.appService.getPdfDownload(res);
  }
}
