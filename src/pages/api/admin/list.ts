// pages/api/admin/list.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { dbConnect } from '../../../lib/dbConnect';
import { Admin, IAdmin } from '../../../models/Admin';
import jwt from 'jsonwebtoken';

if (!process.env.JWT_SECRET) {
  throw new Error('Define JWT_SECRET in .env.local');
}

type AdminSafe = Pick<IAdmin, '_id' | 'email' | 'status' | 'createdAt'>;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AdminSafe[] | { error: string }>
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  await dbConnect();

  const auth = req.headers.authorization?.split(' ')[1];
  if (!auth) {
    return res.status(401).json({ error: 'Missing authorization token' });
  }

  let payload: any;
  try {
    payload = jwt.verify(auth, process.env.JWT_SECRET!);
  } catch {
    return res.status(403).json({ error: 'Invalid token' });
  }

  const requester = await Admin.findById(payload.id);
  if (!requester || requester.status !== 'approved') {
    return res.status(403).json({ error: 'Not authorized' });
  }

  // Fetch all admins, omitting password
  const admins = await Admin.find({}, '_id email status createdAt').sort({ createdAt: -1 });
  return res.status(200).json(admins as AdminSafe[]);
}
