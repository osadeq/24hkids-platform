// app/api/workshops/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/src/lib/prisma';

// GET /api/workshops/[id] - Récupérer un atelier par son ID
export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const resolvedParams = await context.params;
  const id = parseInt(resolvedParams.id, 10);

  if (isNaN(id)) {
    return new NextResponse('Invalid ID', { status: 400 });
  }

  try {
    const workshop = await prisma.workshop.findUnique({
      where: { id },
    });

    if (!workshop) {
      return new NextResponse('Workshop not found', { status: 404 });
    }

    return NextResponse.json(workshop);
  } catch (error) {
    console.error('[API_WORKSHOP_GET]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// PUT /api/workshops/[id] - Mettre à jour un atelier
export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const resolvedParams = await context.params;
  const id = parseInt(resolvedParams.id, 10);

  if (isNaN(id)) {
    return new NextResponse('Invalid ID', { status: 400 });
  }

  try {
    const body = await req.json();

    const workshop = await prisma.workshop.update({
      where: { id },
      data: body,
    });

    return NextResponse.json(workshop);
  } catch (error: any) {
    if (error.code === 'P2025') { // Code d'erreur Prisma pour "enregistrement non trouvé"
      return new NextResponse('Workshop not found', { status: 404 });
    }
    console.error('[API_WORKSHOP_PUT]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// DELETE /api/workshops/[id] - Supprimer un atelier
export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const resolvedParams = await context.params;
  const id = parseInt(resolvedParams.id, 10);

  if (isNaN(id)) {
    return new NextResponse('Invalid ID', { status: 400 });
  }

  try {
    await prisma.workshop.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 }); // 204 No Content
  } catch (error: any) {
    if (error.code === 'P2025') { // Code d'erreur Prisma pour "enregistrement non trouvé"
      return new NextResponse('Workshop not found', { status: 404 });
    }
    console.error('[API_WORKSHOP_DELETE]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
