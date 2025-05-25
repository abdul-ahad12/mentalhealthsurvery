// pages/api/admin/login.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { dbConnect } from '../../../lib/dbConnect';
import { Admin } from '../../../models/Admin';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

if (!process.env.JWT_SECRET) {
  throw new Error('Define JWT_SECRET in .env.local');
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  await dbConnect();
  if (req.method === 'POST') {
    const { email, password } = req.body as { email: string; password: string };
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(401).json({ error: 'Invalid credentials' });
    if (admin.status !== 'approved') {
      return res.status(403).json({ error: 'Account not approved' });
    }
    if (!(await bcrypt.compare(password, admin.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      process.env.JWT_SECRET!,
      { expiresIn: '8h' }
    );
    return res.status(200).json({ token });
  }
  res.setHeader('Allow', 'POST');
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
