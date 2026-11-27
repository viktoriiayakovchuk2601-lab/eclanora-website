import { company as c } from "./company";
const pending = (v: string | null) => v || "À compléter avant publication";
export const legalPages: Record<
  string,
  { title: string; lead: string; sections: [string, string][] }
> = {
  "mentions-legales": {
    title: "Mentions légales",
    lead: "Document préparatoire — les renseignements non confirmés sont explicitement identifiés.",
    sections: [
      [
        "Éditeur",
        `Nom commercial : ÉCLANORA. Statut : ${c.legalStatus}, régime micro-entrepreneur. Identité civile : ${pending(c.civilName)}. SIREN communiqué : ${c.siren}. SIRET : ${pending(c.siret)}. APE : ${c.ape}. Inscription RNE : ${pending(c.rne)}.`,
      ],
      [
        "Coordonnées",
        `Domiciliation exacte : ${pending(c.address)}. Localisation communiquée : ${c.postalCode} ${c.city}. Email : ${pending(c.email)}. Téléphone : ${pending(c.phone)}.`,
      ],
      [
        "Publication et hébergement",
        `Directeur de publication : ${pending(c.publicationDirector)}. Hébergeur : ${c.host ? `${c.host.name}, ${c.host.address}, ${c.host.phone}` : "Nom, adresse et téléphone à compléter après choix du prestataire"}. Régime de TVA : ${pending(c.vatStatus)}.`,
      ],
      [
        "Médiation de la consommation",
        c.mediator
          ? `${c.mediator.name}, ${c.mediator.address}, ${c.mediator.url}`
          : "Médiateur à désigner avant commercialisation auprès des consommateurs.",
      ],
      [
        "Propriété intellectuelle",
        "L’identité graphique est une création du projet. Le nom Éclanora n’est pas présenté comme une marque déposée. Les photographies d’illustration ne constituent pas des réalisations de l’entreprise. Leur provenance est consignée dans ASSETS.md.",
      ],
      [
        "Responsabilité",
        "Le site présente des services sur devis. Une demande ne vaut ni commande ni réservation. Les conditions et la disponibilité sont confirmées individuellement.",
      ],
    ],
  },
  "politique-confidentialite": {
    title: "Politique de confidentialité",
    lead: "Un formulaire limité aux informations nécessaires à l’étude de votre demande.",
    sections: [
      [
        "Responsable du traitement",
        `L’entrepreneur individuel exploitant ÉCLANORA, SIREN ${c.siren}. Identité civile : ${pending(c.civilName)}. Adresse : ${pending(c.address)}. Contact pour les droits : ${pending(c.email)}. Ces éléments doivent être renseignés avant ouverture du formulaire au public.`,
      ],
      [
        "Données et finalités",
        "Le nom, l’e-mail et le message servent à traiter la demande. Le téléphone est obligatoire pour un rappel. Pour un devis, la zone, le type de client et les caractéristiques de l’intervention servent également à qualifier la demande. La surface et la date restent facultatives. Évitez les données sensibles et les codes d’accès.",
      ],
      [
        "Bases légales",
        "L’étude d’un devis demandé par un particulier repose sur les mesures précontractuelles (article 6.1.b du RGPD). Les autres échanges et la protection contre les abus relèvent des intérêts légitimes à répondre aux demandes et à sécuriser le service (article 6.1.f). Le site ne réalise aucune prospection ni profilage commercial.",
      ],
      [
        "Destinataires et sous-traitants",
        `Les demandes sont destinées à l’entrepreneur. Les seuls accès techniques nécessaires sont ceux de l’hébergeur et du prestataire de messagerie effectivement retenus. Liste actuelle confirmée : ${c.processors.length ? c.processors.join(", ") : "aucun prestataire de production renseigné"}. Les lieux de traitement, engagements contractuels et éventuels transferts hors EEE doivent être documentés avant activation. Aucun outil publicitaire, carte intégrée ou mesure d’audience externe n’est chargé.`,
      ],
      [
        "Durées de conservation",
        `Durée des demandes : ${pending(c.retention)}. La politique de tri et de suppression des boîtes mail et sauvegardes doit être arrêtée avant activation. En mode test, les formulaires sont uniquement validés. La limitation locale utilise une empreinte temporaire de l’adresse réseau, avec une fenêtre de dix minutes et suppression des compteurs expirés à la prochaine demande.`,
      ],
      [
        "Vos droits",
        "Selon la base légale et la situation, vous pouvez demander accès, rectification, effacement, limitation, opposition et portabilité lorsqu’elle s’applique. Utilisez le contact indiqué ci-dessus ; une vérification d’identité proportionnée peut être demandée. Une réponse est en principe apportée sous un mois, avec prolongation motivée dans les cas prévus. Vous pouvez déposer une réclamation auprès de la CNIL (cnil.fr).",
      ],
      [
        "Sécurité et évolution",
        "L’envoi est validé côté serveur ; les secrets de messagerie restent sur le serveur. L’hébergement public doit utiliser HTTPS. Aucune décision automatisée n’est prise. Toute nouvelle finalité ou tout nouveau sous-traitant impose une mise à jour de cette information.",
      ],
    ],
  },
  cookies: {
    title: "Cookies et préférences",
    lead: "Une navigation sans traceurs publicitaires ni mesure d’audience externe.",
    sections: [
      [
        "Configuration actuelle",
        "Le site n’utilise aucun cookie facultatif, pixel marketing, stockage de suivi ou contenu tiers embarqué. Les photographies sont hébergées avec le site. Aucun bandeau de consentement n’est donc nécessaire dans cette version.",
      ],
      [
        "Gérer mes cookies",
        "Il n’y a actuellement aucune préférence facultative à accepter ou à refuser. Le lien du pied de page permet de retrouver cette information à tout moment.",
      ],
      [
        "Avant toute évolution",
        "L’ajout de traceurs nécessitant un consentement doit être précédé d’une véritable gestion par finalité : tout accepter, tout refuser avec la même visibilité, personnaliser sans choix précoché, blocage avant consentement, retrait facile et preuve des choix. Les outils ne sont pas ajoutés tant que ce mécanisme n’est pas opérationnel.",
      ],
    ],
  },
  cgv: {
    title: "Conditions générales de vente",
    lead: "Projet de conditions à compléter et faire valider. Aucune commande ni conclusion de contrat n’est proposée sur ce site.",
    sections: [
      [
        "Prestations et devis",
        "Le périmètre, les exclusions, l’adresse d’intervention, la fréquence, les fournitures, la durée estimée ou le forfait et le prix sont précisés dans un devis personnalisé gratuit. Pour les prestations SAP, les obligations particulières d’information et de devis sont à appliquer avant activation de l’offre.",
      ],
      [
        "Formation du contrat",
        "Le formulaire exprime une demande de renseignements. Le contrat n’est formé qu’après communication des informations précontractuelles et acceptation du devis et des conditions applicables. Aucun créneau n’est réservé automatiquement.",
      ],
      [
        "Prix et paiement — particuliers",
        "Les prix finaux, le régime de TVA applicable, les frais éventuels, les moyens de paiement et l’échéancier doivent être arrêtés avant toute acceptation. Aucun tarif ni acompte non validé n’est imposé par cette version du site.",
      ],
      [
        "Conditions d’intervention",
        "Le client signale les surfaces fragiles et les risques connus. Les accès et les équipements sont convenus avant intervention. Les tâches dangereuses, spécialisées ou non prévues au devis sont exclues. La responsabilité est appréciée conformément au droit applicable, sans suppression des droits légaux du consommateur.",
      ],
      [
        "Annulation, report et contrats récurrents",
        "Les délais de prévenance, modalités de report, éventuels frais proportionnés, durée du contrat et conditions de résiliation restent à définir et à valider. Aucune pénalité non convenue ne doit être appliquée. Si les règles de résiliation en ligne s’appliquent au modèle retenu, la fonctionnalité correspondante devra être mise en place avant commercialisation.",
      ],
      [
        "Rétractation des consommateurs",
        "Lorsque le droit de rétractation s’applique à un contrat conclu à distance ou hors établissement, le consommateur dispose en principe de quatorze jours à compter de la conclusion du contrat de service. Une exécution anticipée nécessite sa demande expresse ; la perte du droit après exécution complète suppose les conditions légales requises. Fournir les informations, le formulaire type et les modalités d’exercice adaptées avant conclusion. Le site ne conclut actuellement aucun contrat en ligne.",
      ],
      [
        "Réclamations et médiation",
        `Toute réclamation sera adressée au contact professionnel à compléter. Après une réclamation écrite préalable restée sans solution, le consommateur peut saisir le médiateur compétent selon ses règles de recevabilité. Médiateur réellement désigné : ${c.mediator ? `${c.mediator.name}, ${c.mediator.address}, ${c.mediator.url}` : "à choisir et renseigner avant commercialisation auprès des consommateurs"}.`,
      ],
      [
        "Conditions professionnelles — B2B",
        "Un devis ou contrat B2B distinct précise les horaires, le cahier des charges, le prix HT et le régime de TVA, les échéances, les conditions d’escompte et le taux des pénalités de retard conforme aux règles applicables. L’indemnité forfaitaire légale pour frais de recouvrement est de 40 € lorsque ses conditions sont réunies. Les délais de paiement et le taux effectif ne sont pas encore arrêtés. Les prestations de bureaux, syndics et parties communes sont hors SAP.",
      ],
    ],
  },
  accessibilite: {
    title: "Accessibilité",
    lead: "Un objectif de navigation simple, lisible et utilisable au clavier.",
    sections: [
      [
        "Mesures intégrées",
        "Structure sémantique, langue française déclarée, lien d’évitement, titres hiérarchisés, libellés de formulaire, focus visible, messages d’état et navigation clavier ont été intégrés. Les animations respectent la préférence de mouvement réduit.",
      ],
      [
        "État de conformité",
        "Le site vise WCAG 2.2 niveau AA. Aucun audit complet n’a été réalisé ; aucune conformité certifiée ni déclaration de conformité RGAA n’est revendiquée. Des tests avec technologies d’assistance restent à effectuer avant publication.",
      ],
      [
        "Signaler une difficulté",
        `Contact dédié : ${pending(c.email)}. Décrivez l’adresse de la page, l’action concernée et le navigateur ou l’aide technique utilisée, sans transmettre de données sensibles.`,
      ],
    ],
  },
};
