export type Service = {
  slug: string;
  title: string;
  short: string;
  audience: string;
  intro: string;
  included: string[];
  excluded: string[];
  benefit: string;
  faq: [string, string][];
};
export function isProfessionalService(slug: string) {
  return slug === "nettoyage-bureaux" || slug === "nettoyage-coproprietes";
}
export const localPages = [
  {
    slug: "saint-germain-en-laye",
    city: "Saint-Germain-en-Laye",
    postalCode: "78100",
    sections: [
      [
        "Préparer un ménage dans le centre-ville",
        "Pour un appartement en centre-ville, précisez l’étage, la présence d’un ascenseur et les possibilités de déposer le matériel. Ces renseignements permettent d’estimer le temps réellement consacré au ménage.",
      ],
      [
        "Définir les priorités d’un entretien régulier",
        "Indiquez les pièces à traiter à chaque visite, les sols qui nécessitent un produit adapté et les tâches à alterner. Pour un premier nettoyage ou une remise de clés, communiquez la date et les zones à traiter en priorité.",
      ],
    ],
  },
] as const;
export const services: Service[] = [
  {
    slug: "nettoyage-maison-appartement",
    title: "Nettoyage de maisons et appartements",
    short: "Un intérieur à la hauteur de votre quotidien.",
    audience: "Particuliers",
    intro:
      "Du séjour aux pièces d’eau, l’entretien de votre logement se construit autour de vos habitudes, de vos matériaux et des espaces qui comptent pour vous. À Saint-Germain-en-Laye, Éclanora définit avec vous un périmètre précis avant toute intervention.",
    included: [
      "Dépoussiérage des surfaces accessibles",
      "Aspiration et lavage des sols adaptés aux matériaux",
      "Nettoyage des sanitaires et de la cuisine",
      "Finitions sur les points de contact",
    ],
    excluded: [
      "Travaux en hauteur et accès dangereux",
      "Traitement des nuisibles ou déchets dangereux",
      "Restauration des matériaux et débarras",
    ],
    benefit:
      "Un entretien pensé pour votre lieu de vie, sans intervenir sur les espaces ou objets exclus du devis.",
    faq: [
      [
        "Dois-je fournir les produits ?",
        "Les produits et le matériel sont convenus au devis, en tenant compte des surfaces et de vos préférences.",
      ],
      [
        "Puis-je rester chez moi ?",
        "Oui. Les accès et l’ordre de passage peuvent être organisés avec vous.",
      ],
    ],
  },
  {
    slug: "menage-regulier",
    title: "Ménage régulier à domicile",
    short: "La sérénité d’un intérieur entretenu.",
    audience: "Particuliers",
    intro:
      "Un passage régulier permet d’éviter l’accumulation et de retrouver un logement agréable au fil des semaines. Nous définissons une liste de tâches, une fréquence et une organisation adaptées à votre rythme.",
    included: [
      "Plan d’entretien par pièce",
      "Entretien courant des sols et surfaces",
      "Rotation des tâches approfondies prévues au devis",
      "Ajustement du périmètre lors des échanges",
    ],
    excluded: [
      "Disponibilité permanente ou astreinte",
      "Tâches supplémentaires sans accord",
      "Garde d’enfants et aide à la personne",
    ],
    benefit:
      "Des priorités claires et un cadre récurrent pour faciliter votre organisation.",
    faq: [
      [
        "Quelle fréquence choisir ?",
        "Le nombre d’occupants, la surface et vos attentes orientent le choix entre un passage hebdomadaire ou une autre fréquence.",
      ],
      [
        "Comment reporter une intervention ?",
        "Les modalités et délais de report seront précisés dans le devis et les conditions contractuelles avant engagement.",
      ],
    ],
  },
  {
    slug: "nettoyage-ponctuel",
    title: "Nettoyage ponctuel et approfondi",
    short: "Un nouveau souffle pour votre intérieur.",
    audience: "Particuliers",
    intro:
      "Avant de recevoir, au changement de saison ou après une période chargée, une intervention ponctuelle permet de reprendre les zones qui demandent davantage d’attention. Le niveau d’encrassement et l’accessibilité sont évalués avant chiffrage.",
    included: [
      "Repérage des zones prioritaires",
      "Nettoyage approfondi des pièces convenues",
      "Détartrage compatible avec les matériaux",
      "Finitions et vérification du périmètre",
    ],
    excluded: [
      "Remise en état après sinistre",
      "Décontamination ou insalubrité",
      "Décapage industriel et gravats",
    ],
    benefit:
      "Une intervention ciblée sur votre besoin du moment, avec des limites connues à l’avance.",
    faq: [
      [
        "Combien de temps prévoir ?",
        "La durée dépend de l’état réel des lieux et des tâches retenues. Une surface seule ne suffit pas à établir une durée fiable.",
      ],
      [
        "Les vitres sont-elles incluses ?",
        "Uniquement si leur nettoyage et leurs conditions d’accès figurent dans le devis.",
      ],
    ],
  },
  {
    slug: "nettoyage-bureaux",
    title: "Nettoyage de bureaux et locaux professionnels",
    short: "Des espaces soignés, pour mieux travailler.",
    audience: "Professionnels",
    intro:
      "L’entretien de bureaux doit concilier qualité des espaces et continuité de votre activité. Éclanora prépare un cahier des tâches selon vos usages, vos contraintes d’accès et les zones de circulation.",
    included: [
      "Entretien des postes dégagés et surfaces accessibles",
      "Aspiration et lavage des sols",
      "Nettoyage des sanitaires et espaces de pause",
      "Gestion des corbeilles selon les consignes du site",
    ],
    excluded: [
      "Manipulation de documents confidentiels",
      "Nettoyage de matériel informatique interne",
      "Milieux médicaux ou protocoles spécialisés",
    ],
    benefit:
      "Un périmètre documenté et des horaires à convenir selon vos contraintes. Ces prestations sont hors SAP.",
    faq: [
      [
        "Intervenez-vous en dehors des heures de bureau ?",
        "Les créneaux sont convenus après étude des accès et des disponibilités.",
      ],
      [
        "Le crédit d’impôt s’applique-t-il ?",
        "Non. Les prestations de nettoyage de locaux professionnels ne relèvent pas du ménage au domicile des particuliers.",
      ],
    ],
  },
  {
    slug: "nettoyage-coproprietes",
    title: "Entretien des copropriétés et parties communes",
    short: "Une belle impression, dès le premier pas.",
    audience: "Syndics & copropriétés",
    intro:
      "Hall, escaliers et paliers contribuent au confort de l’immeuble. Le plan d’entretien est défini avec le syndic ou le représentant habilité, selon le passage et les particularités de la résidence.",
    included: [
      "Nettoyage du hall et des paliers",
      "Entretien des escaliers accessibles",
      "Essuyage des rampes et points de contact",
      "Signalement des anomalies visibles au référent",
    ],
    excluded: [
      "Maintenance et réparation de l’immeuble",
      "Gestion des déchets non prévue au contrat",
      "Travaux sur façade ou accès en hauteur",
    ],
    benefit:
      "Une organisation lisible pour le référent de l’immeuble. Les parties communes sont hors SAP.",
    faq: [
      [
        "Qui définit la fréquence ?",
        "Le syndic ou le représentant habilité valide le cahier des charges et la fréquence proposée.",
      ],
      [
        "Les consommables sont-ils compris ?",
        "Le devis précise les fournitures, le matériel et les éventuels consommables inclus.",
      ],
    ],
  },
  {
    slug: "nettoyage-fin-de-location",
    title: "Nettoyage de fin de location",
    short: "Quitter les lieux avec soin.",
    audience: "Particuliers & bailleurs",
    intro:
      "Un logement vide facilite le nettoyage avant une restitution ou une nouvelle occupation. Nous évaluons les pièces, l’état des équipements et les accès pour préciser ce qui peut être réalisé.",
    included: [
      "Nettoyage des sols et surfaces accessibles",
      "Cuisine et sanitaires selon état constaté",
      "Placards vides si prévus au devis",
      "Liste des tâches convenue avant passage",
    ],
    excluded: [
      "Garantie de restitution du dépôt de garantie",
      "Réparations et remise en peinture",
      "Enlèvement de mobilier et déchets volumineux",
    ],
    benefit:
      "Un logement nettoyé dans un périmètre défini. L’intervention ne remplace pas l’état des lieux et ne garantit pas son résultat.",
    faq: [
      [
        "Est-ce une prestation SAP ?",
        "L’éligibilité dépend de la situation réelle, du domicile et du cadre de la prestation. Aucun avantage fiscal n’est promis pour cette offre.",
      ],
      [
        "Le logement doit-il être vide ?",
        "C’est préférable. Les meubles ou effets restants et leur incidence sont à signaler avant le devis.",
      ],
    ],
  },
];
export const generalFaq: [string, string][] = [
  [
    "Comment obtenir un devis ?",
    "Décrivez votre besoin dans le formulaire. La surface, la fréquence et les contraintes d’accès permettent de préparer les échanges et un devis gratuit.",
  ],
  [
    "Où intervenez-vous ?",
    "Éclanora est basée à Saint-Germain-en-Laye. Toute demande dans une commune voisine fait l’objet d’une confirmation de faisabilité avant engagement.",
  ],
  [
    "Proposez-vous le crédit d’impôt ?",
    "La déclaration SAP n’est pas confirmée à ce jour. Aucun crédit d’impôt ni Avance immédiate n’est présenté comme acquis.",
  ],
  [
    "Le devis m’engage-t-il ?",
    "La demande en ligne ne constitue ni une commande ni une réservation. Une prestation ne débute qu’après accord sur le devis et les conditions applicables.",
  ],
];
export const articles = [
  {
    slug: "choisir-entreprise-nettoyage-saint-germain-en-laye",
    title:
      "Comment choisir une entreprise de nettoyage à Saint-Germain-en-Laye ?",
    lead: "Les bons critères pour choisir un service adapté à votre logement ou à vos locaux.",
    sections: [
      [
        "Commencez par un besoin précis",
        "Listez les pièces, surfaces délicates, contraintes d’accès et tâches attendues. Une liste concrète aide à comparer les propositions sur un même périmètre.",
      ],
      [
        "Comparez le contenu du devis",
        "Vérifiez la durée ou le forfait, les fournitures, les déplacements, la fréquence et les exclusions. Le tarif seul ne permet pas de comparer deux interventions différentes.",
      ],
      [
        "Vérifiez les informations de l’entreprise",
        "Consultez les mentions légales et demandez les justificatifs utiles. Un avis client doit être authentique et contextualisé ; une promesse générale ne remplace pas un engagement écrit.",
      ],
    ],
  },
  {
    slug: "prix-menage-yvelines",
    title: "Quel est le prix d’un ménage à domicile dans les Yvelines ?",
    lead: "Comprendre les éléments d’un prix avant de comparer des devis.",
    sections: [
      [
        "La surface ne fait pas tout",
        "L’état des lieux, la densité du mobilier, les surfaces fragiles et les tâches souhaitées influencent le temps nécessaire. Décrivez ces éléments au prestataire.",
      ],
      [
        "Horaire ou forfait",
        "Un devis horaire précise le taux et le temps prévu ; un forfait décrit le résultat et le périmètre convenus. Identifiez aussi les fournitures et frais éventuels.",
      ],
      [
        "Le prix Éclanora",
        "Les tarifs sont actuellement sur devis. Le tarif de référence envisagé n’est pas encore validé pour publication. Aucun coût après avantage fiscal n’est affiché tant que les conditions SAP ne sont pas confirmées.",
      ],
    ],
  },
  {
    slug: "nettoyage-regulier-ou-ponctuel",
    title: "Nettoyage régulier ou ponctuel : que choisir ?",
    lead: "Deux organisations qui répondent à des besoins différents.",
    sections: [
      [
        "Le régulier pour l’entretien courant",
        "Une fréquence adaptée limite l’accumulation. Prévoyez une liste stable et une rotation des tâches pour les zones moins sollicitées.",
      ],
      [
        "Le ponctuel pour une étape précise",
        "Un grand nettoyage est utile lors d’un changement de saison ou avant de recevoir. Son périmètre doit être plus détaillé si les surfaces sont très encrassées.",
      ],
      [
        "Combiner les deux",
        "Une remise à niveau ponctuelle peut précéder un entretien récurrent. Faites distinguer ces étapes dans le devis pour connaître leur coût et leur organisation.",
      ],
    ],
  },
  {
    slug: "credit-impot-menage-domicile",
    title:
      "Comment fonctionne le crédit d’impôt de 50 % pour le ménage à domicile ?",
    lead: "Une information générale, sous réserve des conditions légales et de votre situation.",
    sections: [
      [
        "Un cadre réservé aux prestations éligibles",
        "L’entretien de la maison peut relever des services à la personne lorsque les conditions sont remplies. Le nettoyage de bureaux et des parties communes n’en relève pas.",
      ],
      [
        "Un avantage soumis à conditions",
        "Le dispositif porte sur les dépenses effectivement supportées, selon les plafonds et conditions applicables. Les aides doivent être prises en compte. Vérifiez votre situation sur les sources officielles avant tout calcul.",
      ],
      [
        "La situation d’Éclanora",
        "Le numéro SAP n’est pas fourni et la déclaration n’est pas confirmée. Éclanora ne promet donc aucun avantage fiscal. L’Avance immédiate est un dispositif distinct et n’est pas activée.",
      ],
    ],
  },
  {
    slug: "entretien-parties-communes",
    title:
      "Comment organiser l’entretien des parties communes d’une copropriété ?",
    lead: "Un cahier des charges clair facilite le suivi entre syndic et prestataire.",
    sections: [
      [
        "Cartographier les espaces",
        "Distinguez hall, paliers, escaliers, vitrages accessibles et locaux annexes. Précisez les matériaux et les contraintes de circulation.",
      ],
      [
        "Définir une fréquence réaliste",
        "Le passage des occupants et l’exposition aux salissures déterminent les priorités. Prévoyez comment ajuster le calendrier en cas de besoin.",
      ],
      [
        "Organiser le suivi",
        "Désignez un référent habilité, définissez les accès et conservez le cahier des tâches. Séparez l’entretien courant de la maintenance et des interventions exceptionnelles.",
      ],
    ],
  },
];
