// models/Question.ts
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface Option {
  key: string;
  text: string;
  weight: number;
}

export interface IQuestion extends Document {
  qid: string;
  text: string;
  options: Option[];
}

const OptionSchema = new Schema<Option>(
  {
    key:    { type: String, required: true },
    text:   { type: String, required: true },
    weight: { type: Number, required: true },
  },
  { _id: false }
);

const QuestionSchema = new Schema<IQuestion>({
  qid:     { type: String, required: true, unique: true },
  text:    { type: String, required: true },
  options: { type: [OptionSchema], required: true },
});

export const Question: Model<IQuestion> =
  (mongoose.models.Question as Model<IQuestion>) ||
  mongoose.model<IQuestion>('Question', QuestionSchema);
