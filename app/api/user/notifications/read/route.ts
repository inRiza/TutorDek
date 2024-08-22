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
    const readNotifications = await db.notification.findMany({
      where: {
        userId: parseInt(session.user.id, 10),
        status: 'READ',
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(readNotifications, { status: 200 });
  } catch (error) {
    console.error('Error fetching read notifications:', error);
    return NextResponse.json({ error: 'Failed to fetch read notifications' }, { status: 500 });
  }
}
