// app/api/parents/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/src/lib/prisma';
import { requireAuth } from '@/src/lib/auth';

// GET /api/parents/[id] - Récupérer un parent par son ID
export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireAuth();
    const resolvedParams = await context.params;
    const id = parseInt(resolvedParams.id, 10);

    if (isNaN(id)) {
      return new NextResponse('Invalid ID', { status: 400 });
    }

    // Check if the session parent is requesting their own data
    if (session.id !== id) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    const parent = await prisma.parent.findUnique({
      where: { id },
      include: {
        children: true, // Inclure les enfants liés
      },
    });

    if (!parent) {
      return new NextResponse('Parent not found', { status: 404 });
    }

    return NextResponse.json(parent);
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    console.error('[API_PARENT_GET]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// PUT /api/parents/[id] - Mettre à jour un parent
export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const resolvedParams = await context.params;
  const id = parseInt(resolvedParams.id, 10);

  if (isNaN(id)) {
    return new NextResponse('Invalid ID', { status: 400 });
  }

  try {
    const body = await req.json();
    const parent = await prisma.parent.update({
      where: { id },
      data: body,
    });

    return NextResponse.json(parent);
  } catch (error: any) {
    if (error.code === 'P2025') {
      return new NextResponse('Parent not found', { status: 404 });
    }
    if (error.code === 'P2002') {
      return new NextResponse('A parent with this email already exists', { status: 409 });
    }
    console.error('[API_PARENT_PUT]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// DELETE /api/parents/[id] - Supprimer un parent
export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const resolvedParams = await context.params;
  const id = parseInt(resolvedParams.id, 10);

  if (isNaN(id)) {
    return new NextResponse('Invalid ID', { status: 400 });
  }

  try {
    // Note : La suppression d'un parent peut échouer s'il a des enfants
    // liés, en fonction de la configuration de votre base de données (ON DELETE CASCADE).
    // Prisma, par défaut, empêche la suppression si des relations existent.
    // Vous devez d'abord supprimer ou dissocier les enfants.
    await prisma.parent.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 }); // 204 No Content
  } catch (error: any) {
    if (error.code === 'P2025') {
      return new NextResponse('Parent not found', { status: 404 });
    }
    // Gère le cas où des enregistrements liés (enfants) empêchent la suppression
    if (error.code === 'P2003') {
        return new NextResponse('Cannot delete parent. Please delete associated children first.', { status: 409 });
    }
    console.error('[API_PARENT_DELETE]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
