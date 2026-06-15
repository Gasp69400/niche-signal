import type { Dictionary } from "@/i18n/types";

export const fr: Dictionary = {
  meta: {
    title: "NicheSignal — Trouvez votre prochaine idée SaaS en quelques secondes",
    description:
      "NicheSignal analyse les avis, Reddit et les forums pour identifier des niches SaaS sous-exploitées avec données marché, analyse concurrentielle et scores d'opportunité.",
  },
  nav: {
    features: "Fonctionnalités",
    pricing: "Tarifs",
    blog: "Blog",
    login: "Connexion",
    startFree: "Commencer gratuitement",
    dashboard: "Mes rapports",
    logout: "Déconnexion",
  },
  dashboard: {
    label: "Dashboard",
    title: "Mes rapports",
    subtitle: "Retrouvez et rouvrez toutes vos analyses de niches.",
    searchPlaceholder: "Rechercher une niche…",
    newAnalysis: "Nouvelle analyse →",
    empty: "Aucun rapport pour l'instant. Lancez votre première analyse !",
    noResults: "Aucun rapport ne correspond à votre recherche.",
    selectReport: "Sélectionnez un rapport",
    selectHint: "Choisissez une analyse dans la liste ou lancez-en une nouvelle depuis l'accueil.",
    score: "Score",
    loadError: "Impossible de charger vos rapports.",
    reportError: "Impossible de charger ce rapport.",
  },
  hero: {
    badge: "Live · 10 000+ SaaS analysés",
    titleLine1: "Trouvez votre prochaine",
    titleLine2: "opportunité SaaS",
    subtitle:
      "NicheSignal analyse Reddit, G2 et les forums pour identifier des niches SaaS sous-exploitées — avec données concurrentielles, pain points et score d'opportunité.",
    cta: "Commencer gratuitement",
    demoCta: "Voir une démo live",
    stats: [
      "10k+ SaaS analysés",
      "Mises à jour hebdo",
      "Scoring IA",
    ],
    searchPlaceholder: "Ex : CRM pour freelancers, facturation pour agences...",
    analyze: "Analyser",
    analyzing: "Analyse...",
    loginRequired: "Connectez-vous pour lancer votre première analyse",
    proRequired: "Abonnement Pro requis pour les rapports complets",
  },
  marquee: [
    "Indie Hackers",
    "Product Hunt",
    "Alumni YC",
    "Solo Founders",
    "Analystes VC",
    "Startup Studios",
    "Builders Micro-SaaS",
  ],
  testimonials: [
    {
      initials: "AM",
      quote:
        "J'ai trouvé ma prochaine idée SaaS en 10 minutes. Des semaines de recherche économisées.",
      name: "Alex M.",
      role: "Indie Hacker",
      stat: "3 idées validées",
    },
    {
      initials: "SK",
      quote:
        "Les données concurrentielles valent à elles seules le prix. Je comprends enfin le marché avant de construire.",
      name: "Sarah K.",
      role: "Fondatrice",
      stat: "8 k€ MRR atteints",
    },
    {
      initials: "MD",
      quote:
        "Le score d'opportunité a convaincu mon co-fondateur. On a shipé en 6 semaines.",
      name: "Marc D.",
      role: "Product Manager",
      stat: "1 SaaS lancé",
    },
  ],
  features: {
    sectionLabel: "Ce que vous obtenez",
    title: "Tout ce qu'il faut pour valider une niche",
    subtitle: "De la frustration utilisateur à une décision go / no-go claire.",
    items: [
      {
        title: "Sachez exactement ce que les users détestent",
        description:
          "NicheSignal scanne des milliers d'avis et posts Reddit pour extraire les pain points récurrents de toute catégorie SaaS — classés par volume de mentions.",
        cta: "Explorer l'analyse des pain points →",
      },
      {
        title: "Voyez qui gagne déjà",
        description:
          "Obtenez instantanément les données des SaaS existants : ARR/MRR estimé, année de fondation, note G2, pricing et position marché — US et Europe.",
        cta: "Voir les données concurrentielles →",
      },
      {
        title: "Un score pour trancher",
        description:
          "Notre IA combine signaux de demande, niveau de concurrence et taille de marché en un score d'opportunité unique — pour savoir en secondes si une niche vaut le coup.",
        cta: "Consulter les scores d'opportunité →",
      },
    ],
  },
  mockups: {
    painPoints: "Pain points",
    competitors: "Concurrents",
    arrMrr: "ARR / MRR",
    founded: "Fondé en",
    opportunityScore: "Score d'opportunité",
    marketSize: "Taille du marché",
    competition: "Concurrence",
    moderate: "Modérée",
    topPainPoints: "Top pain points",
    verdict: "Verdict",
    verdictText:
      "Marché attractif avec une concurrence modérée. Angles de différenciation clairs pour une solution ciblée.",
    reportTitle: "CRM pour freelancers — Rapport",
    painPointLabels: [
      "Intégrations complexes",
      "Courbe d'apprentissage longue",
      "Tarification opaque",
    ],
  },
  pricing: {
    title: "Tarifs simples et transparents",
    subtitle: "Commencez gratuitement. Passez Pro quand vous avez besoin de plus.",
    mostPopular: "Le plus populaire",
    free: {
      name: "Gratuit",
      period: "pour toujours",
      features: [
        "2 rapports / jour",
        "Données concurrents basiques",
        "Score d'opportunité",
      ],
      cta: "Commencer gratuitement",
    },
    pro: {
      name: "Pro",
      period: "/mois",
      features: [
        "Rapports illimités",
        "Analyse concurrentielle complète",
        "Estimations MRR / ARR",
        "Données taille de marché",
        "Export PDF",
      ],
      cta: "Passer Pro →",
    },
  },
  finalCta: {
    titleLine1: "Arrêtez de deviner.",
    titleLine2: "Commencez à construire.",
    subtitle:
      "Rejoignez 2 000+ fondateurs qui recherchent plus intelligemment avec NicheSignal.",
    cta: "Essayer gratuitement",
  },
  footer: {
    tagline:
      "Identifiez les niches SaaS sous-exploitées avec une vraie intelligence marché.",
    builtBy: "Conçu par un solo founder 🛠️",
    terms: "Conditions Générales de Vente",
    legalNotice: "Mentions légales",
    columns: {
      product: "Produit",
      resources: "Ressources",
      company: "Entreprise",
      legal: "Légal",
      features: "Fonctionnalités",
      pricing: "Tarifs",
      changelog: "Changelog",
      blog: "Blog",
      about: "À propos",
      contact: "Contact",
      privacy: "Confidentialité",
    },
  },
  auth: {
    loginTitle: "Se connecter",
    signupTitle: "S'inscrire",
    loginSubtitle: "Accédez à vos rapports d'analyse.",
    signupSubtitle: "Créez un compte gratuit en quelques secondes.",
    loginTab: "Se connecter",
    signupTab: "S'inscrire",
    email: "Email",
    password: "Mot de passe",
    emailPlaceholder: "vous@exemple.com",
    loginButton: "Se connecter",
    signupButton: "Créer mon compte",
    loading: "Chargement...",
    noAccount: "Pas encore de compte ?",
    hasAccount: "Déjà un compte ?",
    close: "Fermer",
    confirmEmail:
      "Compte créé ! Vérifiez votre boîte mail et cliquez sur le lien de confirmation, puis reconnectez-vous.",
    loginFailed: "Connexion impossible. Vérifiez vos identifiants ou confirmez votre email.",
  },
  legal: {
    backToSite: "← Retour au site",
    lastUpdated: "Dernière mise à jour",
    cgvTitle: "Conditions Générales de Vente",
    mentionsTitle: "Mentions légales",
  },
};
