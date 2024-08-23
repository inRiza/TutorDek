import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function DELETE(req: Request) {
  const { userId } = await req.json();

  try {
    await db.user.delete({
      where: { id: parseInt(userId, 10) },
    });

    return NextResponse.json({ message: 'User deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}
