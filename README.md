# ÉCLANORA

Site vitrine complet pour une entreprise de nettoyage à Saint-Germain-en-Laye. Next.js App Router, TypeScript, React, Tailwind CSS et styles spécifiques, Zod et Nodemailer. Pages rendues côté serveur/prégénérées, formulaire API réel et mode test sans stockage.

## Démarrer

Node.js 24 LTS. Installer avec `npm ci`, copier `.env.example` vers `.env.local`, puis lancer `npm run dev`. Ouvrir http://localhost:3000. Pour vérifier le rendu de production, exécuter `npm run build`, puis `npm start`.

## Vérifier

- `npm run lint`, `npm run typecheck`, `npm test` et `npm run build`.
- Installer les moteurs de test avec `npx playwright install chromium firefox webkit`, puis lancer `npm run test:e2e` après le build. `PLAYWRIGHT_EDGE=true` ajoute Edge si le navigateur est installé.
- `npm run test:smoke` contrôle un serveur de développement déjà démarré. Définir `TEST_URL` si le port diffère et `EXPECT_PRODUCTION=true` pour un serveur de production sans SMTP.
- Avec Chrome installé, lancer `npx lighthouse http://localhost:3000/ --chrome-flags="--headless" --output=json --output-path=test-results/lighthouse.json` sur le build local pour mesurer les performances.
- `npm run check:production` signale les champs et validations requis avant publication. Les versions installées sont verrouillées dans `package-lock.json`.

## Structure

- `src/lib/company.ts` : données officielles, champs manquants, statut SAP, tarifs et zones.
- `src/lib/content.ts` : six services et cinq articles originaux.
- `src/lib/legal.ts` : documents préparatoires, à compléter et valider.
- `src/app/[slug]/page.tsx` : pages services et institutionnelles, URLs distinctes.
- `src/app/conseils/[slug]/page.tsx` : cinq articles accessibles séparément.
- `src/app/api/devis/route.ts` : validation, anti-spam et transport SMTP.
- `src/components/quote-form.tsx` : formulaire conditionnel et états réels.
- `src/lib/readiness.ts` : blocages de publication.
- `tests/` : validation et scénarios SMTP simulés, plus contrôles navigateur et axe.
- `.github/workflows/ci.yml` : vérifications à chaque push et pull request.

## Formulaire

Le formulaire de devis et le formulaire de contact partagent `POST /api/devis/`. L’API accepte du JSON issu de la même origine. Le devis utilise `intent: "devis"`, valeur implicite pour les anciens clients. Le contact et le rappel utilisent `"contact"` et `"rappel"` et collectent uniquement le nom, le prénom, l’e-mail, le téléphone et le message. Le téléphone est obligatoire pour le rappel. Les schémas Zod dans `src/lib/quote.ts` définissent les champs et limites. Les requêtes transmettent aussi `startedAt` (timestamp en millisecondes) et `website` (champ piège à laisser vide).

En développement, `QUOTE_MODE=test` valide les données puis affiche une confirmation de test. Avec `QUOTE_MODE=smtp`, le serveur adresse la demande à la boîte métier, puis envoie un accusé de réception minimal au client. Si seul l’accusé échoue, l’écran affiche la référence et le résultat exact. L’API utilise notamment les codes 400 (validation), 403 (origine), 413/415 (taille/format), 429 (limite), 502 (échec d’envoi métier) et 503 (configuration indisponible). Une acceptation SMTP est à vérifier par un contrôle de réception.

Aucune base de données de prospects, aucun compte client, paiement, réservation contractuelle, analytics ni publicité. Les demandes arrivent uniquement dans la boîte métier configurée. Export et suppression sont gérés dans cette boîte et chez les sous-traitants selon une procédure à valider.

Le devis est étudié sur la base des tarifs confirmés par l’entreprise. Le calculateur présente une simulation de travail en préproduction, ou une estimation publique lorsque le tarif est confirmé. La publication de l’offre professionnelle dépend de la validation administrative. Le crédit d’impôt dépend de la configuration SAP et de l’éligibilité de la prestation et du client.

## Aperçus

[Accueil sur ordinateur](previews/accueil-desktop.jpg) · [Accueil sur mobile](previews/accueil-mobile.jpg)

Le dépôt reste sous droits réservés en l’absence d’une licence explicitement accordée par la titulaire des droits. La provenance des illustrations figure dans [ASSETS.md](ASSETS.md).

## Système visuel

`src/app/globals.css` centralise l’ivoire de fond, le vert foncé des actions, le doré d’accent et les couleurs de texte et de bordure. Georgia compose les titres. Arial sert à la navigation, aux textes courants et aux formulaires. Les boutons, cartes de prestations, encarts et formulaires utilisent ces mêmes règles. Les formulaires distinguent le focus, les champs invalides, le chargement et le résultat via des états visibles et des annonces accessibles.

Voir [DEPLOYMENT.md](DEPLOYMENT.md), [LEGAL-CHECKLIST.md](LEGAL-CHECKLIST.md), [SEO-CHECKLIST.md](SEO-CHECKLIST.md), [ASSETS.md](ASSETS.md) et [TEST-REPORT.md](TEST-REPORT.md).
