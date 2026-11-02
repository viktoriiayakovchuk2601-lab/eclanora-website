# ÉCLANORA

Site vitrine complet pour une entreprise de nettoyage à Saint-Germain-en-Laye. Next.js App Router, TypeScript, React, Tailwind CSS et styles spécifiques, Zod et Nodemailer. Pages rendues côté serveur/prégénérées, formulaire API réel et mode test sans stockage.

## Démarrer

Node.js 24 LTS recommandé. Installer avec `npm ci`, copier `.env.example` vers `.env.local`, puis `npm run dev`. Ouvrir http://localhost:3000. `npm run build` puis `npm start` pour une préproduction locale.

## Vérifier

`npm run typecheck`, `npm test`, `npm run build`. `npm run check:production` échoue volontairement tant que les éléments obligatoires manquent. Les versions exactes installées sont verrouillées dans package-lock.json.

## Structure

- `src/lib/company.ts` : données officielles, champs manquants, statut SAP, tarifs et zones.
- `src/lib/content.ts` : six services et cinq articles originaux.
- `src/lib/legal.ts` : documents préparatoires, à compléter et valider.
- `src/app/[slug]/page.tsx` : pages services et institutionnelles, URLs distinctes.
- `src/app/conseils/[slug]/page.tsx` : cinq articles accessibles séparément.
- `src/app/api/devis/route.ts` : validation, anti-spam et transport SMTP.
- `src/components/quote-form.tsx` : formulaire conditionnel et états réels.
- `src/lib/readiness.ts` : blocages de publication.

## Formulaire

En développement, `QUOTE_MODE=test` valide sans envoyer, stocker ou journaliser les données. La confirmation indique explicitement un test. En production, l’absence de SMTP réel renvoie 503, jamais un faux succès. Pour tester l’envoi, renseigner un serveur SMTP contrôlé et `QUOTE_MODE=smtp`. Un accusé d’acceptation SMTP ne prouve pas la livraison finale : suivre les rejets et la boîte de réception.

Aucune base de données de prospects, aucun compte client, paiement, réservation contractuelle, analytics ni publicité. Les demandes arrivent uniquement dans la boîte métier configurée. Export et suppression sont gérés dans cette boîte et chez les sous-traitants selon une procédure à valider.

Le brief transmis s’arrête au début de la section 12 (« Identifier ce qui »). Les exigences visibles ont servi de périmètre ; aucune suite n’a été supposée.

Voir [DEPLOYMENT.md](DEPLOYMENT.md), [LEGAL-CHECKLIST.md](LEGAL-CHECKLIST.md), [SEO-CHECKLIST.md](SEO-CHECKLIST.md), [ASSETS.md](ASSETS.md) et [TEST-REPORT.md](TEST-REPORT.md).
