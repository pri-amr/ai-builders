import { Schema, model, type InferSchemaType } from "mongoose";

const moneySourceSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

export type MoneySource = InferSchemaType<typeof moneySourceSchema>;

export default model("MoneySource", moneySourceSchema);
