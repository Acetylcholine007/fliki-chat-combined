import { Router } from "express";
import { body, param, query } from "express-validator";
import * as ChatService from "../services/chat.service";
import ValidateMiddleware from "../../../common/middlewares/input-validator.middleware";
import AuthMiddleware from "../../../common/middlewares/auth.middleware";

const router = Router();

router.get(
  "/",
  AuthMiddleware,
  [
    query("chatGroupId").not().isEmpty().withMessage("chatGroupId is required"),
    query("skip").optional().isNumeric().withMessage("Skip should be a number"),
    query("limit")
      .optional()
      .isNumeric()
      .withMessage("Limit should be a number"),
  ],
  ValidateMiddleware,
  ChatService.getChats
);

router.get(
  "/:chatId",
  AuthMiddleware,
  [param("chatId").not().isEmpty().withMessage("Chat ID required")],
  ValidateMiddleware,
  ChatService.getChat
);

router.post(
  "/",
  AuthMiddleware,
  [
    body("message").not().isEmpty().withMessage("Message required"),
    body("chatGroupId").not().isEmpty().withMessage("Chat group ID required"),
  ],
  ValidateMiddleware,
  ChatService.createChat
);

router.delete(
  "/:chatId",
  AuthMiddleware,
  [param("chatId").not().isEmpty().withMessage("Chat ID required")],
  ValidateMiddleware,
  ChatService.deleteChat
);

export default router;
