# Rapport de validation — 27 novembre 2026

## Audit et interventions

Le dépôt de départ contenait un site Next.js prégénéré, six fiches de prestations, cinq articles, une API de devis et des brouillons juridiques. La structure, l’identité graphique et les contenus existants ont été conservés. Les priorités de l’audit étaient l’envoi des formulaires, les avis de sécurité du framework et les contrôles de publication, puis l’accessibilité, le référencement local et la reproductibilité des tests.

| Périmètre | Modifications principales |
| --- | --- |
| Parcours | `src/app/[slug]/page.tsx`, `src/components/quote-form.tsx` et `src/components/price-estimator.tsx` ajoutent le contact, le rappel et l’estimation indicative. |
| Envoi et sécurité | `src/app/api/devis/route.ts`, `src/lib/quote.ts` et `next.config.ts` couvrent validation, limite anti-abus, SMTP, confirmations, HSTS et contrôles de préproduction. |
| Référencement et configuration | `src/app/layout.tsx`, `src/app/sitemap.ts`, `src/lib/company.ts` et `src/lib/content.ts` ajoutent le catalogue, la page de Saint-Germain-en-Laye et les métadonnées de vérification. |
| Qualité | `tests/`, `scripts/smoke-test.mjs`, `playwright.config.ts` et `.github/workflows/ci.yml` rendent reproductibles les vérifications des navigateurs, des pages et de l’API. |
| Exploitation | `README.md`, `DEPLOYMENT.md`, `LEGAL-CHECKLIST.md` et `SEO-CHECKLIST.md` décrivent le déploiement, les données et les décisions en attente. |

## Vérifications

- `npm ci` installe 489 paquets à partir du verrou. L’audit associé signale zéro vulnérabilité connue après passage de Next.js à 16.4.6. Trois extensions de la configuration ESLint Next déclarent encore une compatibilité de pair plafonnée à ESLint 9. Le lint est exécuté avec ESLint 10.
- `npm run lint`, `npm run typecheck` et `npm test` passent. Vitest exécute neuf tests, dont trois scénarios d’envoi SMTP simulé.
- `npm run build` compile avec Webpack et génère 33 sorties statiques, dont 27 pages de contenu. Turbopack a échoué sur le traitement CSS dans cet environnement Windows.
- Les contrôles HTTP passent en développement et en préproduction sur 27 pages et 27 liens internes. Ils vérifient les titres et URL canoniques, le noindex, les en-têtes, l’absence de cookie de réponse, la 404 et l’API. Le mode test confirme la validation sans envoi. Une sixième demande atteint la limite `429` même avec un autre e-mail. Le build de préproduction répond `503` sans SMTP.
- Playwright passe 19 vérifications sur Chromium, Firefox, WebKit, Edge, iPhone et iPad simulés. Les cinq exclusions correspondent à l’envoi simulant l’indisponibilité SMTP, exécuté une seule fois sur Chromium pour le serveur partagé. Aucun tracker, débordement, erreur JavaScript ou échec axe n’est relevé sur les pages parcourues lors du passage final.
- La CI GitHub Actions du commit applicatif est verte. [Exécution Qualité nº 2](https://github.com/viktoriiayakovchuk2601-lab/eclanora-website/actions/runs/45986465414)
- `npm run check:production` échoue comme prévu tant que les renseignements et validations d’exploitation sont manquants.
- Le contrôle ciblé de l’historique Git initial n’a relevé aucun motif courant de clé privée, jeton GitHub, clé d’accès AWS ou mot de passe SMTP. La seule configuration d’environnement suivie est le modèle `.env.example`. Le contrôle repose sur des motifs textuels.

## Mesures Lighthouse

Page d’accueil locale servie par le build de production, Lighthouse 13.6.0 dans Chrome, un passage par profil après optimisation.

| Profil | Performance | Accessibilité | Bonnes pratiques | SEO | LCP | TBT | CLS |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Mobile émulé | 96 | 100 | 100 | 69 | 0,76 s | 217 ms | 0 |
| Ordinateur | 100 | 100 | 100 | 69 | 0,68 s | 40 ms | 0 |

Le premier passage mobile affichait 94 en performance et 96 en bonnes pratiques. Les images des cartes sont désormais dimensionnées et chargées à la demande. Le chargement de Zod intervient à la soumission et son mode sans compilation dynamique respecte la CSP de production. La règle `is-crawlable` reste en échec à cause du noindex de préproduction. Les mesures sont réalisées en laboratoire. L’INP et les Core Web Vitals terrain restent à mesurer après ouverture.

## Conditions restantes avant ouverture

- Renseigner et valider l’identité de l’EI, l’adresse, le SIRET et l’immatriculation, les coordonnées, le régime de TVA, l’hébergeur, le médiateur et les conditions contractuelles. Le modèle actuel recueille une demande de devis. Valider le processus de vente réel, y compris la rétractation lorsque applicable.
- Confirmer le tarif et les zones réellement desservies. Maisons-Laffitte et Le Vésinet restent en attente de confirmation. L’offre professionnelle dépend de l’autorisation administrative. La déclaration SAP et l’Avance immédiate disposent de validations distinctes.
- Mettre en place le domaine HTTPS, un serveur SMTP et une limitation distribuée. Tester la réception réelle dans la boîte métier et chez le client, les rebonds et la procédure de suivi. La CSP actuelle autorise les scripts inline nécessaires au rendu statique de Next.js.
- Valider les prestataires et lieux de traitement, la durée de conservation et la suppression des demandes. Le site actuel ne charge aucun outil de suivi, carte embarquée ou publicité. Une activation future nécessitant le consentement devra intégrer un gestionnaire opérationnel et ses tests.
- Vérifier Search Console, Bing Webmaster Tools et la fiche d’établissement après validation des coordonnées et du domaine. Confirmer les droits et crédits photographiques. Un audit humain avec lecteur d’écran complète les contrôles automatisés.
