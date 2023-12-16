import { Router } from "express";
import { body } from "express-validator";
import UserEntity from "../models/user.entity";
import * as AuthService from "../services/auth.service";
import ValidateMiddleware from "../../../common/middlewares/input-validator.middleware";
import AuthMiddleware from "../../../common/middlewares/auth.middleware";

const router = Router();

router.get("/user-data", AuthMiddleware, AuthService.getUserData);

router.post(
  "/register",
  [
    body("email")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Email required")
      .isEmail()
      .withMessage("Valid email required")
      .custom((value) => {
        return UserEntity.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject("Email address already exists");
          }
        });
      })
      .normalizeEmail({ gmail_remove_dots: false }),
    body("password")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Password required")
      .isLength({ min: 5 })
      .withMessage("Minimum Password length: 5"),
    body("name").trim().not().isEmpty().withMessage("Name required"),
  ],
  ValidateMiddleware,
  AuthService.register
);

router.post(
  "/sign-in",
  [
    body("email").not().isEmpty().withMessage("Email required"),
    body("password").not().isEmpty().withMessage("Password required"),
  ],
  ValidateMiddleware,
  AuthService.signIn
);

export default router;
