'use client';

import React, { useState, useEffect } from 'react';
import { fetcher, sendRequest } from '@/src/lib/api';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Child {
  id: number;
  firstName: string;
  lastName: string;
  birthDate: string;
  allergies?: string;
  medicalNote?: string;
}

interface ParentChildrenPageProps {
  params: Promise<{ parentId: string }>;
}

export default function ParentChildrenPage({ params }: ParentChildrenPageProps) {
  const { parentId } = React.use(params);
  const router = useRouter();

  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadChildren = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch the parent to get their children (API includes children)
        const parentData = await fetcher<{ children: Child[] }>(`/api/parents/${parentId}`);
        setChildren(parentData.children);
      } catch (e: any) {
        console.error('Failed to load children:', e);
        setError(e.data?.message || e.message || 'Une erreur est survenue lors du chargement des enfants.');
      } finally {
        setLoading(false);
      }
    };
    loadChildren();
  }, [parentId]);

  const handleDeleteChild = async (childId: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet enfant ? Cela annulera toutes ses réservations.')) {
      return;
    }

    try {
      await sendRequest(`/api/children/${childId}`, 'DELETE');
      setChildren(children.filter(child => child.id !== childId));
    } catch (e: any) {
      console.error('Failed to delete child:', e);
      setError(e.data?.message || e.message || 'Une erreur est survenue lors de la suppression de l\'enfant.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-center text-primary text-lg">Chargement des enfants...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-destructive/10 border-2 border-destructive text-destructive px-4 py-3 rounded-lg text-center" role="alert">
            <strong className="font-bold">Erreur : </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <section className="py-12 px-4 text-center bg-background">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-foreground mb-6 font-serif">
            Gestion des Enfants
          </h1>
          <p className="text-xl text-muted mb-8 max-w-2xl mx-auto">
            Gérez les profils de vos enfants pour les ateliers 24hKids
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-8 px-4 bg-accent">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-foreground font-serif">Mes Enfants</h2>
            <Link href={`/parent-dashboard/${parentId}/children/add`} className="bg-primary text-foreground px-6 py-3 rounded-full font-semibold hover:bg-primary-hover transition-colors">
              Ajouter un enfant
            </Link>
          </div>

          {children.length === 0 ? (
            <div className="bg-background border-2 border-foreground rounded-lg p-8 text-center">
              <p className="text-muted">Vous n'avez pas encore d'enfants enregistrés.</p>
            </div>
          ) : (
            <div className="bg-background rounded-lg border-2 border-foreground overflow-hidden">
              <table className="min-w-full divide-y divide-foreground/20">
                <thead className="bg-accent">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">Nom Prénom</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">Date de naissance</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">Allergies</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">Notes Médicales</th>
                    <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                  </tr>
                </thead>
                <tbody className="bg-background divide-y divide-foreground/20">
                  {children.map((child) => (
                    <tr key={child.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">{child.firstName} {child.lastName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted">{new Date(child.birthDate).toLocaleDateString('fr-FR')}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted">{child.allergies || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted">{child.medicalNote || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link href={`/parent-dashboard/${parentId}/children/${child.id}/edit`} className="text-primary hover:text-primary-hover mr-4 transition-colors">
                          Modifier
                        </Link>
                        <button onClick={() => handleDeleteChild(child.id)} className="text-destructive hover:text-destructive/80 transition-colors">
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}