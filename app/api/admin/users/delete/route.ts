import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'Admin') { // Assuming only Admins can delete users
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const { userId } = await req.json();
    console.log('Attempting to delete user with ID:', userId);

    const id = parseInt(userId, 10);

    // Use a transaction to delete related records and then the user
    await db.$transaction([
      db.notification.deleteMany({
        where: { userId: id },
      }),
      db.appointmentAssignment.deleteMany({
        where: { userId: id },
      }),
      db.appointment.deleteMany({
        where: { creatorId: id },
      }),
      db.user.delete({
        where: { id: id },
      }),
    ]);

    return NextResponse.json({ message: 'User deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}
