// pages/api/assignments/index.js
import { getSession } from 'next-auth/react';
import { db } from '@/lib/db';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
  const session = await getSession({ req });

  if (!session || session.user.role !== 'Tutor') {
    return res.status(403).json({ message: 'Forbidden' });
  }

  if (req.method === 'GET') {
    const assignments = await db.appointmentAssignment.findMany({
      where: {
        appointment: {
          creatorId: parseInt(session.user.id, 10),
        },
      },
      include: {
        user: true,
        appointment: true,
      },
    });
    return res.status(200).json(assignments);
  }

  if (req.method === 'PUT') {
    const { assignmentId, status } = req.body;
    const updatedAssignment = await db.appointmentAssignment.update({
      where: { id: assignmentId },
      data: { status },
    });
    return res.status(200).json(updatedAssignment);
  }
}
