// app/api/bookings/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/src/lib/prisma';
import { BookingStatus } from '@prisma/client';
import { differenceInYears } from 'date-fns';

// GET /api/bookings - Récupérer toutes les réservations ou filtrer par workshopId
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const workshopId = searchParams.get('workshopId');

    const whereClause = workshopId ? {
      workshopId: parseInt(workshopId, 10)
    } : {};

    const bookings = await prisma.booking.findMany({
      where: whereClause,
      include: {
        child: true,
        workshop: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(bookings);
  } catch (error) {
    console.error('[API_BOOKINGS_GET]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// POST /api/bookings - Créer une nouvelle réservation
export async function POST(req: Request) {
  const body = await req.json();
  const { childId, workshopId, status } = body;

  if (!childId || !workshopId) {
    return new NextResponse('childId and workshopId are required', { status: 400 });
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      // 1. Récupérer les données nécessaires (atelier, enfant et ses réservations existantes)
      const workshop = await tx.workshop.findUnique({
        where: { id: parseInt(workshopId, 10) },
      });
      if (!workshop) throw new Error('Workshop not found');

      const child = await tx.child.findUnique({
        where: { id: parseInt(childId, 10) },
        include: {
          bookings: {
            where: { status: { not: 'CANCELLED' } }, // On ne vérifie que les réservations actives ou en attente
            include: { workshop: true },
          },
        },
      });
      if (!child) throw new Error('Child not found');

      // 2. [Règle métier] Vérification de la tranche d'âge
      const ageAtWorkshopStart = differenceInYears(workshop.startTime, child.birthDate);
      if (ageAtWorkshopStart < workshop.minAge || ageAtWorkshopStart > workshop.maxAge) {
        throw new Error(`Child's age (${ageAtWorkshopStart}) is not within the workshop's required age range (${workshop.minAge}-${workshop.maxAge}).`);
      }

      // 3. [Règle métier] Vérification du chevauchement horaire
      const hasOverlap = child.bookings.some(existingBooking => {
        const existingStartTime = existingBooking.workshop.startTime;
        const existingEndTime = existingBooking.workshop.endTime;
        // La nouvelle réservation empiète-t-elle sur une réservation existante ? (StartA < EndB) and (EndA > StartB)
        return workshop.startTime < existingEndTime && workshop.endTime > existingStartTime;
      });
      if (hasOverlap) {
        throw new Error('This booking overlaps with an existing booking for the child.');
      }

      // 4. [Règle métier] Vérification de la capacité
      const confirmedBookingsCount = await tx.booking.count({
        where: { workshopId: parseInt(workshopId, 10), status: 'CONFIRMED' },
      });
      
      let finalStatus: BookingStatus = status || 'CONFIRMED';
      if (finalStatus === 'CONFIRMED' && confirmedBookingsCount >= workshop.capacity) {
        finalStatus = 'WAITLIST'; // Automatiquement mettre en liste d'attente si l'atelier est plein
      }

      // 5. Création de la réservation
      const booking = await tx.booking.create({
        data: {
          childId: parseInt(childId, 10),
          workshopId: parseInt(workshopId, 10),
          status: finalStatus,
        },
      });

      return booking;
    });

    const responseStatus = result.status === 'WAITLIST' ? 200 : 201;
    return NextResponse.json(result, { status: responseStatus });

  } catch (error: any) {
    // Gérer les erreurs de contraintes Prisma
    if (error.code === 'P2002') {
      return new NextResponse('Cet enfant est déjà inscrit à cet atelier', { status: 409 });
    }
    if (error.code === 'P2003') {
      return new NextResponse('L\'enfant ou l\'atelier spécifié n\'existe pas', { status: 400 });
    }
    // Gérer les erreurs métier lancées manuellement depuis la transaction
    if (error.message.includes('age range')) {
        return new NextResponse(`L'âge de l'enfant (${error.message.match(/Child's age \((\d+)\)/)?.[1]}) ne correspond pas à la tranche d'âge requise (${error.message.match(/age range \((\d+)-(\d+)\)/)?.[1]}-${error.message.match(/age range \((\d+)-(\d+)\)/)?.[2]})`, { status: 409 });
    }
    if (error.message.includes('overlaps')) {
        return new NextResponse('Cette réservation chevauche une réservation existante pour cet enfant', { status: 409 });
    }
    if (error.message.includes('not found')) {
      return new NextResponse(error.message, { status: 404 });
    }

    console.error('[API_BOOKINGS_POST]', error);
    return new NextResponse('Erreur interne du serveur', { status: 500 });
  }
}
