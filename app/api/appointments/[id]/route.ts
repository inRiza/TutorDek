import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: 'Appointment ID is required' }, { status: 400 });
  }

  try {
    const appointment = await db.appointment.findUnique({
      where: { id: parseInt(id, 10) },
      include: {
        creator: {
          select: {
            fullName: true,
            jurusan: true,
            description: true,
          },
        },
      },
    });

    if (!appointment) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }

    const timeRangeObj = appointment.timeRange ? JSON.parse(appointment.timeRange as string) : {};
    const availableDays = appointment.availableDays.map((day: string) => ({
      day,
      timeRange: timeRangeObj[day] || { start: "N/A", end: "N/A" },
    }));

    const responseAppointment = {
      ...appointment,
      availableDays,
    };

    return NextResponse.json(responseAppointment, { status: 200 });
  } catch (error) {
    console.error('Error fetching appointment:', error);
    return NextResponse.json({ error: 'Failed to fetch appointment' }, { status: 500 });
  }
}
