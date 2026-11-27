export const company = {
  name: "ÉCLANORA",
  legalStatus: "Entrepreneur individuel (EI)",
  siren: "988 750 956",
  city: "Saint-Germain-en-Laye",
  postalCode: "78100",
  ape: "8121Z",
  civilName: null as string | null,
  siret: null as string | null,
  address: null as string | null,
  email: null as string | null,
  phone: null as string | null,
  publicationDirector: null as string | null,
  rne: null as string | null,
  vatStatus: null as string | null,
  insurance: null as string | null,
  host: null as { name: string; address: string; phone: string } | null,
  mediator: null as { name: string; address: string; url: string } | null,
  retention: null as string | null,
  processors: [] as string[],
  hourlyRate: 30,
  rateConfirmed: false,
  professionalServicesApproved: false,
  SAP_STATUS: "pending" as "undeclared" | "pending" | "registered",
  SAP_DECLARATION_NUMBER: null as string | null,
  SAP_LEGAL_APPROVED: false,
  URSSAF_ADVANCE_IMMEDIATE_ENABLED: false,
  confirmedZones: ["Saint-Germain-en-Laye"],
  prospectiveZones: [
    "Le Vésinet",
    "Le Pecq",
    "Chatou",
    "Croissy-sur-Seine",
    "Chambourcy",
    "Maisons-Laffitte",
    "Marly-le-Roi",
    "Poissy",
  ],
};
export const sapAvailable =
  company.SAP_STATUS === "registered" &&
  !!company.SAP_DECLARATION_NUMBER &&
  company.SAP_LEGAL_APPROVED;
export const siteUrl = process.env.SITE_URL || "http://localhost:3000";
export const published = process.env.PUBLICATION_APPROVED === "true";
export const showProfessionalServices =
  !published || company.professionalServicesApproved;
