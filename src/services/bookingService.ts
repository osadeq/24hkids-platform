// src/services/bookingService.js
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export class BookingService {
  /**
   * Création d'une réservation. 
   * Note : On utilise 'Prisma.BookingStatus' pour garantir la compatibilité ESM.
   */
  static async createBooking(childId: number, workshopId: number) {
    try {
      return await prisma.booking.create({
        data: { 
          childId, 
          workshopId, 
          status: "CONFIRMED" // On peut utiliser la string directe ou Prisma.BookingStatus.CONFIRMED
        },
      });
    } catch (err: any) {
      throw new Error(`Échec de la création : ${err.message}`);
    }
  }

  static async cancelBooking(bookingId: number) {
    try {
      return await prisma.booking.update({
        where: { id: bookingId },
        data: { status: "CANCELLED" },
      });
    } catch (err: any) {
      throw new Error(`Échec de l'annulation : ${err.message}`);
    }
  }

  static async listBookings(childId?: number) {
    const where = childId ? { childId } : {};
    return prisma.booking.findMany({
      where,
      include: { child: true, workshop: true },
      orderBy: { createdAt: "desc" },
    });
  }

  static async checkAvailability(workshopId: number) {
    const workshop = await prisma.workshop.findUnique({
      where: { id: workshopId },
      include: { 
        bookings: { 
          where: { status: "CONFIRMED" } 
        } 
      },
    });

    if (!workshop) throw new Error("Workshop not found");

    const remaining = workshop.capacity - workshop.bookings.length;
    return { 
      remaining, 
      status: remaining > 0 ? "ACTIVE" : "FULL" 
    };
  }
}