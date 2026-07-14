// Données FAQ partagées entre la page FAQ et le widget QuestionWidget
export const FAQ_SECTIONS = [
  {
    id: 'S1',
    title: 'I. Cadre juridique et organisationnel',
    color: 'navy',
    articles: [
      {
        id: 'S1-1',
        question: '1.1 Textes législatifs de référence',
        keywords: ['loi', 'ordonnance', 'texte', 'référence', 'juridique', '81/002', '2011/011'],
        answer: `L'état civil au Cameroun est régi par deux textes fondamentaux :\n• Ordonnance n° 81/002 du 29 juin 1981\n• Loi n° 2011/011 du 6 mai 2011\n\n📌 Art. 2 : « Les actes de naissance, mariage et décès sont des documents intangibles et définitifs. »\n📌 Art. 4 : Tout Camerounais est tenu de déclarer naissances, décès et mariages sous peine des sanctions de l'art. 370 du Code pénal.`,
      },
      {
        id: 'S1-2',
        question: '1.2 Organe en charge de l\'état civil (BUNEC)',
        keywords: ['bunec', 'minat', 'organe', 'administration', 'supervision'],
        answer: `Le Bureau National de l'État Civil (BUNEC), sous tutelle du MINAT, supervise et normalise l'état civil au Cameroun. Il définit les spécimens officiels et centralise les données démographiques.`,
      },
      {
        id: 'S1-3',
        question: '1.3 Qui sont les officiers d\'état civil ?',
        keywords: ['officier', 'maire', 'adjoint', 'délégué', 'consul'],
        answer: `Sont officiers d'état civil : les Délégués du Gouvernement, les Maires et leurs adjoints, les chefs de missions diplomatiques, et toute personne désignée par le Ministre pour les centres secondaires.`,
      },
    ],
  },
  {
    id: 'S2',
    title: 'II. L\'acte de naissance',
    color: 'teal',
    articles: [
      {
        id: 'S2-1',
        question: '2.1 Compétence territoriale',
        keywords: ['lieu', 'naissance', 'territoire', 'compétence', 'centre'],
        answer: `L'acte de naissance est établi au lieu de naissance de l'enfant. Un enfant né à Dschang doit être déclaré au centre d'état civil de Dschang.`,
      },
      {
        id: 'S2-2',
        question: '2.2 Qui peut déclarer une naissance ?',
        keywords: ['déclarer', 'déclarant', 'hôpital', 'maternité', 'parent', 'communauté'],
        answer: `La déclaration peut être faite par : l'établissement de santé (chef d'établissement, médecin), toute personne ayant connaissance de la naissance, ou les parents (délai supplémentaire de 15 jours).`,
      },
      {
        id: 'S2-3',
        question: '2.3 Délais légaux de déclaration',
        keywords: ['délai', 'jour', '30', '90', 'domicile', 'hôpital', 'tardif'],
        answer: `• Naissance en établissement de santé : 30 jours\n• Naissance à domicile : 90 jours\n• Délai complémentaire parents : +15 jours\n• Après 6 mois : jugement supplétif obligatoire`,
        isTable: true,
      },
      {
        id: 'S2-4',
        question: '2.4 Pièces requises — Parents mariés',
        keywords: ['pièce', 'document', 'mariage', 'cni', 'certificat', 'fournir'],
        answer: `• Acte de mariage (original ou copie certifiée conforme)\n• CNI de chacun des parents\n• Bulletin de naissance / certificat d'accouchement\n• Déclaration de naissance (spécimen BUNEC)`,
      },
      {
        id: 'S2-5',
        question: '2.5 Enfant né hors mariage',
        keywords: ['hors mariage', 'reconnaissance', 'père', 'mère', 'filiation', 'témoin'],
        answer: `Procédure de reconnaissance préalable obligatoire. Le père déclare devant l'officier d'état civil en présence de la mère et deux témoins. Pièces : CNI du père et de la mère + deux témoins avec CNI.`,
      },
      {
        id: 'S2-6',
        question: '2.6 Enfant non déclaré après 90 jours',
        keywords: ['tardif', 'jugement', 'supplétif', 'cniec', 'tribunal', 'grosse'],
        answer: `1. La mairie délivre un CNIEC (Certificat de Non Inscription)\n2. Saisine du Tribunal de Première Instance\n3. Jugement supplétif rendu\n4. Grosse du jugement → acte établi par l'officier d'état civil`,
      },
    ],
  },
  {
    id: 'S3',
    title: 'III. L\'acte de décès',
    color: 'coral',
    articles: [
      {
        id: 'S3-1',
        question: '3.1 Importance de l\'acte de décès',
        keywords: ['décès', 'succession', 'pension', 'assurance', 'remariage', 'importance'],
        answer: `L'acte de décès conditionne : l'ouverture des successions, la liquidation des droits sociaux, le remariage du conjoint survivant, et la radiation des fichiers électoraux.`,
      },
      {
        id: 'S3-2',
        question: '3.2 Compétence territoriale décès',
        keywords: ['décès', 'lieu', 'domicile', 'inhumation', 'compétence'],
        answer: `L'acte peut être établi au lieu de : survenance du décès, domicile du défunt, inhumation, ou naissance du défunt.`,
      },
      {
        id: 'S3-3',
        question: '3.3 Délai de déclaration du décès',
        keywords: ['délai', 'décès', '90 jours', 'déclarer'],
        answer: `Le délai est de 90 jours à compter du décès (Loi 2011/011). L'ancienne ordonnance prévoyait 1 mois.`,
      },
      {
        id: 'S3-4',
        question: '3.4 Qui peut déclarer un décès ?',
        keywords: ['déclarant', 'famille', 'hôpital', 'police', 'ojp', 'pénitentiaire'],
        answer: `• Famille / proche : déclaration + 2 témoins avec CNI\n• Établissement de santé : chef d'établissement + CNI défunt + certificat médical\n• OPJ (corps identifié) : déclaration + CNI défunt\n• Établissement pénitentiaire : chef d'établissement`,
      },
    ],
  },
  {
    id: 'S4',
    title: 'IV. Dispositions particulières',
    color: 'gold',
    articles: [
      {
        id: 'S4-1',
        question: '4.1 Rectification d\'actes',
        keywords: ['rectification', 'erreur', 'correction', 'modification', 'tribunal'],
        answer: `Saisine du Président du TPI compétent. Communication au Procureur. Ordonnance de rectification → mise à jour du registre par l'officier d'état civil.`,
      },
      {
        id: 'S4-2',
        question: '4.2 Double acte de naissance',
        keywords: ['double', 'doublon', 'deux actes', 'plus ancien'],
        answer: `Seul l'acte le plus ancien en date est retenu. Des poursuites pénales peuvent s'ensuivre.`,
      },
      {
        id: 'S4-3',
        question: '4.4 Gratuité de l\'inscription',
        keywords: ['gratuit', 'coût', 'prix', 'frais', 'timbre', 'droit'],
        answer: `L'inscription d'un acte est gratuite. Seule la délivrance d'une copie/extrait donne lieu à un droit fixé par le Code de l'Enregistrement.`,
      },
      {
        id: 'S4-4',
        question: '4.5 Sanctions pénales — Officiers d\'état civil',
        keywords: ['sanction', 'peine', 'pénal', 'officier', 'art. 151'],
        answer: `Art. 151 du Code pénal punit l'officier qui : omet de transcrire, célèbre un mariage hors compétence territoriale, ou porte des mentions non prévues par la loi.`,
      },
    ],
  },
  {
    id: 'S5',
    title: 'V. Apport du système IDENTICA',
    color: 'teal',
    articles: [
      {
        id: 'S5-1',
        question: '5.1 Problèmes résolus par IDENTICA',
        keywords: ['identica', 'numérique', 'digital', 'délai', 'traçabilité'],
        answer: `• Signature numérique du Maire à distance\n• Transmission automatique hôpital → mairie\n• Portail de suivi pour le citoyen\n• Archivage numérique certifié\n• Géolocalisation du centre compétent`,
      },
      {
        id: 'S5-2',
        question: '5.2 Valeur probante des actes numériques',
        keywords: ['numérique', 'probant', 'juridique', 'valeur', 'scan', 'signature'],
        answer: `Deux modalités : signature numérique directe par l'officier, ou scan de l'acte physique archivé avec horodatage. La version numérique fait foi pour toute délivrance ultérieure.`,
      },
    ],
  },
]

/**
 * Recherche des articles FAQ par pertinence de mots-clés
 * @param {string} query
 * @returns {Array} articles triés par pertinence (max 4)
 */
export function searchFAQ(query) {
  if (!query || !query.trim()) return []
  const words = query.toLowerCase().trim().split(/\s+/)

  const scored = []
  for (const section of FAQ_SECTIONS) {
    for (const article of section.articles) {
      let score = 0
      const searchTarget = (article.question + ' ' + article.answer + ' ' + (article.keywords || []).join(' ')).toLowerCase()
      for (const word of words) {
        if (word.length < 3) continue
        // Bonus pour les mots-clés dédiés
        if (article.keywords?.some(k => k.toLowerCase().includes(word))) score += 3
        // Points pour le titre
        if (article.question.toLowerCase().includes(word)) score += 2
        // Points pour la réponse
        const count = (searchTarget.match(new RegExp(word, 'g')) || []).length
        score += count
      }
      if (score > 0) scored.push({ article, section, score })
    }
  }

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map(({ article, section }) => ({ ...article, sectionTitle: section.title }))
}
