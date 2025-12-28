import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import prisma from './prisma';

const SESSION_COOKIE = 'parent_session';

export interface ParentSession {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createSessionResponse(parent: { id: number; email: string; firstName: string; lastName: string }): Promise<NextResponse> {
  console.log('🍪 [SESSION] Création de la session pour:', parent.firstName, parent.lastName);

  const sessionData = JSON.stringify(parent);
  console.log('🍪 [SESSION] Données de session (longueur):', sessionData.length);

  const response = NextResponse.json({ success: true });
  console.log('🍪 [SESSION] Response créée');

  response.cookies.set(SESSION_COOKIE, sessionData, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  console.log('🍪 [SESSION] Cookie défini avec succès');
  return response;
}

export async function getSession(): Promise<ParentSession | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE);
  if (!sessionCookie) return null;

  try {
    return JSON.parse(sessionCookie.value);
  } catch {
    return null;
  }
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function destroySessionResponse(): Promise<NextResponse> {
  const response = NextResponse.json({ success: true });
  response.cookies.delete(SESSION_COOKIE);
  return response;
}

export async function requireAuth(): Promise<ParentSession> {
  const session = await getSession();
  if (!session) {
    throw new Error('Unauthorized');
  }
  return session;
}