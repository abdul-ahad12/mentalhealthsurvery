// lib/dbConnect.ts
import mongoose from 'mongoose';

if (!process.env.MONGODB_URI) {
  throw new Error('Define MONGODB_URI in .env.local');
}

declare global {
  var mongoose: {
    conn: mongoose.Connection | null;
    promise: Promise<mongoose.Connection> | null;
  };
}

const cached = global.mongoose || (global.mongoose = { conn: null, promise: null });

export async function dbConnect(): Promise<mongoose.Connection> {
  if (cached.conn) {
    return cached.conn;
  }
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      useNewUrlParser: true as const,
      useUnifiedTopology: true as const,
    };
    cached.promise = mongoose
      .connect(process.env.MONGODB_URI!, opts)
      .then((m) => m.connection);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
