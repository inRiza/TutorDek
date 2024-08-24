import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

// Define enums in TypeScript
enum Weekday {
  Monday = "Monday",
  Tuesday = "Tuesday",
  Wednesday = "Wednesday",
  Thursday = "Thursday",
  Friday = "Friday",
  Saturday = "Saturday",
  Sunday = "Sunday",
}

enum Media {
  Online = "Online",
  Offline = "Offline",
  Hybrid = "Hybrid",
}

// Type guard for Weekday
function isValidWeekday(day: string): day is Weekday {
  return (Object.values(Weekday) as string[]).includes(day);
}

// Type guard for Media
function isValidMedia(media: string): media is Media {
  return (Object.values(Media) as string[]).includes(media);
}

// GET: Fetch all appointments for the logged-in tutor
// GET: Fetch all appointments for the logged-in tutor
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'Tutor') {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  try {
    const appointments = await db.appointment.findMany({
      where: { creatorId: parseInt(session.user.id, 10) },
      include: {
        assignments: true,
      },
    });

    const parsedAppointments = appointments.map((appointment) => {
      const timeRangeObj = appointment.timeRange ? JSON.parse(appointment.timeRange as string) : {};
      const availableDays = appointment.availableDays.map((day: string) => ({
        day,
        timeRange: timeRangeObj[day] || { start: "N/A", end: "N/A" },
      }));
      
      return {
        ...appointment,
        availableDays, // Include day and time range together
      };
    });

    return NextResponse.json(parsedAppointments, { status: 200 });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return NextResponse.json({ error: 'Failed to fetch appointments' }, { status: 500 });
  }
}


// POST: Create a new appointment
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'Tutor') {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  try {
    const { title, description, availableDays, media } = await req.json();

    if (!availableDays.every((item: { day: string, timeRange: { start: string, end: string } }) =>
      isValidWeekday(item.day) && item.timeRange.start && item.timeRange.end) || !isValidMedia(media)) {
      return NextResponse.json({ error: 'Invalid available days, time range, or media type' }, { status: 400 });
    }

    const newAppointment = await db.appointment.create({
      data: {
        title,
        description,
        creatorId: parseInt(session.user.id, 10),
        availableDays: availableDays.map((item: { day: string; timeRange: { start: string; end: string } }) => item.day),
        timeRange: JSON.stringify(availableDays.reduce((acc: any, item: { day: string; timeRange: { start: string; end: string } }) => {
          acc[item.day] = item.timeRange;
          return acc;
        }, {})),
        media,
      },
    });

    return NextResponse.json(newAppointment, { status: 201 });
  } catch (error) {
    console.error('Error creating appointment:', error);
    return NextResponse.json({ error: 'Failed to create appointment' }, { status: 500 });
  }
}

// PATCH: Update an existing appointment
export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'Tutor') {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  try {
    const { id, title, description, availableDays, media } = await req.json();

    if (availableDays && (!availableDays.every((item: { day: string, timeRange: { start: string, end: string } }) =>
      isValidWeekday(item.day) && item.timeRange.start && item.timeRange.end) || (media && !isValidMedia(media)))) {
      return NextResponse.json({ error: 'Invalid available days, time range, or media type' }, { status: 400 });
    }

    const updatedAppointment = await db.appointment.update({
      where: { id: parseInt(id, 10), creatorId: parseInt(session.user.id, 10) },
      data: {
        title,
        description,
        availableDays: availableDays.map((item: { day: string; timeRange: { start: string; end: string } }) => item.day),
        timeRange: JSON.stringify(availableDays.reduce((acc: any, item: { day: string; timeRange: { start: string; end: string } }) => {
          acc[item.day] = item.timeRange;
          return acc;
        }, {})),
        media,
      },
    });

    return NextResponse.json(updatedAppointment, { status: 200 });
  } catch (error) {
    console.error('Error updating appointment:', error);
    return NextResponse.json({ error: 'Failed to update appointment' }, { status: 500 });
  }
}

// DELETE: Delete an appointment
export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'Tutor') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const { id } = await req.json();
    console.log('Attempting to delete appointment with ID:', id);

    const appointmentId = parseInt(id, 10);
    const creatorId = parseInt(session.user.id, 10);

    // Use a transaction to delete related assignments first, then the appointment
    await db.$transaction([
      db.appointmentAssignment.deleteMany({
        where: { appointmentId: appointmentId },
      }),
      db.appointment.delete({
        where: {
          id: appointmentId,
          creatorId: creatorId,
        },
      }),
    ]);

    return NextResponse.json({ message: 'Appointment deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    return NextResponse.json({ error: 'Failed to delete appointment' }, { status: 500 });
  }
}


