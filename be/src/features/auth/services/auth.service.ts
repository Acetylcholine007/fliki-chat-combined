import UserEntity from "../models/user.entity";
import { Request, Response, NextFunction } from "express";
import { HttpException } from "../../../common/models/http-exception.model";
import { outputTransformer } from "../../../common/utils/output.utils";
import {
  createSignInToken,
  hashData,
  verifyHash,
} from "../../../common/utils/crypto.utils";

export const getUserData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await UserEntity.findById(req.userId).populate({
      path: "chatGroups",
      options: { sort: { updatedAt: "desc" } },
      populate: [
        {
          path: "chats",
          options: { sort: { createdAt: "desc" }, limit: 1 },
          populate: {
            path: "sender",
            select: "-password -chatGroups",
          },
        },
        {
          path: "participants",
          select: "-password -chatGroups",
        },
      ],
    });

    if (user == null) throw new HttpException("User data not found", 404);

    res.status(200).json({
      message: "User fetched",
      data: outputTransformer(user),
    });
  } catch (err) {
    if (err instanceof HttpException) next(err);
    if (err instanceof Error) {
      next(HttpException.toHTTPException(err));
    }
    next(err);
  }
};
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const hashedPw = await hashData(password);

    const user = new UserEntity({
      name,
      email,
      password: hashedPw,
    });

    const result = await user.save();
    const token = createSignInToken({
      email: user.email,
      userId: user._id.toString(),
    });

    res.status(200).json({
      message: "User created",
      data: { user: outputTransformer(result), token },
    });
  } catch (err) {
    if (err instanceof HttpException) next(err);
    if (err instanceof Error) {
      next(HttpException.toHTTPException(err));
    }
    next(err);
  }
};

export const signIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const user = await UserEntity.findOne({ email: email }).populate({
      path: "chatGroups",
      options: { sort: { updatedAt: "desc" } },
      populate: [
        {
          path: "chats",
          options: { sort: { createdAt: "desc" }, limit: 1 },
          populate: {
            path: "sender",
            select: "-password -chatGroups",
          },
        },
        {
          path: "participants",
          select: "-password -chatGroups",
        },
      ],
    });

    if (!user) {
      throw new HttpException("Invalid credentials", 401);
    }
    if (!user.isVerified) {
      throw new HttpException(
        "Account Not verified. Check your inbox or spam for verification email.",
        403
      );
    }
    const isEqual = await verifyHash(password, user.password);
    if (!isEqual) {
      throw new HttpException("Invalid credentials", 401);
    }

    const token = createSignInToken({
      email: user.email,
      userId: user._id.toString(),
    });

    res.status(200).json({
      message: "Successfully logged In",
      data: { user: outputTransformer(user), token },
    });
  } catch (err) {
    if (err instanceof HttpException) next(err);
    if (err instanceof Error) {
      next(HttpException.toHTTPException(err));
    }
    next(err);
  }
};
