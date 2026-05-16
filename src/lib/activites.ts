// Référentiel des activités métier — partagé entre back-office et portails

export const ACTIVITES = {
  plomberie:    { label: 'Plomberie',      couleur: '#0071E3' },
  electricite:  { label: 'Électricité',    couleur: '#FF9500' },
  maconnerie:   { label: 'Maçonnerie',     couleur: '#8E8E93' },
  chauffage:    { label: 'Chauffage',      couleur: '#FF3B30' },
  menuiserie:   { label: 'Menuiserie',     couleur: '#A2845E' },
  peinture:     { label: 'Peinture',       couleur: '#AF52DE' },
  couverture:   { label: 'Couverture',     couleur: '#34C759' },
  architecture: { label: 'Architecture',   couleur: '#1D1D1F' },
} as const

export type ActiviteSlug = keyof typeof ACTIVITES

// Composant badge — utilisable dans les Server Components (pas de 'use client')
export function activiteStyle(slug: ActiviteSlug) {
  const a = ACTIVITES[slug]
  return { label: a.label, couleur: a.couleur }
}
