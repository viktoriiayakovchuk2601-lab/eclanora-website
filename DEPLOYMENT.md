# Déploiement et exploitation

## État

Préproduction locale uniquement. Aucune mise en ligne publique autorisée avec les champs légaux manquants. Le site demeure en `noindex`, robots bloqués tant que `PUBLICATION_APPROVED` n’est pas true. Le build refuse cette activation si les contrôles de configuration ne passent pas.

## Avant ouverture

1. Compléter `src/lib/company.ts` avec justificatifs : identité, SIRET, domiciliation, contacts, RNE, TVA, direction de publication, hébergeur et médiateur réel. Ne pas déduire la validation INPI de la date de dépôt.
2. Valider les CGV B2C/B2B avec prix, conditions de paiement, reports, rétractation, responsabilité, médiation et contrats récurrents. Compléter les durées de conservation et les sous-traitants réellement choisis avec leurs localisations et contrats RGPD.
3. Confirmer le tarif avant affichage public et chaque nouvelle zone avant création d’une page locale. Activer l’offre professionnelle via `professionalServicesApproved` après validation administrative. Activer SAP après vérification du numéro et du modèle mixte. Valider séparément l’Avance immédiate.
4. Choisir un hébergement Node.js compatible Next.js (pas un simple hébergement de fichiers). Configurer un domaine HTTPS et `SITE_URL` sans slash final. Installer par `npm ci`, construire avec `npm run build`, lancer `npm start` derrière un reverse proxy. Le processus écoute 127.0.0.1 : adapter l’interface si une plateforme l’exige.
5. Configurer les secrets SMTP côté serveur. Utiliser un expéditeur autorisé, SPF/DKIM/DMARC et une boîte professionnelle. Tester acceptation, livraison réelle, rejet, panne et caractère confidentiel des messages. Ne jamais committer `.env.local`.
6. Ajouter une limitation partagée au proxy/WAF sur POST /api/devis (par exemple 5 demandes/10 min par IP, à adapter). La limite mémoire de l’application ne suffit pas pour plusieurs instances et se réinitialise au redémarrage. Protéger/écraser les en-têtes proxy avant `TRUST_PROXY=true`. Limiter également les tailles de requêtes et délais au proxy.
7. Définir la suppression/export des emails, pièces, journaux et sauvegardes ; restreindre l’accès à la boîte et activer MFA. Ne pas journaliser les corps de demandes. Tester la procédure de droits RGPD.
8. Poser `LEGAL_APPROVED=true`, `DATA_PROCESSING_APPROVED=true`, `EDGE_RATE_LIMIT_CONFIGURED=true` seulement après validation effective. Exécuter `npm run check:production` avec les variables chargées (le script Node n’importe pas automatiquement `.env.local`).
9. En préproduction, contrôler clavier, lecteur d’écran, contrastes, mobile, erreurs et liens ; mesurer Lighthouse et Core Web Vitals. Ne pas publier de scores non mesurés. Vérifier headers, cache sans données personnelles, HTTPS et absence de traceurs.
10. Après accord de publication, poser `PUBLICATION_APPROVED=true`, reconstruire et vérifier canonical/robots/sitemap avec le domaine final. HSTS est activé pour le domaine publié et la préproduction renvoie `X-Robots-Tag: noindex, nofollow`. Restreindre l’accès aux déploiements de préproduction par le contrôle d’accès de l’hébergeur.

## Vérification, maintenance et retour arrière

Contrôler /, six services, /devis/, /contact/, /conseils/, articles, pages légales, /sitemap.xml, /robots.txt et une 404. Vérifier un vrai email synthétique et son identifiant. Suivre les erreurs d’envoi sans contenu personnel, les rejets SMTP, la disponibilité et les expirations du domaine. Mettre à jour les dépendances avec contrôle des avis de sécurité, typecheck, tests et build. Conserver un artefact/version précédente et revenir au build précédent si incident. Ne pas modifier les secrets lors d’un rollback sans nécessité.

## Configuration de l’hébergeur et flux de données

- Sur Vercel ou un hébergement Node.js compatible, utiliser le projet Next.js et Node.js 24 avec `npm ci` puis `npm run build`. Séparer les variables et les droits d’accès de développement, préproduction et production.
- Rattacher le domaine validé, appliquer les enregistrements DNS indiqués par l’hébergeur et attendre la vérification du certificat. Vérifier la redirection HTTPS et la cohérence du domaine canonique avant de transmettre le sitemap aux moteurs.
- Les demandes transitent du navigateur vers le Route Handler, puis vers la boîte métier par SMTP chiffré. Le client reçoit une référence sans copie de son message. Le site ne crée aucune base de prospects. Les erreurs d’envoi sont journalisées avec la référence, sans corps de demande ni coordonnées.
- Désigner le responsable de la boîte métier et documenter le tri à échéance. Après validation d’une demande d’effacement, rechercher la référence dans la boîte, ses copies de travail et ses dossiers, supprimer les éléments concernés et appliquer la politique convenue aux sauvegardes et sous-traitants. Conserver uniquement les éléments soumis à une obligation de conservation documentée.

## Limites connues

Pas de CMP car aucun traceur facultatif. Ajouter une CMP effective avant tout outil qui l’exige. Le CSP autorise le JavaScript inline de Next.js et les données structurées : envisager des nonces avec rendu dynamique si le niveau de sécurité du déploiement le requiert. L’application ne garantit ni référencement ni conformité juridique certifiée. Le bouton téléphonique n’apparaît que lorsque le vrai numéro est renseigné. Les images sont des illustrations, pas des preuves de réalisation.
