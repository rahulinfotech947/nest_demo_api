import { Header, HttpStatus, Injectable, Res } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class AppService {
  getHello(user: any): any {
    return { message: `Hello World!`, user };
  }

  @Header('Content-Disposition', 'attachment; filename="data.pdf"')
  getPdfDownload(@Res() res: any) {
    const filePath = path.join(__dirname, '../public', '', 'data.pdf');
    const fileName = 'data.pdf';

    fs.readFile(filePath, (err, data) => {
      if (err) {
        return res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .send('File not found');
      }
      res.setHeader('Content-disposition', 'attachment; filename=' + fileName);
      res.send(data);
    });
  }
}
