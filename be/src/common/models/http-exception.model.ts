export class HttpException extends Error {
  statusCode: number;
  message: string;
  data?: string;

  constructor(
    message: string,
    statusCode: number,
    options?: {
      data?: string;
    }
  ) {
    super(message);
    this.statusCode = statusCode;
    this.data = options?.data;
    this.message = message;
  }

  public static toHTTPException(error: Error) {
    return new HttpException(error.message, 500);
  }
}
