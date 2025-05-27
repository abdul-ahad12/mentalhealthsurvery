// models/SurveyEntry.ts
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISurveyEntry extends Document {
  answers: Map<string, string>;
  result: string;
  meter: number;
  createdAt: Date;
}


const SurveyEntrySchema = new Schema<ISurveyEntry>({
  answers:   { type: Map, of: String, required: true },
  result:    { type: String, required: true },
  meter:     { type: Number, required: true },
  createdAt: { type: Date,   default: Date.now },
});

export const SurveyEntry: Model<ISurveyEntry> =
  (mongoose.models.SurveyEntry as Model<ISurveyEntry>) ||
  mongoose.model<ISurveyEntry>('SurveyEntry', SurveyEntrySchema);
