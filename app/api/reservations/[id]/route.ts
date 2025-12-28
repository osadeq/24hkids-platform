// app/api/bookings/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/src/lib/prisma';

// GET /api/bookings/[id] - Récupérer une réservation par son ID
export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const resolvedParams = await context.params;
  const id = parseInt(resolvedParams.id, 10);

  if (isNaN(id)) {
    return new NextResponse('Invalid ID', { status: 400 });
  }

  try {
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        child: true,
        workshop: true,
      },
    });

    if (!booking) {
      return new NextResponse('Booking not found', { status: 404 });
    }

    return NextResponse.json(booking);
  } catch (error) {
    console.error('[API_BOOKING_GET]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// PUT /api/bookings/[id] - Mettre à jour une réservation (ex: changer le statut)
export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const resolvedParams = await context.params;
  const id = parseInt(resolvedParams.id, 10);

  if (isNaN(id)) {
    return new NextResponse('Invalid ID', { status: 400 });
  }

  try {
    const body = await req.json();
    // On ne permet de changer que le statut pour plus de sécurité
    const { status } = body; 

    if (!status) {
        return new NextResponse('Status is required', { status: 400 });
    }

    const booking = await prisma.booking.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(booking);
  } catch (error: any) {
    if (error.code === 'P2025') {
      return new NextResponse('Booking not found', { status: 404 });
    }
    console.error('[API_BOOKING_PUT]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// DELETE /api/bookings/[id] - Supprimer une réservation
export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const resolvedParams = await context.params;
  const id = parseInt(resolvedParams.id, 10);

  if (isNaN(id)) {
    return new NextResponse('Invalid ID', { status: 400 });
  }

  try {
    await prisma.booking.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 }); // 204 No Content
  } catch (error: any) {
    if (error.code === 'P2025') {
      return new NextResponse('Booking not found', { status: 404 });
    }
    console.error('[API_BOOKING_DELETE]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}