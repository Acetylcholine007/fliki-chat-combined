import { NextFunction, Response, Request } from "express";
import { HttpException } from "../models/http-exception.model";

export default (
  error: HttpException,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const status = error.statusCode || 500;
  res.status(status).json({ message: error.message, data: error.data });
};
