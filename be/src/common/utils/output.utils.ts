import { Document } from "mongoose";

export const outputTransformer = (document: Document) => {
  return document.toJSON({
    transform: (doc: any, ret: any) => {
      delete ret.password;
      return ret;
    },
  });
};
