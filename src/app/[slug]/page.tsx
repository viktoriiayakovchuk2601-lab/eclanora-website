import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, Check, MapPin } from "lucide-react";
import {
  Breadcrumb,
  Commitments,
  Cta,
  Faq,
  Intro,
  Steps,
} from "@/components/site";
import { QuoteForm } from "@/components/quote-form";
import { PriceEstimator } from "@/components/price-estimator";
import {
  services as serviceCatalog,
  articles,
  generalFaq,
  isProfessionalService,
  localPages,
} from "@/lib/content";
import { legalPages } from "@/lib/legal";
import {
  company,
  published,
  sapAvailable,
  showProfessionalServices,
  siteUrl,
} from "@/lib/company";
const services = serviceCatalog.filter(
  ({ slug }) => showProfessionalServices || !isProfessionalService(slug),
);
const places = localPages.filter(({ city }) =>
  company.confirmedZones.includes(city),
);
const pages: Record<string, { title: string; lead: string }> = {
  ...Object.fromEntries(
    places.map(({ slug, city, postalCode }) => [
      slug,
      {
        title: `Ménage à domicile à ${city}`,
        lead: `Nettoyage ponctuel ou régulier de maisons et d’appartements à ${city} (${postalCode}), sur devis.`,
      },
    ]),
  ),
  services: {
    title: "Nos services de nettoyage",
    lead: "Découvrez les prestations et leur périmètre avant de demander un devis personnalisé.",
  },
  "a-propos": {
    title: "Le soin des lieux. Le sens du détail.",
    lead: "Éclanora, une approche attentive du nettoyage à Saint-Germain-en-Laye.",
  },
  tarifs: {
    title: "Un prix clair. Un service à votre mesure.",
    lead: "Chaque espace a ses particularités. Votre devis les prend en compte.",
  },
  "zones-intervention": {
    title: "Un service de proximité, dans les Yvelines.",
    lead: "Éclanora est basée à Saint-Germain-en-Laye, 78100.",
  },
  "services-a-la-personne": {
    title: "Services à la personne : comprendre les conditions.",
    lead: "Une information transparente sur la déclaration SAP et les avantages fiscaux éventuels.",
  },
  devis: {
    title: "Parlons de votre espace.",
    lead: "Quelques informations pour mieux comprendre votre besoin et préparer un devis gratuit, sans engagement.",
  },
  contact: {
    title: "Tout commence par un échange.",
    lead: "Une question sur une prestation ou un besoin particulier ? Prenons le temps d’en parler.",
  },
  faq: {
    title: "Vos questions, en toute clarté.",
    lead: "L’essentiel pour préparer votre intervention et comprendre notre approche.",
  },
  conseils: {
    title: "Le journal des lieux soignés.",
    lead: "Des repères concrets pour entretenir, organiser et mieux comprendre les services de nettoyage.",
  },
};
export function generateStaticParams() {
  return [
    ...services.map((s) => s.slug),
    ...Object.keys(pages),
    ...Object.keys(legalPages),
  ].map((slug) => ({ slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const s = services.find((s) => s.slug === slug);
  const p = pages[slug] || legalPages[slug];
  return {
    title: s
      ? `${s.title} à Saint-Germain-en-Laye`
      : p?.title || "Page introuvable",
    description: s ? s.intro.slice(0, 160) : p?.lead,
    alternates: { canonical: `/${slug}/` },
    openGraph: {
      title: s?.title || p?.title,
      description: s?.short || p?.lead,
      url: `/${slug}/`,
    },
  };
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const s = services.find((s) => s.slug === slug);
  const p = pages[slug] || legalPages[slug];
  if (!s && !p) notFound();
  const title = s?.title || p.title;
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: siteUrl },
      {
        "@type": "ListItem",
        position: 2,
        name: title,
        item: `${siteUrl}/${slug}/`,
      },
    ],
  };
  return (
    <>
      <div className="content-shell">
        <Breadcrumb title={title} />
        {s ? (
          <>
            <Intro
              tag={`${s.audience.toUpperCase()} · SAINT-GERMAIN-EN-LAYE`}
              title={s.title}
              lead={s.intro}
            />
            <div className="service-detail">
              <div>
                <h2>
                  Un périmètre défini
                  <br />
                  <em>avec vous.</em>
                </h2>
                <p>{s.benefit}</p>
                <h3>Ce que nous pouvons prévoir</h3>
                <ul className="check-list">
                  {s.included.map((t) => (
                    <li key={t}>
                      <Check size={17} />
                      {t}
                    </li>
                  ))}
                </ul>
                <h3>Ce qui n’est pas inclus</h3>
                <ul>
                  {s.excluded.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>
              <aside className="quote-aside">
                <span className="eyebrow">UNE PROPOSITION PERSONNALISÉE</span>
                <h3>
                  Votre espace.
                  <br />
                  Vos priorités.
                </h3>
                <p>
                  Surface, fréquence, matériaux : le devis précise les tâches et
                  les conditions avant votre engagement.
                </p>
                <Link href="/devis/" className="button">
                  Demander un devis <ArrowUpRight size={16} />
                </Link>
                <p className="small">
                  Saint-Germain-en-Laye. Autres communes : faisabilité à
                  confirmer.
                </p>
                <Link href="/tarifs/">Comprendre nos tarifs</Link>
              </aside>
            </div>
            <section className="inner-section">
              <h2>
                Comment se déroule
                <br />
                <em>une intervention ?</em>
              </h2>
              <Steps />
            </section>
            <section className="inner-section">
              <h2>Vos questions sur cette prestation</h2>
              <Faq items={s.faq} />
            </section>
            <section className="inner-section">
              <h2>Pour aller plus loin</h2>
              <div className="related-links">
                {services
                  .filter((x) => x.slug !== slug)
                  .map((x) => (
                    <Link key={x.slug} href={`/${x.slug}/`}>
                      {x.title}
                      <ArrowUpRight size={16} />
                    </Link>
                  ))}
              </div>
            </section>
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "Service",
                  name: s.title,
                  serviceType: s.title,
                  provider: { "@type": "Organization", name: company.name },
                  areaServed: company.confirmedZones,
                  url: `${siteUrl}/${slug}/`,
                }),
              }}
            />
          </>
        ) : (
          <>
            <Intro
              tag={
                legalPages[slug]
                  ? "INFORMATIONS & TRANSPARENCE"
                  : "LA MAISON ÉCLANORA"
              }
              title={p.title}
              lead={p.lead}
            />
            {slug === "services" && (
              <div className="prose">
                <h2>Choisir une prestation</h2>
                <ul>
                  {services.map((service) => (
                    <li key={service.slug}>
                      <Link href={`/${service.slug}/`}>{service.title}</Link>
                      <p>{service.short}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {slug === "devis" && (
              <div className="quote-layout">
                <aside>
                  <span className="eyebrow">À VOTRE ÉCOUTE</span>
                  <h2>
                    Le premier pas
                    <br />
                    <em>vers plus de sérénité.</em>
                  </h2>
                  <p>
                    Votre demande nous permet d’évaluer les tâches, la fréquence
                    et les contraintes de votre espace.
                  </p>
                  <ul className="check-list">
                    <li>
                      <Check size={16} />
                      Devis personnalisé gratuit
                    </li>
                    <li>
                      <Check size={16} />
                      Aucun engagement en ligne
                    </li>
                    <li>
                      <Check size={16} />
                      Aucun paiement à cette étape
                    </li>
                  </ul>
                  <p className="small">
                    N’indiquez ni codes d’accès, ni informations sensibles.
                    Votre téléphone est facultatif.
                  </p>
                </aside>
                <QuoteForm professional={showProfessionalServices} />
              </div>
            )}
            {slug === "a-propos" && (
              <>
                <div className="prose">
                  <h2>Une idée simple : prendre soin.</h2>
                  <p>
                    Un intérieur accueillant ne se résume pas à des surfaces
                    propres. Il se reconnaît à l’attention portée aux détails,
                    au respect des matières et au sentiment de tranquillité
                    qu’il procure.
                  </p>
                  <p>
                    Avec Éclanora, l’entretien commence par l’écoute. Nous
                    cherchons à comprendre vos usages et vos priorités pour
                    définir une intervention cohérente, à domicile comme dans
                    les espaces professionnels.
                  </p>
                  <h2>Une entreprise ancrée localement</h2>
                  <p>
                    Basée à Saint-Germain-en-Laye, Éclanora exerce sous le
                    statut d’entrepreneur individuel. Notre engagement se
                    traduit par un périmètre de prestation écrit, des échanges
                    directs et une attention à votre cadre de vie ou de travail.
                  </p>
                  <p>
                    Les photographies du site illustrent notre univers ; elles
                    ne sont pas présentées comme des réalisations clients.
                  </p>
                </div>
                <Commitments />
              </>
            )}
            {slug === "tarifs" && (
              <div className="prose">
                <h2>Des prestations sur devis</h2>
                <p>
                  Le prix dépend de la surface, de l’état des lieux, de la
                  fréquence, des matériaux et des tâches retenues. Les
                  fournitures et frais éventuels sont précisés avant accord.
                </p>
                {company.rateConfirmed ? (
                  <p>
                    Tarif de référence particuliers : {company.hourlyRate}{" "}
                    €/heure. Le devis précise les conditions et le total
                    applicable.
                  </p>
                ) : (
                  <p>
                    Le tarif horaire de référence n’est pas encore confirmé. Le
                    prix sera précisé dans le devis.
                  </p>
                )}
                {(company.rateConfirmed || !published) && (
                  <PriceEstimator
                    rate={company.hourlyRate}
                    sap={company.rateConfirmed && sapAvailable}
                    preview={!company.rateConfirmed}
                  />
                )}
                <h2>
                  {showProfessionalServices
                    ? "Particuliers et professionnels"
                    : "Votre devis à domicile"}
                </h2>
                <p>
                  Pour un logement, le devis décrit les pièces et les priorités.
                  {showProfessionalServices &&
                    " Pour des bureaux ou une copropriété, il précise aussi le cahier des tâches, les accès et la fréquence souhaitée."}
                </p>
                <p>
                  Un devis personnalisé est proposé gratuitement. La demande ne
                  constitue pas une commande.
                </p>
                <Link href="/devis/" className="button">
                  Obtenir mon devis <ArrowUpRight size={16} />
                </Link>
                <h2>À propos des avantages fiscaux</h2>
                <p>
                  {sapAvailable
                    ? "Le crédit d’impôt concerne les prestations éligibles au domicile des particuliers, sous réserve des conditions et plafonds applicables."
                    : "L’estimation après crédit d’impôt sera disponible après validation de la déclaration SAP et du tarif."}
                </p>
                <Link href="/services-a-la-personne/">
                  Lire les informations SAP
                </Link>
              </div>
            )}
            {slug === "zones-intervention" && (
              <div className="prose">
                <h2>
                  <MapPin size={24} /> Saint-Germain-en-Laye — 78100
                </h2>
                {places.map((place) => (
                  <p key={place.slug}>
                    <Link href={`/${place.slug}/`}>
                      Préparer une intervention à {place.city}
                    </Link>
                  </p>
                ))}
                <p>
                  La commune constitue la zone d’intervention renseignée pour le
                  lancement. Les disponibilités et les modalités d’accès sont
                  vérifiées lors de votre demande.
                </p>
                <h2>Vous êtes dans une commune voisine ?</h2>
                <p>
                  Le Vésinet, Le Pecq, Chatou, Croissy-sur-Seine, Chambourcy,
                  Maisons-Laffitte, Marly-le-Roi et Poissy sont des secteurs à
                  étudier. Leur desserte n’est pas confirmée. Aucune
                  intervention n’y est promise avant vérification individuelle.
                </p>
                <Link href="/devis/" className="button">
                  Vérifier les possibilités d’intervention{" "}
                  <ArrowUpRight size={16} />
                </Link>
              </div>
            )}
            {places
              .filter((place) => place.slug === slug)
              .map((place) => (
                <div className="prose" key={place.slug}>
                  {place.sections.map(([title, body]) => (
                    <section key={title}>
                      <h2>{title}</h2>
                      <p>{body}</p>
                    </section>
                  ))}
                  <Link href="/menage-regulier/">
                    Découvrir l’entretien régulier
                  </Link>
                  <p>
                    <Link href="/devis/" className="button">
                      Demander un devis à {place.city}
                    </Link>
                  </p>
                </div>
              ))}
            {slug === "services-a-la-personne" && (
              <div className="prose">
                <div className="notice">
                  <strong>
                    {sapAvailable
                      ? `Déclaration SAP : ${company.SAP_DECLARATION_NUMBER}`
                      : company.SAP_STATUS === "undeclared"
                        ? "Activité non déclarée au titre des SAP"
                        : "Déclaration SAP à confirmer"}
                  </strong>
                  <p>
                    {sapAvailable
                      ? "Les prestations éligibles peuvent ouvrir droit au crédit d’impôt de 50 %, sous réserve des plafonds et conditions applicables à votre situation."
                      : "Éclanora ne se présente pas comme un organisme déjà déclaré. Aucun crédit d’impôt n’est garanti dans ses offres actuelles."}
                  </p>
                </div>
                <h2>Domicile des particuliers</h2>
                <p>
                  L’entretien de la maison peut relever des services à la
                  personne sous conditions. L’éligibilité dépend de la nature de
                  l’intervention, du cadre légal et de la situation du
                  bénéficiaire. Une prestation de fin de location n’est pas
                  automatiquement éligible.
                </p>
                <h2>Bureaux et copropriétés : hors SAP</h2>
                <p>
                  Le nettoyage de bureaux, de locaux professionnels et de
                  parties communes ne bénéficie pas du crédit d’impôt destiné au
                  ménage au domicile des particuliers.
                </p>
                <h2>Activité mixte et déclaration</h2>
                <p>
                  La compatibilité des activités SAP et hors SAP doit être
                  validée. La dispense de condition d’activité exclusive pour
                  certaines micro-entreprises comporte notamment des conditions
                  d’activité principale, de chiffre d’affaires accessoire, de
                  comptabilité séparée et de déclaration. Elle n’est jamais
                  présumée acquise pour Éclanora.
                </p>
                <h2>Avance immédiate</h2>
                <p>
                  {company.URSSAF_ADVANCE_IMMEDIATE_ENABLED && sapAvailable
                    ? "La disponibilité effective du dispositif doit être confirmée pour votre situation avant utilisation."
                    : "L’Avance immédiate Urssaf n’est pas activée. Elle nécessite un cadre et une habilitation distincts."}
                </p>
                <h2>Sources officielles</h2>
                <p>
                  <a href="https://www.servicesalapersonne.gouv.fr/">
                    Portail officiel des services à la personne
                  </a>{" "}
                  ·{" "}
                  <a href="https://entreprendre.service-public.gouv.fr/vosdroits/F23633">
                    Service Public : activités de services à la personne
                  </a>
                </p>
                <p className="small">
                  Informations vérifiées le 27 novembre 2026. Les conditions
                  doivent être revérifiées avant activation de l’offre et
                  adaptées à votre situation.
                </p>
              </div>
            )}
            {slug === "contact" && (
              <div className="contact-grid">
                <div className="contact-card">
                  <span className="eyebrow">NOTRE ANCRAGE</span>
                  <h2>Saint-Germain-en-Laye</h2>
                  <p>78100 · Yvelines · France</p>
                  <p>
                    Les interventions et les échanges sont organisés sur
                    rendez-vous. Aucun accueil public à une adresse non
                    confirmée n’est annoncé.
                  </p>
                  {company.phone ? (
                    <a href={`tel:${company.phone}`} className="button">
                      {company.phone}
                    </a>
                  ) : (
                    <p>
                      Le numéro professionnel sera ajouté après confirmation.
                    </p>
                  )}
                  {company.email ? (
                    <a href={`mailto:${company.email}`}>{company.email}</a>
                  ) : (
                    <p>L’email professionnel sera ajouté après confirmation.</p>
                  )}
                </div>
                <div className="contact-card">
                  <span className="eyebrow">VOTRE PROJET</span>
                  <h2>Décrivez votre besoin.</h2>
                  <p>
                    Posez une question sur nos prestations ou laissez votre
                    numéro pour être rappelé.
                  </p>
                  <QuoteForm contact />
                </div>
              </div>
            )}
            {slug === "faq" && (
              <div className="faq-page">
                <Faq
                  items={[
                    ...generalFaq,
                    ...services
                      .flatMap((s) => s.faq)
                      .filter(
                        ([q]) =>
                          !["Le crédit d’impôt s’applique-t-il ?"].includes(q),
                      ),
                  ]}
                />
              </div>
            )}
            {slug === "conseils" && (
              <div className="article-grid">
                {articles.map((a, i) => (
                  <Link
                    className="article-card"
                    href={`/conseils/${a.slug}/`}
                    key={a.slug}
                  >
                    <span className="eyebrow">LE JOURNAL / 0{i + 1}</span>
                    <h2>{a.title}</h2>
                    <p>{a.lead}</p>
                    <span className="text-link">
                      Lire le conseil <ArrowUpRight size={16} />
                    </span>
                  </Link>
                ))}
              </div>
            )}
            {legalPages[slug] && (
              <div className="prose legal-prose">
                {legalPages[slug].sections.map(([t, b]) => (
                  <section key={t}>
                    <h2>{t}</h2>
                    <p>{b}</p>
                  </section>
                ))}
                <p className="small">
                  Version du 2 novembre 2026. Documents préparatoires à faire
                  valider avant publication.
                </p>
              </div>
            )}
          </>
        )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumb).replace(/</g, "\\u003c"),
          }}
        />
      </div>
      {!legalPages[slug] && slug !== "devis" && <Cta />}
    </>
  );
}
