import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const tutors = await db.user.findMany({
      where: { role: 'Tutor' },
    });

    return NextResponse.json(tutors, { status: 200 });
  } catch (error) {
    console.error('Error fetching tutors:', error);
    return NextResponse.json({ error: 'Failed to fetch tutors' }, { status: 500 });
  }
}
