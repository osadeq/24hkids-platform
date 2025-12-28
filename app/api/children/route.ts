// app/api/children/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/src/lib/prisma';

// GET /api/children - Récupérer tous les enfants
export async function GET() {
  try {
    const children = await prisma.child.findMany({
      include: {
        parent: true, // Inclure le parent lié
      },
      orderBy: {
        lastName: 'asc',
      },
    });
    return NextResponse.json(children);
  } catch (error) {
    console.error('[API_CHILDREN_GET]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// POST /api/children - Créer un nouvel enfant
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { firstName, lastName, birthDate, parentId, allergies, medicalNote } = body;

    // Validation
    if (!firstName || !lastName || !birthDate || !parentId) {
      return new NextResponse('First name, last name, birth date, and parentId are required', { status: 400 });
    }

    const child = await prisma.child.create({
      data: {
        firstName,
        lastName,
        birthDate: new Date(birthDate),
        parentId: parseInt(parentId, 10),
        allergies,
        medicalNote,
      },
    });

    return NextResponse.json(child, { status: 201 });
  } catch (error: any) {
    // Gérer l'erreur de clé étrangère (parentId n'existe pas)
    if (error.code === 'P2003') {
      return new NextResponse('The specified parent does not exist', { status: 400 });
    }
    console.error('[API_CHILDREN_POST]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
