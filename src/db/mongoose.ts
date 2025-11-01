import mongoose from "mongoose";

let connectionPromise: Promise<typeof mongoose> | null = null;

export async function connectToDatabase(uri: string): Promise<typeof mongoose> {
  if (connectionPromise) return connectionPromise;
  connectionPromise = mongoose.connect(uri, {
    autoIndex: true
  });
  return connectionPromise;
}


