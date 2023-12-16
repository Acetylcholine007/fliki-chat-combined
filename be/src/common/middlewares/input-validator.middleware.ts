import { validationResult } from "express-validator";
import { NextFunction, Response, Request } from "express";
import { HttpException } from "../models/http-exception.model";

export default (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new HttpException("Failed to pass validation", 422, {
      data: JSON.stringify(errors.mapped()),
    });
    throw error;
  }

  next();
};
