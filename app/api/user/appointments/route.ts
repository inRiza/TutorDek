import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const appointments = await db.appointmentAssignment.findMany({
      where: {
        userId: parseInt(session.user.id, 10),
      },
      include: {
        appointment: {
          select: {
            id: true,
            title: true,
            media: true,
            creator: {
              select: {
                fullName: true,
                phoneNumber: true,
                jurusan: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(appointments, { status: 200 });
  } catch (error) {
    console.error('Error fetching user appointments:', error);
    return NextResponse.json({ error: 'Failed to fetch appointments' }, { status: 500 });
  }
}
