import { Schema, model, type InferSchemaType } from "mongoose";

const categorySchema = new Schema(
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

export type Category = InferSchemaType<typeof categorySchema>;

export default model("Category", categorySchema);
