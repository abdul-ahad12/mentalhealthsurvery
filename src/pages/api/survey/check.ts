// pages/api/survey/check.ts
import { dbConnect } from '@/lib/dbConnect';
import { Question } from '@/models/Questions';
import type { NextApiRequest, NextApiResponse } from 'next';

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

  let resultLabel: string;
  let feedback: string;
  if (meter >= 80) {
    resultLabel = 'Healthy';
    feedback = 'Great! You seem to be in a good place. Keep up your positive habits.';
  } else if (meter >= 50) {
    resultLabel = 'Mild Concerns';
    feedback = 'You have some areas to watch. Consider simple stress-relief techniques or talking to someone you trust.';
  } else {
    resultLabel = 'At Risk';
    feedback = 'It looks like you may need support. Please consider reaching out to a mental health professional.';
  }

  return { meter, result: resultLabel, feedback };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  await dbConnect();

  if (req.method === 'POST') {
    const { answers } = req.body as { answers: Answers };
    if (!answers || typeof answers !== 'object') {
      return res.status(400).json({ error: 'Answers are required' });
    }

    const { meter, result, feedback } = await computePsychologicalState(answers);
    return res.status(200).json({ meter, result, feedback });
  }

  res.setHeader('Allow', 'POST');
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
