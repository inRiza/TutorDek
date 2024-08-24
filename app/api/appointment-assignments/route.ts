import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { Duration } from '@prisma/client'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { appointmentId, selectedDate, selectedTime, peopleCount, duration, media } = await req.json();
  console.log('Received appointment assignment data:', { appointmentId, selectedDate, selectedTime, peopleCount, duration, media });


  if (!appointmentId || !selectedDate || !selectedTime || !peopleCount || !duration) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }
  const mapDurationToEnum = (duration: string): Duration => {
    console.log("Raw duration value:", duration);
    switch (duration) {
      case "1":
        return Duration.ONE_HOUR;
      case "1.5":
        return Duration.ONE_AND_HALF;
      case "2":
        return Duration.TWO_HOURS;
      case "2.5":
        return Duration.TWO_AND_HALF;
      case "3":
        return Duration.THREE_HOURS;
      default:
        throw new Error(`Invalid duration value: ${duration}`); // Fallback if needed
    }
  };

  try {
    const enumDuration = mapDurationToEnum(duration)
    const newAppointmentAssignment = await db.appointmentAssignment.create({
      data: {
        userId: parseInt(session.user.id, 10),
        appointmentId,
        selectedDate: new Date(selectedDate),
        selectedTime: new Date(selectedTime),
        peopleCount,
        duration: enumDuration,
        media, // Add the duration field here  
      },
    });

    return NextResponse.json(newAppointmentAssignment, { status: 201 });
  } catch (error) {
    console.error('Error creating appointment assignment:', error);
    return NextResponse.json({ error: 'Failed to create appointment assignment' }, { status: 500 });
  }
}
