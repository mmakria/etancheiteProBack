export function getLogoUrl(frontendUrl: string): string {
  return `${frontendUrl}/logo_makria.png`
}

export interface TimelineStep {
  label: string
  status: 'completed' | 'current' | 'upcoming'
  number: number
}

export function getProcessTimeline(currentStep: number): TimelineStep[] {
  const steps = [
    { label: 'Demande enregistrée', number: 1 },
    { label: 'Diagnostic planifié', number: 2 },
    { label: 'Rapport & solutions', number: 3 },
  ]

  return steps.map((step) => ({
    ...step,
    status:
      step.number < currentStep
        ? ('completed' as const)
        : step.number === currentStep
          ? ('current' as const)
          : ('upcoming' as const),
  }))
}

export interface PrecautionaryMeasure {
  icon: string
  text: string
}

/**
 * Advanced version: context-aware precautions based on severity x leak type
 */
export function getPrecautionaryMeasures(
  severity: string,
  leakType?: string
): PrecautionaryMeasure[] {
  const measures: PrecautionaryMeasure[] = []

  // Severity-based measures
  if (severity === 'emergency' || severity === 'severe') {
    measures.push({
      icon: '🚨',
      text: "Éloignez vos affaires des zones d'infiltration visibles pour limiter les dommages.",
    })
    measures.push({
      icon: '⚡',
      text: "En cas d'infiltration près d'installations électriques, coupez le courant au disjoncteur.",
    })
  }

  if (severity === 'emergency') {
    measures.push({
      icon: '📞',
      text: 'En cas de danger immédiat, appelez le 18 (pompiers) ou le 112.',
    })
  }

  if (severity === 'moderate' || severity === 'severe' || severity === 'emergency') {
    measures.push({
      icon: '🪣',
      text: "Placez des récipients sous les zones d'écoulement pour limiter les dégâts.",
    })
  }

  // Leak-type-specific measures
  if (leakType === 'roof' || leakType === 'terrace') {
    measures.push({
      icon: '🏠',
      text: 'Ne montez pas sur le toit. Protégez les biens en dessous de la zone affectée.',
    })
  }

  if (leakType === 'basement') {
    measures.push({
      icon: '📦',
      text: 'Surélevez les objets de valeur stockés au sol pour éviter les dégâts des eaux.',
    })
  }

  if (leakType === 'wall') {
    measures.push({
      icon: '🪟',
      text: 'Aérez la pièce pour limiter le développement de moisissures.',
    })
  }

  // Universal measure
  measures.push({
    icon: '📸',
    text: 'Prenez des photos des zones touchées pour faciliter le diagnostic et votre dossier assurance.',
  })

  return measures
}

/**
 * Basic version: generic precautions based on severity only
 */
export function getBasicPrecautionaryMeasures(severity: string): PrecautionaryMeasure[] {
  const measures: PrecautionaryMeasure[] = []

  if (severity === 'emergency' || severity === 'severe') {
    measures.push({
      icon: '🚨',
      text: "Éloignez vos affaires des zones d'infiltration visibles pour limiter les dommages.",
    })
    measures.push({
      icon: '⚡',
      text: "En cas d'infiltration près d'installations électriques, coupez le courant au disjoncteur.",
    })
  }

  measures.push({
    icon: '📸',
    text: 'Prenez des photos des zones touchées — utile pour le diagnostic et votre assurance.',
  })

  return measures
}

export interface PrecautionColors {
  borderColor: string
  bgColor: string
  titleColor: string
  titleText: string
}

export function getPrecautionColors(severity: string): PrecautionColors {
  if (severity === 'emergency' || severity === 'severe') {
    return {
      borderColor: '#fecaca',
      bgColor: '#fef2f2',
      titleColor: '#991b1b',
      titleText: severity === 'emergency' ? 'Mesures urgentes' : 'Mesures importantes',
    }
  }
  if (severity === 'moderate') {
    return {
      borderColor: '#fed7aa',
      bgColor: '#fffbeb',
      titleColor: '#92400e',
      titleText: 'Conseils en attendant le diagnostic',
    }
  }
  return {
    borderColor: '#bbf7d0',
    bgColor: '#f0fdf4',
    titleColor: '#166534',
    titleText: 'Conseils en attendant le diagnostic',
  }
}

export const COMPANY_INFO = {
  name: 'MAKRIA SAS',
  phone: '01 85 09 01 25',
  email: 'contact@makria.fr',
  address: 'Île-de-France',
  certifications: ['Garantie décennale', 'Assurance RC Pro'],
  stats: {
    years: '12+',
    projects: '150+',
    availability: '7j/7',
  },
} as const
