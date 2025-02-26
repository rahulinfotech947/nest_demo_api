import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { RefreshToken } from 'src/Schema/refresh.token.schema';
import { TokenData } from 'src/token-data/token-data.interface';

@Injectable()
export class CommonService {
  constructor(
    private jwt: JwtService,
    @InjectModel(RefreshToken.name)
    private refreshTokenModel: Model<RefreshToken>,
  ) {}
  generateToken = async (data: TokenData) => {
    const isTokenAvailable = await this.refreshTokenModel.findOne({
      userId: data.userId,
    });
    const token = this.jwt.sign(data, { expiresIn: '1h' });
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 3);
    if (isTokenAvailable) {
      await this.refreshTokenModel.findByIdAndUpdate(
        isTokenAvailable._id,
        { token, expiryDate },
        { new: true },
      );
    } else {
      await this.refreshTokenModel.create({
        token,
        userId: data.userId,
        expiryDate,
      });
    }
    return token;
  };

  verifyToken = async (token: string) => {
    return this.jwt.verify(token);
  };

  deleteToken = async (userId: mongoose.Types.ObjectId) => {
    const isDeleted = await this.refreshTokenModel.findOneAndDelete({ userId });
    return isDeleted;
  };
}
