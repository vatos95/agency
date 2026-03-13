export type DashboardView =
  | "overview"
  | "messages"
  | "missions"
  | "clients"
  | "profile";

export type MissionStatus =
  | "new"
  | "active"
  | "delivery_due"
  | "revision"
  | "validated";

export interface DesignerStat {
  title: string;
  value: string;
  change: string;
  trend: "positive" | "negative" | "neutral";
}

export interface MessageItem {
  id: string;
  missionId: string;
  client: string;
  clientId?: string | null;
  sender: string;
  subject: string;
  preview: string;
  body: string;
  status: "Nouveau" | "En attente" | "Reponse requise" | "Archive";
  urgency: "Normale" | "Aujourd'hui" | "Prioritaire";
  deadline: string;
  deadlineAt?: string | null;
  budget: string;
  deliverables: string[];
}

export interface MissionItem {
  id: string;
  client: string;
  clientId?: string;
  mentorId?: string;
  title: string;
  status: MissionStatus;
  objective: string;
  deadline: string;
  deadlineAt?: string | null;
  budget: string;
  note: string;
  deliverables: string[];
  expectations: string[];
  figmaLink: string;
  deliverySubject: string;
  deliveryBody: string;
  feedback: Array<{
    title: string;
    body: string;
    date: string;
  }>;
}

export interface ClientItem {
  id?: string;
  name: string;
  sector: string;
  tone: string;
  expectationLevel: string;
  summary: string;
  expectations: string[];
}

export interface ActivityItem {
  title: string;
  description: string;
  date: string;
}

export interface ProgressPoint {
  day: string;
  value: number;
  isHighlight?: boolean;
}

export type CareerStageKey =
  | "junior"
  | "confirmed"
  | "premium"
  | "studio"
  | "agency";

export type ClientTierKey =
  | "local"
  | "growth"
  | "premium"
  | "signature"
  | "prestige";

export interface CareerStage {
  key: CareerStageKey;
  title: string;
  shortLabel: string;
  unlocks: string;
  minBalance: number;
  minReputation: number;
}

export interface ClientTier {
  key: ClientTierKey;
  title: string;
  description: string;
}

export interface ProgressDriver {
  title: string;
  description: string;
}

export const navigationLabels: Record<DashboardView, string> = {
  overview: "Accueil",
  messages: "Messages",
  missions: "Missions",
  clients: "Clients",
  profile: "Profil",
};

export const welcomeSummary = {
  userName: "Leandre",
  role: "Designer junior",
  summary: "2 missions actives, 1 retour client a traiter et 1 livraison a finaliser aujourd'hui.",
};

export const designerStats: DesignerStat[] = [
  {
    title: "Solde",
    value: "$1,240",
    change: "Derniere mission +$160",
    trend: "positive",
  },
  {
    title: "Reputation",
    value: "61 / 100",
    change: "Bonne tenue sur les 3 derniers retours",
    trend: "positive",
  },
  {
    title: "Missions terminees",
    value: "4",
    change: "5 livraisons dans le rythme",
    trend: "positive",
  },
  {
    title: "Taux de validation",
    value: "84%",
    change: "Moyenne client actuelle",
    trend: "positive",
  },
];

export const lastUpdated = "13 Mar 2026";

export const activityFeed: ActivityItem[] = [
  {
    title: "Brava Coffee",
    description: "Mission hero recue, livraison attendue sous 24h.",
    date: "Aujourd'hui",
  },
  {
    title: "Bloom Therapy",
    description: "Bloc CTA en cours de conception, pas de retour bloqueur.",
    date: "Aujourd'hui",
  },
  {
    title: "VoltWear",
    description: "Retour client recu, une nouvelle piste est demandee.",
    date: "Hier",
  },
];

