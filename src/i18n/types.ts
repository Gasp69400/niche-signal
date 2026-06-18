export interface Dictionary {
  meta: { title: string; description: string };
  nav: {
    features: string;
    pricing: string;
    blog: string;
    login: string;
    startFree: string;
    dashboard: string;
    logout: string;
  };
  dashboard: {
    label: string;
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    newAnalysis: string;
    empty: string;
    emptyFavorites: string;
    noResults: string;
    selectReport: string;
    selectHint: string;
    score: string;
    loadError: string;
    reportError: string;
    tabAll: string;
    tabFavorites: string;
    backToList: string;
    openReport: string;
  };
  favorites: {
    add: string;
    remove: string;
  };
  report: {
    exportPdf: string;
    exportPdfPro: string;
    exportPdfBadge: string;
    exportingPdf: string;
    shareReport: string;
    linkCopied: string;
    save: string;
    savePro: string;
  };
  hero: {
    badge: string;
    titleLine1: string;
    titleLine2: string;
    subtitle: string;
    cta: string;
    demoCta: string;
    stats: [string, string, string];
    searchPlaceholder: string;
    analyze: string;
    analyzing: string;
    loginRequired: string;
    proRequired: string;
    reportReady: string;
    reportReadyHint: string;
    reportSavePending: string;
    retryAnalysis: string;
    viewFullReport: string;
  };
  marquee: string[];
  testimonials: Array<{
    initials: string;
    quote: string;
    name: string;
    role: string;
    stat: string;
  }>;
  features: {
    sectionLabel: string;
    title: string;
    subtitle: string;
    items: Array<{ title: string; description: string; cta: string }>;
  };
  mockups: {
    painPoints: string;
    competitors: string;
    arrMrr: string;
    founded: string;
    opportunityScore: string;
    marketSize: string;
    competition: string;
    moderate: string;
    topPainPoints: string;
    verdict: string;
    verdictText: string;
    reportTitle: string;
    painPointLabels: string[];
  };
  pricing: {
    title: string;
    subtitle: string;
    mostPopular: string;
    free: {
      name: string;
      period: string;
      features: string[];
      cta: string;
    };
    pro: {
      name: string;
      period: string;
      features: string[];
      cta: string;
    };
  };
  finalCta: {
    titleLine1: string;
    titleLine2: string;
    subtitle: string;
    cta: string;
  };
  footer: {
    tagline: string;
    builtBy: string;
    terms: string;
    legalNotice: string;
    columns: {
      product: string;
      resources: string;
      company: string;
      legal: string;
      features: string;
      pricing: string;
      changelog: string;
      blog: string;
      about: string;
      contact: string;
      privacy: string;
    };
  };
  auth: {
    loginTitle: string;
    signupTitle: string;
    loginSubtitle: string;
    signupSubtitle: string;
    loginTab: string;
    signupTab: string;
    email: string;
    password: string;
    emailPlaceholder: string;
    loginButton: string;
    signupButton: string;
    loading: string;
    noAccount: string;
    hasAccount: string;
    close: string;
    confirmEmail: string;
    loginFailed: string;
    forgotPassword: string;
    forgotTitle: string;
    forgotSubtitle: string;
    forgotButton: string;
    forgotSuccess: string;
    backToLogin: string;
    resetTitle: string;
    resetSubtitle: string;
    newPassword: string;
    confirmPassword: string;
    resetButton: string;
    resetSuccess: string;
    resetInvalidLink: string;
    passwordMismatch: string;
  };
  legal: {
    backToSite: string;
    lastUpdated: string;
    cgvTitle: string;
    mentionsTitle: string;
  };
}
