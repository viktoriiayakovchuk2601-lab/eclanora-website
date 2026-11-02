import { notFound } from "next/navigation";
import Link from "next/link";
import { articles } from "@/lib/content";
import { Breadcrumb, Intro, Cta } from "@/components/site";
export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const a = articles.find((a) => a.slug === slug);
  return {
    title: a?.title,
    description: a?.lead,
    alternates: { canonical: `/conseils/${slug}/` },
  };
}
export default async function Article({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const a = articles.find((a) => a.slug === slug);
  if (!a) notFound();
  return (
    <>
      <div className="content-shell">
        <Breadcrumb
          title={a.title}
          parent={{ title: "Le journal", href: "/conseils/" }}
        />
        <Intro
          tag="LE JOURNAL · CONSEILS PRATIQUES"
          title={a.title}
          lead={a.lead}
        />
        <article className="prose article-body">
          {a.sections.map(([t, b]) => (
            <section key={t}>
              <h2>{t}</h2>
              <p>{b}</p>
            </section>
          ))}
          {slug === "credit-impot-menage-domicile" && (
            <p>
              Consultez le{" "}
              <a href="https://www.servicesalapersonne.gouv.fr/">
                portail officiel des services à la personne
              </a>{" "}
              pour les conditions en vigueur. Information vérifiée le 2 novembre
              2026.
            </p>
          )}
          <p>
            <Link href="/devis/">
              Décrire votre besoin et demander un devis
            </Link>
          </p>
          <Link href="/conseils/">← Tous les conseils</Link>
        </article>
      </div>
      <Cta />
    </>
  );
}
