import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'Tutor') {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  try {
    const assignments = await db.appointmentAssignment.findMany({
      where: {
        appointment: {
          creatorId: parseInt(session.user.id, 10),
        },
      },
      include: {
        user: {
          select: {
            fullName: true,
            email: true,
          },
        },
        appointment: {
          select: {
            title: true,
          },
        },
      },
    });

    return NextResponse.json(assignments, { status: 200 });
  } catch (error) {
    console.error('Error fetching assignments:', error);
    return NextResponse.json({ error: 'Failed to fetch assignments' }, { status: 500 });
  }
}
