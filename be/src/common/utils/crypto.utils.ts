import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";

export const createSignInToken = (data: Record<string, any>) => {
  const token = jwt.sign(data, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_ACCESS_TOKEN_TTL,
    audience: process.env.JWT_AUDIENCE,
    issuer: process.env.JWT_ISSUER,
  });

  return token;
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET!, {
    audience: process.env.JWT_AUDIENCE,
    issuer: process.env.JWT_ISSUER,
  });
};

export const hashData = (data: string, saltOrRound?: string | number) => {
  return bcrypt.hash(data, saltOrRound ?? 12);
};

export const verifyHash = (data: string, hash: string) => {
  return bcrypt.compare(data, hash);
};
