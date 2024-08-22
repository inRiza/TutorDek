import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    // Fetch all appointments and include the creator's details
    const appointments = await db.appointment.findMany({
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

    // Process the appointments to parse the timeRange JSON
    const parsedAppointments = appointments.map((appointment) => {
      const timeRangeObj = appointment.timeRange ? JSON.parse(appointment.timeRange as string) : {};
      const availableDays = appointment.availableDays.map((day: string) => ({
        day,
        timeRange: timeRangeObj[day] || { start: "N/A", end: "N/A" },
      }));
      
      return {
        ...appointment,
        availableDays,
      };
    });

    return NextResponse.json(parsedAppointments, { status: 200 });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return NextResponse.json({ error: 'Failed to fetch appointments' }, { status: 500 });
  }
}
