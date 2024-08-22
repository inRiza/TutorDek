import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET: Fetch all materials
export async function GET() {
  try {
    const materials = await db.material.findMany({});
    return NextResponse.json(materials, { status: 200 });
  } catch (error) {
    console.error('Error fetching materials:', error);
    return NextResponse.json({ error: 'Failed to fetch materials' }, { status: 500 });
  }
}

// POST: Create a new material
export async function POST(req: Request) {
  try {
    const { title, link } = await req.json();
    console.log('Received data:', { title, link }); // Log received data

    // Check for missing fields
    if (!title || !link) {
      console.error('Missing title or link in the request body');
      return NextResponse.json({ error: 'Title and link are required' }, { status: 400 });
    }

    const newMaterial = await db.material.create({
      data: {
        title,
        link,
      },
    });

    console.log('Material created:', newMaterial); // Log the created material
    return NextResponse.json(newMaterial, { status: 201 });
  } catch (error) {
    console.error('Error creating material:', error);
    return NextResponse.json({ error: 'Failed to create material' }, { status: 500 });
  }
}
  

// PATCH: Update an existing material
export async function PATCH(req: Request) {
  const { id, title, link } = await req.json();

  try {
    const updatedMaterial = await db.material.update({
      where: { id: parseInt(id, 10) },
      data: { title, link },
    });

    return NextResponse.json(updatedMaterial, { status: 200 });
  } catch (error) {
    console.error('Error updating material:', error);
    return NextResponse.json({ error: 'Failed to update material' }, { status: 500 });
  }
}

// DELETE: Delete a material
export async function DELETE(req: Request) {
  const { id } = await req.json();

  try {
    await db.material.delete({
      where: { id: parseInt(id, 10) },
    });

    return NextResponse.json({ message: 'Material deleted' }, { status: 204 });
  } catch (error) {
    console.error('Error deleting material:', error);
    return NextResponse.json({ error: 'Failed to delete material' }, { status: 500 });
  }
}
