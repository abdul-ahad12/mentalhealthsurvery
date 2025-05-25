// pages/api/survey/questions.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { dbConnect } from '../../../lib/dbConnect';
import { IQuestion, Question } from '@/models/Questions';
import { INITIAL_QUESTIONS } from '@/lib/surveryQuestions';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Array<Pick<IQuestion,'qid'|'text'|'options'>> | { error: string }>
) {
  await dbConnect();
  if (req.method === 'GET') {
    const count = await Question.countDocuments();
    if (count === 0) {
      await Question.insertMany(INITIAL_QUESTIONS);
    }
    const qs = await Question.find().select('qid text options -_id');
    return res.status(200).json(qs);
  }
  res.setHeader('Allow', 'GET');
  res.status(405).json({ error: `Method ${req.method} Not Allowed` });
}
