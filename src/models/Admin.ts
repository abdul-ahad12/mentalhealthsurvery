// models/Admin.ts
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAdmin extends Document {
  email: string;
  password: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
}

const AdminSchema = new Schema<IAdmin>({
  email:     { type: String, required: true, unique: true },
  password:  { type: String, required: true },
  status:    { type: String, enum: ['pending','approved','rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

export const Admin: Model<IAdmin> =
  (mongoose.models.Admin as Model<IAdmin>) ||
  mongoose.model<IAdmin>('Admin', AdminSchema);
