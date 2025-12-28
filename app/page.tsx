// app/page.tsx
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 px-4 text-center bg-background">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-foreground mb-6 font-serif">
            24h Kids & Co
          </h1>
          <p className="text-xl text-muted mb-8 max-w-2xl mx-auto">
            Plateforme de gestion des ateliers numériques pour enfants, familles et adultes
            dans le cadre de l'événement <strong>24hKids</strong>
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/workshops"
              className="bg-primary text-foreground px-8 py-3 rounded-full font-semibold hover:bg-primary-hover transition-colors border-2 border-primary"
            >
              Découvrir les ateliers
            </Link>
            <Link
              href="/parent-dashboard"
              className="bg-background text-foreground px-8 py-3 rounded-full font-semibold hover:bg-accent transition-colors border-2 border-foreground"
            >
              Espace Parent
            </Link>
          </div>
        </div>
      </section>

      {/* Event Information */}
      <section className="py-16 px-4 bg-accent">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12 font-serif">
            L'événement 24hKids
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-background rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 border-2 border-foreground">
                <span className="text-2xl">📅</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">Une journée unique</h3>
              <p className="text-muted">
                Ateliers gratuits répartis sur une journée complète
              </p>
            </div>
            <div className="text-center">
              <div className="bg-background rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 border-2 border-foreground">
                <span className="text-2xl">⏰</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">Horaires</h3>
              <p className="text-muted">
                Matin: 10h00 – 12h00<br />
                Après-midi: 13h30 – 17h30
              </p>
            </div>
            <div className="text-center">
              <div className="bg-background rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 border-2 border-foreground">
                <span className="text-2xl">👨‍👩‍👧‍👦</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">Pour tous</h3>
              <p className="text-muted">
                Enfants, familles et adultes
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Target Audiences */}
      <section className="py-16 px-4 bg-background">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12 font-serif">
            Nos ateliers
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-accent p-6 rounded-lg border-2 border-foreground">
              <h3 className="text-xl font-semibold mb-4 text-foreground">
                👶 Enfants (5–13 ans)
              </h3>
              <ul className="text-muted space-y-2">
                <li>• Programmation (Scratch, Ozobot, Lego WeDo)</li>
                <li>• Robotique pédagogique</li>
                <li>• Activités débranchées</li>
                <li>• Sensibilisation au numérique</li>
              </ul>
            </div>
            <div className="bg-accent p-6 rounded-lg border-2 border-foreground">
              <h3 className="text-xl font-semibold mb-4 text-foreground">
                👨‍👩‍👧 Familles (à partir de 7 ans)
              </h3>
              <ul className="text-muted space-y-2">
                <li>• Parentalité numérique</li>
                <li>• Usages des écrans</li>
                <li>• Impact environnemental du numérique</li>
                <li>• Quiz et ateliers intergénérationnels</li>
              </ul>
            </div>
            <div className="bg-accent p-6 rounded-lg border-2 border-foreground">
              <h3 className="text-xl font-semibold mb-4 text-foreground">
                👨‍💻 Ados & adultes
              </h3>
              <ul className="text-muted space-y-2">
                <li>• Programmation avancée (IA, Machine Learning)</li>
                <li>• Arduino, drones</li>
                <li>• Conférences et sensibilisation</li>
                <li>• Découverte des métiers du numérique</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Workshop Durations */}
      <section className="py-16 px-4 bg-accent">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-foreground mb-8 font-serif">
            Durée des ateliers
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-background p-6 rounded-lg border-2 border-foreground">
              <h3 className="text-lg font-semibold mb-2 text-foreground">Ateliers courts</h3>
              <p className="text-2xl font-bold text-foreground">~30 min</p>
            </div>
            <div className="bg-background p-6 rounded-lg border-2 border-foreground">
              <h3 className="text-lg font-semibold mb-2 text-foreground">Ateliers moyens</h3>
              <p className="text-2xl font-bold text-foreground">35–40 min</p>
            </div>
            <div className="bg-background p-6 rounded-lg border-2 border-foreground">
              <h3 className="text-lg font-semibold mb-2 text-foreground">Ateliers longs</h3>
              <p className="text-2xl font-bold text-foreground">45–50 min</p>
            </div>
          </div>
          <p className="text-muted mt-6">
            Chaque atelier correspond à une session unique, réservable indépendamment.
          </p>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 bg-primary text-foreground text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 font-serif">
            Prêt à réserver ?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Créez votre compte parent et réservez les ateliers pour vos enfants.
            Réservation enfant par enfant, expérience fluide garantie !
          </p>
          <Link
            href="/parent-dashboard"
            className="bg-background text-foreground px-8 py-3 rounded-full font-semibold hover:bg-accent transition-colors inline-block border-2 border-foreground"
          >
            Commencer maintenant
          </Link>
        </div>
      </section>
    </div>
  );
}
