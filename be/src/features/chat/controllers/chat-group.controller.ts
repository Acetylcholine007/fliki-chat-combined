import { Router } from "express";
import { body, param, query } from "express-validator";
import * as ChatGroupService from "../services/chat-group.service";
import ValidateMiddleware from "../../../common/middlewares/input-validator.middleware";
import AuthMiddleware from "../../../common/middlewares/auth.middleware";
import chatGroupEntity from "../models/chat-group.entity";

const router = Router();

router.get(
  "/external",
  AuthMiddleware,
  [
    query("skip").optional().isNumeric().withMessage("Skip should be a number"),
    query("limit")
      .optional()
      .isNumeric()
      .withMessage("limit should be a number"),
  ],
  ValidateMiddleware,
  ChatGroupService.getExternalChatGroups
);

router.get(
  "/",
  AuthMiddleware,
  [
    query("skip").optional().isNumeric().withMessage("Skip should be a number"),
    query("limit")
      .optional()
      .isNumeric()
      .withMessage("limit should be a number"),
  ],
  ValidateMiddleware,
  ChatGroupService.getChatGroups
);

router.get(
  "/:chatGroupId",
  AuthMiddleware,
  [param("chatGroupId").not().isEmpty().withMessage("Chat group ID required")],
  ValidateMiddleware,
  ChatGroupService.getChatGroup
);

router.post(
  "/",
  AuthMiddleware,
  [
    body("name")
      .not()
      .isEmpty()
      .withMessage("Name required")
      .isLength({ min: 2 })
      .withMessage("Minimum name length: 2")
      .custom((value) => {
        return chatGroupEntity.findOne({ name: value }).then((chatGroup) => {
          if (chatGroup) {
            return Promise.reject("Chat group name already exists");
          }
        });
      }),
  ],
  ValidateMiddleware,
  ChatGroupService.createChatGroup
);

router.patch(
  "/join/:chatGroupId",
  AuthMiddleware,
  [param("chatGroupId").not().isEmpty().withMessage("Chat group ID required")],
  ValidateMiddleware,
  ChatGroupService.joinChatGroup
);

router.patch(
  "/leave/:chatGroupId",
  AuthMiddleware,
  [param("chatGroupId").not().isEmpty().withMessage("Chat group ID required")],
  ValidateMiddleware,
  ChatGroupService.leaveChatGroup
);

router.patch(
  "/:chatGroupId",
  AuthMiddleware,
  [
    param("chatGroupId").not().isEmpty().withMessage("Chat group ID required"),
    body("name")
      .isLength({ min: 2 })
      .withMessage("Minimum name length: 2")
      .custom((value) => {
        return chatGroupEntity.findOne({ name: value }).then((chatGroup) => {
          if (chatGroup) {
            return Promise.reject("Chat group name already exists");
          }
        });
      }),
  ],
  ValidateMiddleware,
  ChatGroupService.updateChatGroup
);

router.delete(
  "/:chatGroupId",
  AuthMiddleware,
  [param("chatGroupId").not().isEmpty().withMessage("Chat group ID required")],
  ValidateMiddleware,
  ChatGroupService.deleteChatGroup
);

export default router;
