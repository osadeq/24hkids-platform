This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# 🎒 2+4H Kids & Co — Plateforme de gestion des ateliers

## 🧭 Vision du projet

**2+4H Kids & Co** est une application web destinée à gérer une journée d’ateliers numériques
pour enfants, familles et adultes, dans le cadre de l’événement **24hKids**.

L’objectif est de proposer :

* une **expérience fluide pour les parents** (réservation enfant par enfant),
* une **gestion simple pour les administrateurs**,
* un système **fiable, robuste et orienté règles métier**.

Le projet privilégie la **simplicité**, la **lisibilité** et la **pérennité technique**.

---

## 🗓️ Contexte événementiel

* Événement sur **une journée unique**
* Horaires généraux :

  * **Matin** : 10h00 – 12h00
  * **Après-midi** : 13h30 – 17h30
* Ateliers répartis sur des **créneaux fixes**
* Ateliers **gratuits**, sans prérequis

---

## 👥 Publics concernés

### Enfants (5–13 ans)

* Programmation (Scratch, Ozobot, Lego WeDo)
* Robotique pédagogique
* Activités débranchées
* Sensibilisation au numérique (info/intox, cyberharcèlement, réseaux sociaux)

### Familles (à partir de 7 ans)

* Parentalité numérique
* Usages des écrans
* Impact environnemental du numérique
* Quiz et ateliers intergénérationnels

### Ados & adultes

* Programmation avancée (IA, Machine Learning, Arduino, drones)
* Conférences et ateliers de sensibilisation
* Découverte des métiers du numérique

---

## ⏱️ Durée des ateliers

* **Ateliers courts** : ~30 minutes
* **Ateliers moyens** : 35–40 minutes
* **Ateliers longs** : 45–50 minutes

Chaque atelier correspond à **une session unique**, réservable indépendamment.

---

## 🧩 Fonctionnalités principales

### Interface publique

* Présentation du concept
* Informations sur l’édition en cours
* Catalogue et calendrier des ateliers
* Filtres :

  * par date
  * par tranche d’âge
  * par thème
  * par enfant (si parent connecté)

---

### Comptes & rôles

#### Parent

* Création de compte
* Gestion des enfants (ajout / modification / suppression)
* Réservation des ateliers
* Consultation des réservations
* Annulation (option configurable)

#### Administrateur

* Gestion des ateliers (CRUD)
* Gestion des familles et enfants
* Modification des informations de l’événement
* Export des participants par atelier (CSV / Excel)

---

## 🧠 Règles métier (non négociables)

### Ateliers

* Un atelier possède :

  * un thème
  * une tranche d’âge
  * une capacité
  * un créneau horaire précis
* Les ateliers sont automatiquement visibles dans le calendrier public

### Réservations

* Un parent doit être connecté
* Une réservation est faite **pour un enfant précis**
* Contraintes :

  * tranche d’âge respectée
  * capacité disponible
  * **aucun chevauchement horaire pour un même enfant**
* Un parent peut réserver pour plusieurs enfants

👉 Toutes les règles sont **validées côté serveur**, jamais uniquement côté front.

---

## 🗄️ Modèle de données (conceptuel)

* **User** (Parent / Admin)
* **Child** (lié à un parent)
* **Workshop** (session d’atelier)
* **Reservation** (enfant ↔ atelier)
* **EventInfo** (date, lieu, horaires globaux)

---

## 🛠️ Stack technique (prévue)

* **Next.js** (App Router)
* **TypeScript**
* **Prisma**
* **PostgreSQL**
* **Auth.js** (email / mot de passe)
* **Tailwind CSS**

---

## 🚀 Philosophie de développement

* Métier d’abord, UI ensuite
* Backend robuste avant le front
* Règles métier centralisées
* Pas de sur-ingénierie
* Chaque étape validée avant la suivante

---

## 📍 Périmètre V1

✔️ Interface publique
✔️ Comptes parents
✔️ Réservation d’ateliers
✔️ Administration basique

❌ Pas de paiement
❌ Pas de multi-événements

---

## 📌 État du projet

> 📘 **Phase actuelle** : cadrage & fondations
> 🧱 Prochaine étape : définition du schéma Prisma

---

© 24hKids — Projet éducatif autour du numérique
