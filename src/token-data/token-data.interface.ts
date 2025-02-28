import mongoose from 'mongoose';

export interface TokenData {
  userId: mongoose.Types.ObjectId;
  [key: string]: any;
}
