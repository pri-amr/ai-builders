import mongoose from "mongoose";

export async function connectDB(uri: string): Promise<typeof mongoose> {
  return mongoose.connect(uri);
}
