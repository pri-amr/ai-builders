import { Schema, model, type InferSchemaType } from "mongoose";

const transactionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["income", "expense"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    moneySourceId: {
      type: Schema.Types.ObjectId,
      ref: "MoneySource",
      required: true,
    },
    currency: {
      type: String,
      enum: ["ARS", "USD"],
      required: true,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

export type Transaction = InferSchemaType<typeof transactionSchema>;

export default model("Transaction", transactionSchema);
