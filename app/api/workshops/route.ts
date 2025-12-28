// app/api/workshops/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/src/lib/prisma';
import { WorkshopStatus } from '@prisma/client';

// GET /api/workshops - Récupérer tous les ateliers avec filtres
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const dateParam = searchParams.get('date');
    const minAgeParam = searchParams.get('minAge');
    const maxAgeParam = searchParams.get('maxAge');
    const themeParam = searchParams.get('theme');

    const where: any = {};

    // Filtrer par date
    if (dateParam) {
      const startOfDay = new Date(dateParam);
      startOfDay.setUTCHours(0, 0, 0, 0); // Début du jour en UTC

      const endOfDay = new Date(dateParam);
      endOfDay.setUTCHours(23, 59, 59, 999); // Fin du jour en UTC

      where.startTime = {
        gte: startOfDay,
        lte: endOfDay,
      };
    }

    // Filtrer par âge minimum
    if (minAgeParam) {
      const minAge = parseInt(minAgeParam, 10);
      if (!isNaN(minAge)) {
        where.minAge = { gte: minAge };
      }
    }

    // Filtrer par âge maximum
    if (maxAgeParam) {
      const maxAge = parseInt(maxAgeParam, 10);
      if (!isNaN(maxAge)) {
        where.maxAge = { lte: maxAge };
      }
    }

    // Filtrer par thème (recherche dans le nom ou la description)
    if (themeParam) {
      where.OR = [
        { name: { contains: themeParam, mode: 'insensitive' } },
        { description: { contains: themeParam, mode: 'insensitive' } },
      ];
    }

    const workshops = await prisma.workshop.findMany({
      where,
      orderBy: {
        startTime: 'asc',
      },
    });
    return NextResponse.json(workshops);
  } catch (error) {
    console.error('[API_WORKSHOPS_GET]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// POST /api/workshops - Créer un nouvel atelier
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
        name, 
        description, 
        startTime, 
        endTime, 
        minAge, 
        maxAge, 
        capacity,
        location,
        status 
    } = body;

    // Validation simple
    if (!name || !startTime || !endTime || !minAge || !maxAge || !capacity) {
        return new NextResponse('Missing required fields', { status: 400 });
    }

    const workshop = await prisma.workshop.create({
      data: {
        name,
        description,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        minAge: parseInt(minAge, 10),
        maxAge: parseInt(maxAge, 10),
        capacity: parseInt(capacity, 10),
        location,
        status: status as WorkshopStatus, // Assurez-vous que le statut est valide
      },
    });

    return NextResponse.json(workshop, { status: 201 });
  } catch (error) {
    console.error('[API_WORKSHOPS_POST]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
