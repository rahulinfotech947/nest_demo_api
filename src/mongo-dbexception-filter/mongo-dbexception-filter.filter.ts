import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import * as mongoose from 'mongoose';
import { Request, Response } from 'express';

// This filter will catch MongoDB/Mongoose errors
@Catch(mongoose.Error)
export class MongoDBExceptionFilter implements ExceptionFilter {
  catch(exception: mongoose.Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    // Check if the error is an instance of the native MongoDB error class
    if (exception instanceof mongoose.mongo.MongoError) {
      // Handle duplicate key error (error code 11000)
      if (exception.code === 11000) {
        status = HttpStatus.BAD_REQUEST;
        message = `Duplicate key error: ${exception.message}`;
      }
    }

    // Handle other Mongoose-specific errors (like validation errors)
    if (exception instanceof mongoose.Error.ValidationError) {
      status = HttpStatus.BAD_REQUEST;
      message = 'Validation error: ' + exception.message;
    }

    // Send response with the error details
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }
}
