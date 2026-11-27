import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Sparkles, MapPin, Check } from "lucide-react";
import { company, published, showProfessionalServices } from "@/lib/company";
import { services, generalFaq, isProfessionalService } from "@/lib/content";
export function Brand() {
  return (
    <Link href="/" className="brand">
      <span className="brand-symbol" aria-hidden="true">
        ✧
      </span>
      <span>
        ÉCLANORA<small>L’ART DU PROPRE</small>
      </span>
    </Link>
  );
}
export function Header() {
  return (
    <>
      <div className="topline">
        <span>SAINT-GERMAIN-EN-LAYE & ENVIRONS</span>
        <span>
          {showProfessionalServices
            ? "Particuliers · Professionnels · Copropriétés"
            : "Ménage à domicile"}
        </span>
      </div>
      <header className="header">
        <Brand />
        <nav className="desktop-nav" aria-label="Navigation principale">
          <Link href="/services/">Nos prestations</Link>
          <Link href="/a-propos/">L’esprit Éclanora</Link>
          <Link href="/zones-intervention/">Nos secteurs</Link>
          <Link href="/conseils/">Le journal</Link>
        </nav>
        <Link className="button header-cta" href="/devis/">
          Demander un devis <ArrowUpRight size={16} />
        </Link>
        <details className="mobile-nav">
          <summary>Menu</summary>
          <nav aria-label="Navigation mobile">
            <Link href="/services/">Nos prestations</Link>
            <Link href="/a-propos/">L’esprit Éclanora</Link>
            <Link href="/zones-intervention/">Nos secteurs</Link>
            <Link href="/conseils/">Le journal</Link>
            <Link href="/devis/">Demander un devis</Link>
            <Link href="/contact/">Contact</Link>
          </nav>
        </details>
      </header>
      {!published && (
        <div className="preview-note">
          Version de validation · Envoi réel indisponible sans configuration de
          la messagerie.
        </div>
      )}
    </>
  );
}
export function Footer() {
  return (
    <footer>
      <div className="footer-main">
        <div>
          <Brand />
          <p>
            Le soin des lieux.
            <br />
            Le sens du détail.
          </p>
          <span className="footer-location">
            <MapPin size={15} /> Saint-Germain-en-Laye · Yvelines
          </span>
        </div>
        <div>
          <h3>Nos prestations</h3>
          {services
            .filter(
              ({ slug }) =>
                showProfessionalServices || !isProfessionalService(slug),
            )
            .map((s) => (
              <Link key={s.slug} href={`/${s.slug}/`}>
                {s.title}
              </Link>
            ))}
        </div>
        <div>
          <h3>La maison Éclanora</h3>
          {[
            ["a-propos", "À propos"],
            ["tarifs", "Nos tarifs"],
            ["zones-intervention", "Zones d’intervention"],
            ["services-a-la-personne", "Services à la personne"],
            ["faq", "Questions fréquentes"],
            ["conseils", "Le journal"],
            ["contact", "Nous contacter"],
          ].map(([s, t]) => (
            <Link key={s} href={`/${s}/`}>
              {t}
            </Link>
          ))}
        </div>
        <div className="footer-invite">
          <h3>Un besoin, une question ?</h3>
          <p>Échangeons sur les besoins de votre lieu.</p>
          <Link href="/devis/" className="text-link">
            Demander un devis <ArrowUpRight size={16} />
          </Link>
          {company.phone && (
            <a href={`tel:${company.phone}`}>{company.phone}</a>
          )}
          {company.email && (
            <a href={`mailto:${company.email}`}>{company.email}</a>
          )}
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} ÉCLANORA · EI</span>
        <div>
          {[
            ["mentions-legales", "Mentions légales"],
            ["politique-confidentialite", "Confidentialité"],
            ["cookies", "Gérer mes cookies"],
            ["cgv", "CGV"],
            ["accessibilite", "Accessibilité"],
          ].map(([s, t]) => (
            <Link key={s} href={`/${s}/`}>
              {t}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
export function Faq({ items = generalFaq }: { items?: [string, string][] }) {
  return (
    <div className="faq-list">
      {items.map(([q, a]) => (
        <details key={q}>
          <summary>
            {q}
            <span aria-hidden="true">+</span>
          </summary>
          <p>{a}</p>
        </details>
      ))}
    </div>
  );
}
export function Cta() {
  return (
    <section className="cta-band">
      <span className="eyebrow">CHAQUE LIEU MÉRITE SON ATTENTION</span>
      <h2>
        Et si nous prenions
        <br />
        <em>soin du vôtre ?</em>
      </h2>
      <p>
        Parlez-nous de votre espace. Nous construirons une proposition adaptée.
      </p>
      <Link href="/devis/" className="button button-light">
        Demander mon devis gratuit <ArrowUpRight size={17} />
      </Link>
      <small>Sans engagement · Aucun paiement en ligne</small>
    </section>
  );
}
export function ServiceCards() {
  return (
    <div className="service-grid">
      {[
        {
          i: 0,
          image: "/images/interior.webp",
          label: "01 / POUR VOTRE INTÉRIEUR",
        },
        {
          i: 3,
          image: "/images/office.webp",
          label: "02 / POUR VOTRE ACTIVITÉ",
        },
        {
          i: 4,
          image: "/images/staircase.webp",
          label: "03 / POUR VOTRE IMMEUBLE",
        },
      ]
        .filter(({ i }) => showProfessionalServices || i === 0)
        .map(({ i, image, label }) => (
          <Link href={`/${services[i].slug}/`} className="service-card" key={i}>
            <div className="card-photo">
              <Image
                src={image}
                alt=""
                fill
                sizes="(max-width: 760px) 86vw, 29vw"
              />
            </div>
            <div className="service-card-content">
              <span className="eyebrow">{label}</span>
              <h3>
                {
                  [
                    "Maisons & appartements",
                    "Bureaux & entreprises",
                    "Copropriétés & syndics",
                  ][i === 0 ? 0 : i === 3 ? 1 : 2]
                }
              </h3>
              <p>{services[i].short}</p>
              <span className="card-arrow">
                <ArrowUpRight size={20} />
              </span>
            </div>
          </Link>
        ))}
    </div>
  );
}
export function Steps() {
  return (
    <div className="steps">
      {[
        [
          "01",
          "Vous nous racontez",
          "Votre espace, vos habitudes, vos attentes. Nous prenons le temps de comprendre.",
        ],
        [
          "02",
          "Nous définissons ensemble",
          "Un périmètre clair, une fréquence adaptée et un devis personnalisé gratuit.",
        ],
        [
          "03",
          "Nous prenons soin des lieux",
          "Une intervention selon le cadre convenu, avec attention aux détails.",
        ],
      ].map(([n, t, p]) => (
        <div key={n}>
          <span className="step-number">{n}</span>
          <h3>{t}</h3>
          <p>{p}</p>
        </div>
      ))}
    </div>
  );
}
export function Commitments() {
  return (
    <div className="commitments">
      {[
        [
          Sparkles,
          "Le sens du détail",
          "Une attention portée aux finitions et aux particularités de vos espaces.",
        ],
        [
          Check,
          "La clarté des engagements",
          "Des prestations et un périmètre définis ensemble, avant de commencer.",
        ],
        [
          MapPin,
          "Un service de proximité",
          "Une entreprise ancrée à Saint-Germain-en-Laye, à l’écoute de vos besoins.",
        ],
      ].map(([Icon, t, p]) => {
        const I = Icon as typeof Check;
        return (
          <div key={String(t)}>
            <I size={25} strokeWidth={1} />
            <h3>{String(t)}</h3>
            <p>{String(p)}</p>
          </div>
        );
      })}
    </div>
  );
}
export function Breadcrumb({
  title,
  parent,
}: {
  title: string;
  parent?: { title: string; href: string };
}) {
  return (
    <nav className="breadcrumb" aria-label="Fil d’Ariane">
      <Link href="/">Accueil</Link>
      <span>/</span>
      {parent && (
        <>
          <Link href={parent.href}>{parent.title}</Link>
          <span>/</span>
        </>
      )}
      <span aria-current="page">{title}</span>
    </nav>
  );
}
export function Intro({
  tag,
  title,
  lead,
}: {
  tag: string;
  title: string;
  lead: string;
}) {
  return (
    <section className="page-intro">
      <span className="eyebrow">{tag}</span>
      <h1>{title}</h1>
      <p>{lead}</p>
    </section>
  );
}
