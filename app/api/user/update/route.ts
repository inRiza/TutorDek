import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
export async function POST(req: Request) {
  const { userId, description, jurusan } = await req.json();

  try {
    const updatedUser = await db.user.update({
      where: { id: parseInt(userId, 10) },
      data: {
        description: description || '',
        jurusan: jurusan || '',
      },
    });

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Failed to update user information' }, { status: 500 });
  }
}
  