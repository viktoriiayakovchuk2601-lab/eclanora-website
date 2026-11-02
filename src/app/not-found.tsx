import Link from "next/link";
export default function NotFound() {
  return (
    <section className="page-intro">
      <span className="eyebrow">ERREUR 404</span>
      <h1>
        Cette page reste
        <br />
        <em>à retrouver.</em>
      </h1>
      <p>L’adresse demandée n’existe pas ou a changé.</p>
      <Link href="/" className="button">
        Revenir à l’accueil
      </Link>
    </section>
  );
}
