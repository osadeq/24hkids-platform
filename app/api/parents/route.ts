// app/api/parents/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/src/lib/prisma';

// GET /api/parents - Récupérer tous les parents
export async function GET() {
  try {
    const parents = await prisma.parent.findMany({
      include: {
        children: true, // Inclure les enfants liés
      },
      orderBy: {
        lastName: 'asc',
      },
    });
    return NextResponse.json(parents);
  } catch (error) {
    console.error('[API_PARENTS_GET]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// POST /api/parents - Créer un nouveau parent
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { firstName, lastName, email, phone, notifyEmail, notifySMS } = body;

    // Validation
    if (!firstName || !lastName || !email) {
      return new NextResponse('First name, last name, and email are required', { status: 400 });
    }

    const parent = await prisma.parent.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        notifyEmail,
        notifySMS,
      },
    });

    return NextResponse.json(parent, { status: 201 });
  } catch (error: any) {
    // Gérer la contrainte d'unicité de l'email
    if (error.code === 'P2002') {
      return new NextResponse('A parent with this email already exists', { status: 409 }); // 409 Conflict
    }
    console.error('[API_PARENTS_POST]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
