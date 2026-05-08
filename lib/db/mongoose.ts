import mongoose from "mongoose";

const globalForMongoose = globalThis as unknown as {
  mongooseConn?: typeof mongoose;
  mongoosePromise?: Promise<typeof mongoose>;
};

export async function connectToDatabase() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not configured");
  }

  if (globalForMongoose.mongooseConn) {
    return globalForMongoose.mongooseConn;
  }

  if (!globalForMongoose.mongoosePromise) {
    globalForMongoose.mongoosePromise = mongoose.connect(process.env.DATABASE_URL, {
      autoIndex: process.env.NODE_ENV !== "production",
    });
  }

  globalForMongoose.mongooseConn = await globalForMongoose.mongoosePromise;
  return globalForMongoose.mongooseConn;
}
