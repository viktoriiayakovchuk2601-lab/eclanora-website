# Déploiement et exploitation

## État

Préproduction locale uniquement. Aucune mise en ligne publique autorisée avec les champs légaux manquants. Le site demeure en `noindex`, robots bloqués tant que `PUBLICATION_APPROVED` n’est pas true. Le build refuse cette activation si les contrôles de configuration ne passent pas.

## Avant ouverture

1. Compléter `src/lib/company.ts` avec justificatifs : identité, SIRET, domiciliation, contacts, RNE, TVA, direction de publication, hébergeur et médiateur réel. Ne pas déduire la validation INPI de la date de dépôt.
2. Valider les CGV B2C/B2B avec prix, conditions de paiement, reports, rétractation, responsabilité, médiation et contrats récurrents. Compléter les durées de conservation et les sous-traitants réellement choisis avec leurs localisations et contrats RGPD.
3. Conserver le tarif désactivé jusqu’à confirmation. Confirmer toute nouvelle zone. Ne jamais activer SAP sans numéro enregistré et analyse du modèle mixte ; Avance immédiate et logo officiel à traiter séparément.
4. Choisir un hébergement Node.js compatible Next.js (pas un simple hébergement de fichiers). Configurer un domaine HTTPS et `SITE_URL` sans slash final. Installer par `npm ci`, construire avec `npm run build`, lancer `npm start` derrière un reverse proxy. Le processus écoute 127.0.0.1 : adapter l’interface si une plateforme l’exige.
5. Configurer les secrets SMTP côté serveur. Utiliser un expéditeur autorisé, SPF/DKIM/DMARC et une boîte professionnelle. Tester acceptation, livraison réelle, rejet, panne et caractère confidentiel des messages. Ne jamais committer `.env.local`.
6. Ajouter une limitation partagée au proxy/WAF sur POST /api/devis (par exemple 5 demandes/10 min par IP, à adapter). La limite mémoire de l’application ne suffit pas pour plusieurs instances et se réinitialise au redémarrage. Protéger/écraser les en-têtes proxy avant `TRUST_PROXY=true`. Limiter également les tailles de requêtes et délais au proxy.
7. Définir la suppression/export des emails, pièces, journaux et sauvegardes ; restreindre l’accès à la boîte et activer MFA. Ne pas journaliser les corps de demandes. Tester la procédure de droits RGPD.
8. Poser `LEGAL_APPROVED=true`, `DATA_PROCESSING_APPROVED=true`, `EDGE_RATE_LIMIT_CONFIGURED=true` seulement après validation effective. Exécuter `npm run check:production` avec les variables chargées (le script Node n’importe pas automatiquement `.env.local`).
9. En préproduction, contrôler clavier, lecteur d’écran, contrastes, mobile, erreurs et liens ; mesurer Lighthouse et Core Web Vitals. Ne pas publier de scores non mesurés. Vérifier headers, cache sans données personnelles, HTTPS et absence de traceurs.
10. Après accord de publication, poser `PUBLICATION_APPROVED=true`, reconstruire et vérifier canonical/robots/sitemap avec le domaine final. Les métadonnées et paramètres publics sont déterminés au build. Configurer HSTS sur le domaine HTTPS seulement après validation de ses sous-domaines.

## Vérification, maintenance et retour arrière

Contrôler /, six services, /devis/, /contact/, /conseils/, articles, pages légales, /sitemap.xml, /robots.txt et une 404. Vérifier un vrai email synthétique et son identifiant. Suivre les erreurs d’envoi sans contenu personnel, les rejets SMTP, la disponibilité et les expirations du domaine. Mettre à jour les dépendances avec contrôle des avis de sécurité, typecheck, tests et build. Conserver un artefact/version précédente et revenir au build précédent si incident. Ne pas modifier les secrets lors d’un rollback sans nécessité.

## Limites connues

Pas de CMP car aucun traceur facultatif. Ajouter une CMP effective avant tout outil qui l’exige. Le CSP autorise le JavaScript inline de Next.js et les données structurées : envisager des nonces avec rendu dynamique si le niveau de sécurité du déploiement le requiert. L’application ne garantit ni référencement ni conformité juridique certifiée. Le bouton téléphonique n’apparaît que lorsque le vrai numéro est renseigné. Les images sont des illustrations, pas des preuves de réalisation.
