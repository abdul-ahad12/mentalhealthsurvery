// pages/api/survey/index.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { dbConnect } from '../../../lib/dbConnect';
import { Question } from '@/models/Questions';
import { SurveyEntry } from '@/models/SurveryEntry';

type Answers = Record<string,string>;

async function computePsychologicalState(answers: Answers) {
  const qs = await Question.find();
  const weightMap: Record<string,number> = {};
  qs.forEach(q =>
    q.options.forEach(opt => {
      weightMap[`${q.qid}:${opt.key}`] = opt.weight;
    })
  );
  let total = 0;
  Object.entries(answers).forEach(([qid, key]) => {
    total += weightMap[`${qid}:${key}`] || 0;
  });
  const maxPossible = qs.length * 3;
  const meter = Math.round((total / maxPossible) * 100);
  const result =
    meter >= 80 ? 'Healthy' :
    meter >= 50 ? 'Mild Concerns' :
                  'At Risk';
  return { meter, result };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  await dbConnect();
  if (req.method === 'POST') {
    const { answers } = req.body as {
      answers: Answers;
    };
    const { meter, result } = await computePsychologicalState(answers);
    const entry = new SurveyEntry({ answers, meter, result });
    await entry.save();
    return res.status(201).json({ meter, result });
    
  }
  res.setHeader('Allow', 'POST');
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
