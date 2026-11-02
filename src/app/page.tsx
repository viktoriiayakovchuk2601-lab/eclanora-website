import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, ArrowDown, MapPin } from "lucide-react";
import { Commitments, Cta, Faq, ServiceCards, Steps } from "@/components/site";
export const metadata = { alternates: { canonical: "/" } };
export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">
            <span className="tiny-line" /> LE SOIN DES LIEUX, TOUT SIMPLEMENT
          </span>
          <h1>
            L’exigence
            <br />
            du propre.
            <br />
            <em>
              L’élégance <br />
              du service.
            </em>
          </h1>
          <p>
            Des prestations de nettoyage soignées pour les particuliers, les
            entreprises et les copropriétés à Saint-Germain-en-Laye.
          </p>
          <div className="hero-actions">
            <Link href="/devis/" className="button">
              Demander un devis gratuit <ArrowUpRight size={17} />
            </Link>
            <a href="#prestations" className="under-link">
              Nos prestations <ArrowDown size={14} />
            </a>
          </div>
          <div className="hero-location">
            <MapPin size={14} /> Saint-Germain-en-Laye & environs
          </div>
        </div>
        <div className="hero-image">
          <Image
            src="/images/interior.webp"
            alt="Salon lumineux aux tons ivoire, parquet et mobilier raffiné"
            fill
            preload
            sizes="(max-width: 760px) 100vw, 55vw"
          />
          <div className="image-label">
            DES LIEUX SOIGNÉS.
            <br />
            <span>Un quotidien plus léger.</span>
          </div>
          <span className="hero-image-number">01 — L’INTÉRIEUR</span>
        </div>
        <div className="hero-seal">
          <span>É</span>
          <small>
            LE SENS
            <br />
            DU DÉTAIL
          </small>
        </div>
      </section>
      <div className="promise-strip">
        <span>Une approche personnalisée</span>
        <i>✧</i>
        <span>Un devis clair & gratuit</span>
        <i>✧</i>
        <span>Le respect de votre intérieur</span>
        <i>✧</i>
        <span>Un service de proximité</span>
      </div>
      <section className="section" id="prestations">
        <div className="section-heading">
          <div>
            <span className="eyebrow">01 — NOS PRESTATIONS</span>
            <h2>
              À chaque espace,
              <br />
              <em>son attention.</em>
            </h2>
          </div>
          <p>
            Un lieu de vie, de travail ou de passage.
            <br />
            La même exigence de soin, une réponse adaptée à chaque besoin.
          </p>
        </div>
        <ServiceCards />
        <div className="service-links">
          <Link href="/menage-regulier/">
            Ménage régulier <ArrowUpRight size={14} />
          </Link>
          <Link href="/nettoyage-ponctuel/">
            Nettoyage approfondi <ArrowUpRight size={14} />
          </Link>
          <Link href="/nettoyage-fin-de-location/">
            Fin de location <ArrowUpRight size={14} />
          </Link>
        </div>
      </section>
      <section className="spirit">
        <div className="spirit-photo">
          <Image
            src="/images/detail.webp"
            alt="Détail d’un intérieur soigné, matières naturelles et lumière douce"
            fill
            sizes="(max-width:760px) 100vw, 45vw"
          />
        </div>
        <div className="spirit-copy">
          <span className="eyebrow">02 — L’ESPRIT ÉCLANORA</span>
          <h2>
            Le propre se voit.
            <br />
            <em>Le soin se ressent.</em>
          </h2>
          <p>
            Nous croyons qu’un espace bien entretenu change la manière dont on
            s’y sent. Il apaise, accueille et laisse la place à l’essentiel.
          </p>
          <p>
            Éclanora est une entreprise de nettoyage à Saint-Germain-en-Laye née
            de cette conviction : chaque lieu mérite une attention particulière,
            chaque demande une écoute réelle.
          </p>
          <Link href="/a-propos/" className="text-link">
            Découvrir notre approche <ArrowUpRight size={17} />
          </Link>
          <span className="spirit-signature">Éclanora</span>
        </div>
      </section>
      <section className="section">
        <span className="eyebrow">LES ENGAGEMENTS QUI NOUS GUIDENT</span>
        <Commitments />
      </section>
      <section className="process section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">03 — EN TOUTE SIMPLICITÉ</span>
            <h2>
              Votre tranquillité,
              <br />
              <em>en trois temps.</em>
            </h2>
          </div>
          <Link href="/devis/" className="text-link">
            Commençons par un échange <ArrowUpRight size={17} />
          </Link>
        </div>
        <Steps />
      </section>
      <section className="zone-section section">
        <div>
          <span className="eyebrow">04 — TOUT PRÈS DE VOUS</span>
          <h2>
            Ancrés à<br />
            <em>Saint-Germain-en-Laye.</em>
          </h2>
          <p>
            Au cœur des Yvelines, nous privilégions la proximité pour construire
            une relation attentive et durable.
          </p>
          <p>
            Vous résidez dans une commune voisine ? Transmettez votre adresse
            d’intervention : nous confirmerons les possibilités de déplacement.
          </p>
          <Link href="/zones-intervention/" className="text-link">
            Consulter notre zone d’intervention <ArrowUpRight size={17} />
          </Link>
        </div>
        <div
          className="zone-graphic"
          aria-label="Zone d’intervention : Saint-Germain-en-Laye"
        >
          <div className="zone-ring ring-one" />
          <div className="zone-ring ring-two" />
          <div className="zone-ring ring-three" />
          <div className="zone-center">
            <MapPin size={27} />
            <strong>Saint-Germain-en-Laye</strong>
            <span>78100 · YVELINES</span>
          </div>
          <span className="zone-caption">LA PROXIMITÉ AU SERVICE DU SOIN</span>
        </div>
      </section>
      <section className="section faq-section">
        <div>
          <span className="eyebrow">05 — VOS QUESTIONS</span>
          <h2>
            Tout commence
            <br />
            <em>par la confiance.</em>
          </h2>
          <Link href="/faq/" className="text-link">
            Toutes les réponses <ArrowUpRight size={16} />
          </Link>
        </div>
        <Faq />
      </section>
      <div className="sap-notice">
        <span>INFORMATION SERVICES À LA PERSONNE</span>
        <p>
          La déclaration SAP d’Éclanora n’est pas confirmée. Aucun avantage
          fiscal n’est actuellement garanti.
        </p>
        <Link href="/services-a-la-personne/">
          Comprendre les conditions <ArrowUpRight size={14} />
        </Link>
      </div>
      <Cta />
    </>
  );
}
