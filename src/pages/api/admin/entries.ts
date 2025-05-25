// pages/api/admin/entries.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { dbConnect } from '../../../lib/dbConnect';
import jwt from 'jsonwebtoken';
import { SurveyEntry } from '@/models/SurveryEntry';
import { Admin } from '@/models/Admin';

if (!process.env.JWT_SECRET) {
  throw new Error('Define JWT_SECRET');
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  await dbConnect();
  if (req.method === 'GET') {
    const auth = req.headers.authorization?.split(' ')[1];
    if (!auth) return res.status(401).json({ error: 'Missing token' });
    let payload: any;
    try { payload = jwt.verify(auth, process.env.JWT_SECRET!); }
    catch { return res.status(403).json({ error: 'Invalid token' }); }

    const me = await Admin.findById(payload.id);
    if (!me || me.status !== 'approved') {
      return res.status(403).json({ error: 'Not allowed' });
    }

    const entries = await SurveyEntry.find().sort({ createdAt: -1 });
    return res.status(200).json(entries);
  }
  res.setHeader('Allow', 'GET');
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
