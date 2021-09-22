import { Schema, model } from "mongoose";

export const ROLES = ["op", "mod", "adm"];

const roleSchema = new Schema(
  {
    name: String,
  },
  {
    versionKey: false,
  }
);

export default model("Role", roleSchema);
