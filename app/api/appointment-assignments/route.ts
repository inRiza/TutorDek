import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { appointmentId, selectedDate, selectedTime, peopleCount } = await req.json();

  if (!appointmentId || !selectedDate || !selectedTime || !peopleCount) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    const newAppointmentAssignment = await db.appointmentAssignment.create({
      data: {
        userId: parseInt(session.user.id, 10),
        appointmentId,
        selectedDate: new Date(selectedDate),
        selectedTime: new Date(selectedTime),
        peopleCount,
      },
    });

    return NextResponse.json(newAppointmentAssignment, { status: 201 });
  } catch (error) {
    console.error('Error creating appointment assignment:', error);
    return NextResponse.json({ error: 'Failed to create appointment assignment' }, { status: 500 });
  }
}
