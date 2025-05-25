// pages/api/admin/review.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { dbConnect } from '../../../lib/dbConnect';
import { Admin } from '../../../models/Admin';
import jwt from 'jsonwebtoken';

if (!process.env.JWT_SECRET) {
  throw new Error('Define JWT_SECRET');
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  await dbConnect();
  if (req.method === 'POST') {
    const auth = req.headers.authorization?.split(' ')[1];
    if (!auth) return res.status(401).json({ error: 'Missing token' });
    let payload: any;
    try { payload = jwt.verify(auth, process.env.JWT_SECRET!); }
    catch { return res.status(403).json({ error: 'Invalid token' }); }

    const me = await Admin.findById(payload.id);
    if (!me || me.status !== 'approved') {
      return res.status(403).json({ error: 'Not allowed' });
    }

    const { adminId, approve } = req.body as { adminId: string; approve: boolean };
    const target = await Admin.findById(adminId);
    if (!target) return res.status(404).json({ error: 'Admin not found' });

    target.status = approve ? 'approved' : 'rejected';
    await target.save();
    return res.status(200).json({ status: target.status });
  }
  res.setHeader('Allow', 'POST');
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
