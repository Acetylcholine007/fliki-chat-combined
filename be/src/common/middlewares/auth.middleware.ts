import { NextFunction, Response, Request } from "express";
import { HttpException } from "../models/http-exception.model";
import { verifyToken } from "../utils/crypto.utils";
import { AccessTokenSchema } from "../models/token.model";

export default (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    throw new HttpException("No token", 401);
  }
  const token = authHeader.split(" ")[1];

  try {
    const result = verifyToken(token);
    const decodedToken = AccessTokenSchema.parse(result);
    if (!decodedToken) throw new Error();
    req.userId = decodedToken.userId;
    next();
  } catch (err) {
    throw new HttpException("Invalid token", 401);
  }
};
