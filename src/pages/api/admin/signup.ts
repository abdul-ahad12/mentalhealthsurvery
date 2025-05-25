// pages/api/admin/signup.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { dbConnect } from '../../../lib/dbConnect';
import { Admin } from '../../../models/Admin';
import bcrypt from 'bcryptjs';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  await dbConnect();
  if (req.method === 'POST') {
    const { email, password } = req.body as { email: string; password: string };
    if (await Admin.findOne({ email })) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    const hash = await bcrypt.hash(password, 10);
    await new Admin({ email, password: hash }).save();
    return res.status(201).json({ message: 'Signup successful, pending approval' });
  }
  res.setHeader('Allow', 'POST');
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