export const messages: MessageItem[] = [
  {
    id: "msg-1",
    missionId: "mission-1",
    client: "Brava Coffee",
    sender: "Maya Rocha",
    subject: "Proposition hero section - Brava Coffee",
    preview: "Nous avons besoin d'une hero section chaleureuse, premium et rassurante.",
    body:
      "Bonjour Leandre,\n\nNous preparons le lancement de Brava Coffee, une marque de cafe premium en livraison.\nNous avons besoin d'une hero section pour notre page d'accueil.\nNous voulons quelque chose de chaleureux, premium et rassurant.\nMerci de nous faire une premiere proposition sous 24h.\n\nBien a vous,\nMaya",
    status: "Nouveau",
    urgency: "Prioritaire",
    deadline: "Sous 24h",
    budget: "$250",
    deliverables: ["Hero desktop", "CTA secondaire", "Mail de livraison"],
  },
  {
    id: "msg-2",
    missionId: "mission-2",
    client: "Bloom Therapy",
    sender: "Nora Vidal",
    subject: "Besoin d'un bloc CTA",
    preview: "Nous cherchons une section calme et rassurante pour un premier rendez-vous.",
    body:
      "Bonjour,\n\nNous cherchons un bloc d'appel a l'action pour inviter les visiteurs a prendre un premier rendez-vous.\nL'interface doit inspirer confiance, calme et accompagnement.\nNous aimerions un rendu simple et humain.\n\nMerci,\nNora",
    status: "En attente",
    urgency: "Normale",
    deadline: "Sous 48h",
    budget: "$180",
    deliverables: ["Section CTA", "Version mobile", "Mail de livraison"],
  },
  {
    id: "msg-3",
    missionId: "mission-3",
    client: "VoltWear",
    sender: "Axel Kim",
    subject: "Retour sur la hero capsule",
    preview: "La base est bonne mais la direction reste trop sage pour notre univers.",
    body:
      "Salut,\n\nMerci pour ton envoi. La base fonctionne, mais la direction nous semble encore trop sage.\nNous aimerions une piste plus editoriale, plus mode et plus desiree.\nMerci de revenir vers nous avec une version revue.\n\nAxel",
    status: "Reponse requise",
    urgency: "Aujourd'hui",
    deadline: "Revision sous 24h",
    budget: "$320",
    deliverables: ["Hero revisee", "Nouveau slogan", "Mail de livraison revise"],
  },
  {
    id: "msg-4",
    missionId: "mission-4",
    client: "Kinetik Studio",
    sender: "Sarah Blue",
    subject: "Validation pricing card",
    preview: "La proposition est validee, la lecture de l'offre est tres claire.",
    body:
      "Bonjour,\n\nMerci pour ta proposition. Le rendu est coherent avec notre demande et la lecture de l'offre est tres claire.\nNous validons cette version.\n\nSarah",
    status: "Archive",
    urgency: "Normale",
    deadline: "Cloture",
    budget: "$160",
    deliverables: ["Pricing card", "Etat hover", "Mail de livraison"],
  },
];

