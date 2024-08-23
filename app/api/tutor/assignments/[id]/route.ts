import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'Tutor') {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  const { id } = params;
  const { status } = await req.json();

  if (!status) {
    return NextResponse.json({ error: 'Status is required' }, { status: 400 });
  }

  try {
    // Update the assignment status
    const updatedAssignment = await db.appointmentAssignment.update({
      where: { id: parseInt(id, 10) },
      data: { status },
      include: {
        user: true, // Include user data for the notification
        appointment: {
          include: {
            creator: true, // Include tutor data for the notification
          },
        },
      },
    });

    // Create a notification for the user
    const message =
      status === 'Accepted'
        ? `Your appointment is accepted by ${updatedAssignment.appointment.creator.fullName}`
        : `Your appointment is declined by ${updatedAssignment.appointment.creator.fullName}`;

    await db.notification.create({
      data: {
        userId: updatedAssignment.userId,
        message,
        status: 'NEW',
        appointmentAssignmentId: updatedAssignment.id, // Link to the appointment assignment
      },
    });

    return NextResponse.json(updatedAssignment, { status: 200 });
  } catch (error) {
    console.error('Error updating assignment status:', error);
    return NextResponse.json({ error: 'Failed to update assignment status' }, { status: 500 });
  }
}
