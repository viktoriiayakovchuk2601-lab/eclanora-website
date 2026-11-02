# Vérifications — 2 novembre 2026

## Résultats

- `npm install` : dépendances installées et verrouillées, audit npm au moment de l’installation : zéro vulnérabilité signalée. Ce résultat ne garantit pas l’absence de vulnérabilités futures.
- `npm run typecheck` : réussi.
- `npm test` : 5 tests réussis (demande valide, formats/tailles, organisation B2B, séparation particuliers/B2B, garde de publication).
- `npm run build` : compilation de production réussie ; 31 sorties générées par Next.js, dont 25 pages de contenu.
- `node scripts/smoke-test.mjs` sur serveur de développement : 25 pages et 25 liens internes vérifiés, un H1, canonical et noindex par page ; robots bloqué ; vraie 404. API : origine étrangère 403, email invalide 400, piège spam 400, taille excessive 413, confirmation explicite sans envoi et limite 429.
- Même contrôle sur `next start` en préproduction : réussi ; sans SMTP, la demande valide retourne 503 et aucun faux succès.
- `npm run check:production` : échec ATTENDU avec liste des renseignements manquants et validations non obtenues. Ne pas contourner ces blocages.

## Vérification dans le navigateur

Affichage à 1440 × 1000 et 390 × 844. Accueil et prestations examinés sur ordinateur, menu et FAQ mobiles ouverts, champ organisation affiché pour professionnel puis masqué pour particulier, formulaire rempli avec des données synthétiques et confirmation de test constatée. Aucun débordement horizontal constaté sur l’accueil et le devis à 390 px. Captures dans `previews/`.

Une différence de normalisation d’origine localhost/127.0.0.1 détectée lors des tests a été corrigée. En production, la validation utilise le domaine `SITE_URL` configuré. La CSP de développement autorise l’évaluation nécessaire au débogueur React ; celle de production ne l’autorise pas.

## Limites explicites

Aucun vrai email métier envoyé faute de coordonnées et d’identifiants SMTP. La livraison SMTP réelle, les rebonds et l’indisponibilité d’un prestataire configuré restent à tester avant ouverture. Pas de score Lighthouse ni de mesure terrain Core Web Vitals réalisés, pas d’audit exhaustif WCAG/RGAA, pas de certification juridique. Anti-abus distribué et exploitation des données à finaliser chez l’hébergeur. Le projet n’est pas publié sur Internet.