export const missions: MissionItem[] = [
  {
    id: "mission-1",
    client: "Brava Coffee",
    title: "Hero section lancement marque",
    status: "delivery_due",
    objective:
      "Concevoir une hero section desktop chaleureuse, premium et rassurante pour le lancement de la marque.",
    deadline: "Sous 24h",
    budget: "$250",
    note: "Ajouter un CTA secondaire rassurant pour les nouveaux visiteurs.",
    deliverables: ["Hero desktop", "CTA secondaire", "Mail de livraison"],
    expectations: [
      "Promesse comprise en moins de 5 secondes",
      "Visuel principal utile a la marque",
      "Direction premium mais accessible",
    ],
    figmaLink: "",
    deliverySubject: "Livraison mission - Brava Coffee",
    deliveryBody:
      "Bonjour,\n\nVeuillez trouver ci-joint ma proposition pour la hero section demandee.\nJ'ai cherche a mettre l'accent sur la chaleur de marque, la clarte du message principal et un CTA rassurant.\n\nLien Figma :\n\nJe reste disponible si vous souhaitez des ajustements.\n\nCordialement,\nLeandre",
    feedback: [
      {
        title: "Contexte client",
        body: "Le client veut une proposition premium mais tres lisible. Eviter toute direction trop froide ou trop generique.",
        date: "Aujourd'hui",
      },
    ],
  },
  {
    id: "mission-2",
    client: "Bloom Therapy",
    title: "Bloc CTA prise de rendez-vous",
    status: "active",
    objective:
      "Designer une section CTA qui donne envie de prendre un premier rendez-vous sans generer de stress.",
    deadline: "Sous 48h",
    budget: "$180",
    note: "Une version mobile propre est attendue si possible.",
    deliverables: ["Section CTA", "Version mobile", "Mail de livraison"],
    expectations: [
      "Tonalite douce et credible",
      "CTA visible sans agressivite",
      "Lecture tres simple sur mobile",
    ],
    figmaLink: "",
    deliverySubject: "Livraison mission - Bloom Therapy",
    deliveryBody:
      "Bonjour,\n\nVeuillez trouver ma proposition pour le bloc CTA.\nJ'ai travaille une direction simple et rassurante afin de valoriser le premier rendez-vous.\n\nLien Figma :\n\nJe reste disponible pour ajustements.\n\nCordialement,\nLeandre",
    feedback: [
      {
        title: "Mission en cours",
        body: "Prioriser la confiance et eviter les codes trop medicaux.",
        date: "Aujourd'hui",
      },
    ],
  },
  {
    id: "mission-3",
    client: "VoltWear",
    title: "Hero capsule a reviser",
    status: "revision",
    objective:
      "Proposer une hero plus editoriale et plus desiree pour une capsule streetwear tech.",
    deadline: "Revision sous 24h",
    budget: "$320",
    note: "Le slogan et la tension visuelle doivent etre revus.",
    deliverables: ["Hero revisee", "Nouveau slogan", "Mail de livraison revise"],
    expectations: [
      "Direction moins sage",
      "Typographie plus assumee",
      "Message principal plus memorisable",
    ],
    figmaLink: "https://www.figma.com/file/example-voltwear",
    deliverySubject: "Livraison mission - VoltWear",
    deliveryBody:
      "Bonjour,\n\nVoici une seconde piste pour la hero VoltWear. J'ai renforce l'approche mode, le contraste editorial et la desirabilite du message.\n\nLien Figma : https://www.figma.com/file/example-voltwear\n\nCordialement,\nLeandre",
    feedback: [
      {
        title: "Retour client",
        body: "La base fonctionne, mais la direction manque encore de tension editoriale.",
        date: "Hier",
      },
    ],
  },
  {
    id: "mission-4",
    client: "Kinetik Studio",
    title: "Pricing card premium",
    status: "validated",
    objective:
      "Presenter l'abonnement premium dans une carte ultra lisible et energique.",
    deadline: "Cloturee",
    budget: "$160",
    note: "Mission terminee et validee.",
    deliverables: ["Pricing card", "Etat hover", "Mail de livraison"],
    expectations: [
      "Offre comprise tres rapidement",
      "Bonne hierarchie prix / benefices / CTA",
      "Ton sportif sans bruit visuel",
    ],
    figmaLink: "https://www.figma.com/file/example-kinetik",
    deliverySubject: "Livraison mission - Kinetik Studio",
    deliveryBody:
      "Bonjour,\n\nVeuillez trouver ma proposition pour la pricing card premium.\nJ'ai travaille la lisibilite du prix, des benefices et du CTA.\n\nLien Figma : https://www.figma.com/file/example-kinetik\n\nCordialement,\nLeandre",
    feedback: [
      {
        title: "Validation",
        body: "Mission validee. La lecture de l'offre est tres claire.",
        date: "Cette semaine",
      },
    ],
  },
];

