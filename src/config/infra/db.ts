import mongoose from "mongoose";

const cached = (global as any).mongoose || { conn: null, promise: null };

export default async function initDB() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(process.env.MONGODB_URI as string)
      .then((mongoose) => mongoose); //return the connection
  }
  try {
    cached.conn = await cached.promise;
  } catch (err) {
    console.error(`Error connecting to MongoDB: `, err);
    throw err; // optional: rethrow so you can handle connection failures
  }
  return cached.conn;
}
