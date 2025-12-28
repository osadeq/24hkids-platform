// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/src/lib/prisma';
import { verifyPassword, createSessionResponse } from '@/src/lib/auth';

export async function POST(request: NextRequest) {
  console.log('🔐 [LOGIN] Début de la requête de connexion');

  try {
    const body = await request.json();
    const { email, password } = body;

    console.log('📧 [LOGIN] Email reçu:', email);
    console.log('🔑 [LOGIN] Mot de passe fourni (longueur):', password ? password.length : 'null');

    if (!email || !password) {
      console.log('❌ [LOGIN] Email ou mot de passe manquant');
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    console.log('🔍 [LOGIN] Recherche du parent dans la base de données...');
    const parent = await prisma.parent.findUnique({
      where: { email },
    });

    console.log('👤 [LOGIN] Parent trouvé:', parent ? `ID: ${parent.id}, Nom: ${parent.firstName} ${parent.lastName}` : 'AUCUN PARENT TROUVÉ');

    if (!parent) {
      console.log('❌ [LOGIN] Aucun parent trouvé avec cet email');
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    console.log('🔐 [LOGIN] Vérification du mot de passe...');
   
    if (!parent.password) {
      console.log('❌ [LOGIN] Mot de passe manquant en base');
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    } 
    
    console.log('🔐 [LOGIN] Hash en base:', parent.password.substring(0, 20) + '...');

    const isValidPassword = await verifyPassword(password, parent.password);
    console.log('🔐 [LOGIN] Mot de passe valide:', isValidPassword);

    if (!isValidPassword) {
      console.log('❌ [LOGIN] Mot de passe invalide');
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    console.log('✅ [LOGIN] Authentification réussie, création de la session...');
    const response = await createSessionResponse({
      id: parent.id,
      email: parent.email,
      firstName: parent.firstName,
      lastName: parent.lastName,
    });

    console.log('🎉 [LOGIN] Session créée avec succès pour:', parent.firstName, parent.lastName);
    return response;

  } catch (error) {
    console.error('💥 [LOGIN] Erreur lors de la connexion:', error);
    console.error('💥 [LOGIN] Stack trace:', error instanceof Error ? error.stack : 'No stack trace');
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}