export const clients: ClientItem[] = [
  {
    name: "Brava Coffee",
    sector: "Food delivery",
    tone: "Warm premium",
    expectationLevel: "Intermediaire",
    summary:
      "Marque de cafe premium en livraison. Elle attend une proposition sensorielle, claire et rassurante.",
    expectations: ["Chaleur de marque", "Visuel utile", "Promesse claire"],
  },
  {
    name: "Bloom Therapy",
    sector: "Health tech",
    tone: "Soft trust",
    expectationLevel: "Intermediaire",
    summary:
      "Service de therapie en ligne. Le ton doit rester humain, credible et apaisant.",
    expectations: ["Douceur", "Confiance", "Lisibilite mobile"],
  },
  {
    name: "VoltWear",
    sector: "Fashion",
    tone: "Editorial impact",
    expectationLevel: "Eleve",
    summary:
      "Marque streetwear tech qui attend des partis pris plus forts et une execution plus mode.",
    expectations: ["Direction editoriale", "Desir", "Tension visuelle"],
  },
  {
    name: "Kinetik Studio",
    sector: "Fitness",
    tone: "Sport sharp",
    expectationLevel: "Accessible",
    summary:
      "Salle de sport moderne. Les interfaces doivent etre dynamiques, directes et faciles a scanner.",
    expectations: ["Lisibilite", "Energie", "CTA rapide"],
  },
  {
    name: "Maison Lune",
    sector: "Interior",
    tone: "Quiet luxury",
    expectationLevel: "Eleve",
    summary:
      "Marque de decoration haut de gamme. Elle attend du calme, de la respiration et une vraie precision visuelle.",
    expectations: ["Sobriete", "Respiration", "Details premium"],
  },
];

export const progressChartData: ProgressPoint[] = [
  { day: "Mon", value: 52 },
  { day: "Tue", value: 57 },
  { day: "Wed", value: 64 },
  { day: "Thu", value: 61 },
  { day: "Fri", value: 68, isHighlight: true },
  { day: "Sat", value: 66 },
];

export const careerStages: CareerStage[] = [
  {
    key: "junior",
    title: "Designer junior",
    shortLabel: "Junior",
    unlocks: "Petits briefs et clients locaux",
    minBalance: 0,
    minReputation: 0,
  },
  {
    key: "confirmed",
    title: "Freelance confirme",
    shortLabel: "Confirme",
    unlocks: "Marques en croissance et missions plus longues",
    minBalance: 500,
    minReputation: 45,
  },
  {
    key: "premium",
    title: "Designer premium",
    shortLabel: "Premium",
    unlocks: "Clients premium et projets signatures",
    minBalance: 1200,
    minReputation: 70,
  },
  {
    key: "studio",
    title: "Studio independant",
    shortLabel: "Studio",
    unlocks: "Plusieurs missions premium en parallele",
    minBalance: 2500,
    minReputation: 95,
  },
  {
    key: "agency",
    title: "Agence creative",
    shortLabel: "Agence",
    unlocks: "Comptes prestige et gros projets recurrents",
    minBalance: 5000,
    minReputation: 120,
  },
];

export const clientTiers: ClientTier[] = [
  {
    key: "local",
    title: "Clients locaux",
    description: "Petits projets simples pour poser les bases.",
  },
  {
    key: "growth",
    title: "Marques en croissance",
    description: "Briefs plus longs, attentes plus structurees.",
  },
  {
    key: "premium",
    title: "Clients premium",
    description: "Direction plus fine, budgets plus confortables.",
  },
  {
    key: "signature",
    title: "Clients signatures",
    description: "Projets visibles avec une exigence editoriale plus forte.",
  },
  {
    key: "prestige",
    title: "Comptes prestige",
    description: "Projets les plus reputes, reserves aux structures solides.",
  },
];

export const profileHighlights = {
  currentStage: "premium" as CareerStageKey,
  nextStage: "studio" as CareerStageKey,
  status: "Designer premium",
  statusSummary:
    "Ton compte commence a attirer des marques plus exigeantes et des budgets plus eleves.",
  nextStatus: "Studio independant",
  nextStatusHint:
    "Encore $1,250 de chiffre et 11 points de reputation pour passer au statut Studio independant.",
  progressValue: 72,
  reputation: "84 / 100",
  balance: "$1,240",
  accessibleClientTiers: ["Clients locaux", "Marques en croissance", "Clients premium"],
};

export const progressDrivers: ProgressDriver[] = [
  {
    title: "Solde",
    description: "$1,240 de gains cumulés sur les missions validées.",
  },
  {
    title: "Reputation",
    description: "84 / 100 de confiance client sur les derniers briefs.",
  },
  {
    title: "Statut",
    description: "Le statut monte quand le solde et la reputation avancent ensemble.",
  },
];
