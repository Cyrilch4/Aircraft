'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft, Home, Building2, Briefcase, MapPin, Calendar, Ruler,
  Layers, Zap, ChevronRight, ExternalLink, Hammer, FileText,
  User, Phone, Mail, HardHat, CheckCircle2, Clock,
} from 'lucide-react'
import { ActiviteList } from '@/components/ActiviteBadge'
import type { ActiviteSlug } from '@/lib/activites'

type Tab = 'caracteristiques' | 'proprietaires' | 'chantiers'
type BienType = 'appartement' | 'maison' | 'bureau' | 'local'

const TYPE_CONFIG: Record<BienType, { icon: React.ElementType; label: string; color: string; bg: string }> = {
  appartement: { icon: Building2, label: 'Appartement', color: '#0071E3', bg: '#EBF5FF' },
  maison:      { icon: Home,      label: 'Maison',      color: '#34C759', bg: '#F0FFF4' },
  bureau:      { icon: Briefcase, label: 'Bureau',      color: '#AF52DE', bg: '#F5EEFF' },
  local:       { icon: Building2, label: 'Local',       color: '#FF9500', bg: '#FFF3E0' },
}

const DPE_COLOR: Record<string, string> = {
  A: '#00C853', B: '#64DD17', C: '#AEEA00', D: '#FFD600', E: '#FF9800', F: '#FF5722', G: '#B71C1C',
}
const DPE_DESC: Record<string, string> = {
  A: '< 70 kWh/m²/an', B: '70-110', C: '110-180', D: '180-250', E: '250-330', F: '330-420', G: '> 420 kWh/m²/an',
}

const BIENS: Record<string, {
  id: string; type: BienType; adresse: string; codePostal: string; ville: string;
  surface: number; pieces: number; etage: number; annee: number; dpe: string;
  description?: string; syndic?: string; notesInterne?: string;
  proprietaire: { id: string; nom: string; telephone: string; email: string };
  historiqueProprietaires: { nom: string; de: string; a: string | null }[];
  chantiers: {
    id: string; titre: string; activites: ActiviteSlug[]; statut: 'planifie' | 'en_cours' | 'termine';
    date_debut: string; date_fin_prevue: string; avancement: number; montant: string;
    artisan: string;
  }[];
}> = {
  b1: {
    id: 'b1', type: 'appartement',
    adresse: '8 allée des Roses', codePostal: '75016', ville: 'Paris',
    surface: 65, pieces: 3, etage: 4, annee: 1978, dpe: 'D',
    description: 'Appartement en étage élevé avec vue dégagée. Double exposition. Cuisine séparée, séjour lumineux, deux chambres.',
    syndic: 'Cabinet Foncia Paris 16 — 01 45 20 38 12',
    notesInterne: 'Propriétaire très réactif. Préférence pour les interventions le matin.',
    proprietaire: { id: 'c1', nom: 'Marie Lefebvre', telephone: '06 12 34 56 78', email: 'marie.lefebvre@email.fr' },
    historiqueProprietaires: [
      { nom: 'Marie Lefebvre', de: '2019-03-15', a: null },
      { nom: 'Ancien propriétaire', de: '2005-07-01', a: '2019-03-14' },
    ],
    chantiers: [
      {
        id: 'ch1', titre: 'Rénovation salle de bain + mise aux normes électriques',
        activites: ['plomberie', 'electricite'], statut: 'en_cours',
        date_debut: '2026-04-15', date_fin_prevue: '2026-06-30',
        avancement: 60, montant: '9 800 €', artisan: 'Sophie Martin',
      },
      {
        id: 'ch-old', titre: 'Remplacement chaudière',
        activites: ['chauffage'], statut: 'termine',
        date_debut: '2024-10-01', date_fin_prevue: '2024-10-15',
        avancement: 100, montant: '3 200 €', artisan: 'Dupont Elec SARL',
      },
    ],
  },
  b2: {
    id: 'b2', type: 'maison',
    adresse: '3 rue Victor Hugo', codePostal: '69001', ville: 'Lyon',
    surface: 120, pieces: 5, etage: 0, annee: 1965, dpe: 'E',
    description: 'Maison de ville avec jardin de 80 m². Plain-pied avec sous-sol aménagé. Garage double.',
    notesInterne: 'DPE défavorable — à surveiller lors de la prochaine intervention.',
    proprietaire: { id: 'c2', nom: 'Pierre Rousseau', telephone: '06 98 76 54 32', email: 'pierre.rousseau@email.fr' },
    historiqueProprietaires: [
      { nom: 'Pierre Rousseau', de: '2012-06-01', a: null },
    ],
    chantiers: [],
  },
  b3: {
    id: 'b3', type: 'appartement',
    adresse: '15 avenue Foch', codePostal: '31000', ville: 'Toulouse',
    surface: 85, pieces: 4, etage: 2, annee: 1990, dpe: 'C',
    proprietaire: { id: 'c3', nom: 'Isabelle Moreau', telephone: '06 11 22 33 44', email: 'i.moreau@email.fr' },
    historiqueProprietaires: [{ nom: 'Isabelle Moreau', de: '2017-09-01', a: null }],
    chantiers: [
      {
        id: 'ch2', titre: 'Extension maison — fondations et gros œuvre',
        activites: ['maconnerie'], statut: 'en_cours',
        date_debut: '2026-05-02', date_fin_prevue: '2026-09-15',
        avancement: 20, montant: '38 000 €', artisan: 'Julie Bernard',
      },
    ],
  },
  b4: {
    id: 'b4', type: 'appartement',
    adresse: '22 rue de la Paix', codePostal: '33000', ville: 'Bordeaux',
    surface: 110, pieces: 5, etage: 3, annee: 1905, dpe: 'F',
    description: 'Appartement haussmannien avec moulures et parquet d\'origine. Hauts plafonds 3,20 m. Vue sur cour intérieure calme.',
    syndic: 'Nexity Gestion Bordeaux — 05 56 11 22 33',
    proprietaire: { id: 'c4', nom: 'François Blanc', telephone: '06 55 44 33 22', email: 'f.blanc@email.fr' },
    historiqueProprietaires: [
      { nom: 'François Blanc', de: '2015-04-10', a: null },
      { nom: 'SCI Les Rives', de: '1998-01-01', a: '2015-04-09' },
    ],
    chantiers: [
      {
        id: 'ch5', titre: 'Rénovation complète appartement haussmannien',
        activites: ['maconnerie', 'peinture', 'electricite', 'plomberie'], statut: 'termine',
        date_debut: '2025-10-01', date_fin_prevue: '2026-02-28',
        avancement: 100, montant: '54 000 €', artisan: 'Leroy Bâtiment + équipe',
      },
    ],
  },
  b5: {
    id: 'b5', type: 'bureau',
    adresse: '14 rue des Acacias', codePostal: '59000', ville: 'Lille',
    surface: 95, pieces: 0, etage: 1, annee: 2005, dpe: 'B',
    description: 'Plateau de bureaux modulable. Open-space central + 3 salles de réunion. Accès PMR. Parking en sous-sol.',
    proprietaire: { id: 'c6', nom: 'Antoine Girard', telephone: '06 77 88 99 00', email: 'a.girard@email.fr' },
    historiqueProprietaires: [{ nom: 'Antoine Girard', de: '2022-01-15', a: null }],
    chantiers: [
      {
        id: 'ch3', titre: 'Installation pompe à chaleur + tableau électrique',
        activites: ['electricite', 'chauffage'], statut: 'en_cours',
        date_debut: '2026-05-10', date_fin_prevue: '2026-07-20',
        avancement: 45, montant: '12 400 €', artisan: 'Dupont Elec SARL',
      },
    ],
  },
  b6: {
    id: 'b6', type: 'appartement',
    adresse: '19 rue du Commerce', codePostal: '44000', ville: 'Nantes',
    surface: 55, pieces: 2, etage: 5, annee: 2001, dpe: 'C',
    proprietaire: { id: 'c8', nom: 'Nicolas Fontaine', telephone: '06 33 44 55 66', email: 'n.fontaine@email.fr' },
    historiqueProprietaires: [{ nom: 'Nicolas Fontaine', de: '2020-11-01', a: null }],
    chantiers: [
      {
        id: 'ch4', titre: 'Ravalement façade + peinture intérieure',
        activites: ['peinture', 'menuiserie'], statut: 'planifie',
        date_debut: '2026-07-01', date_fin_prevue: '2026-08-31',
        avancement: 0, montant: '7 200 €', artisan: 'Leroy Bâtiment',
      },
    ],
  },
}

const STATUT_CONFIG = {
  planifie: { label: 'Planifié',  icon: Clock,        className: 'text-[#6E6E73] bg-[#F5F5F7]'    },
  en_cours: { label: 'En cours',  icon: Hammer,       className: 'text-[#0071E3] bg-[#EBF5FF]'    },
  termine:  { label: 'Terminé',   icon: CheckCircle2, className: 'text-[#34C759] bg-[#34C759]/10' },
}

function StatutBadge({ statut }: { statut: 'planifie' | 'en_cours' | 'termine' }) {
  const { label, icon: Icon, className } = STATUT_CONFIG[statut]
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-semibold ${className}`}>
      <Icon className="w-3.5 h-3.5" />
      {label}
    </span>
  )
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

function formatDateShort(d: string) {
  return new Date(d).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })
}

const TABS: { key: Tab; label: string }[] = [
  { key: 'caracteristiques', label: 'Caractéristiques' },
  { key: 'proprietaires',    label: 'Propriétaires' },
  { key: 'chantiers',        label: 'Chantiers' },
]

export function BienDetailClient({ id }: { id: string }) {
  const [tab, setTab] = useState<Tab>('caracteristiques')
  const bien = BIENS[id]

  if (!bien) {
    return (
      <div className="p-8">
        <p className="text-[#6E6E73]">Bien introuvable.</p>
        <Link href="/admin/biens" className="text-[#0071E3] text-[14px] hover:underline">← Retour à la liste</Link>
      </div>
    )
  }

  const cfg = TYPE_CONFIG[bien.type]
  const Icon = cfg.icon
  const enCours = bien.chantiers.filter((c) => c.statut === 'en_cours').length
  const totalChantiers = bien.chantiers.length

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Back */}
      <Link href="/admin/biens" className="inline-flex items-center gap-1.5 text-[13px] text-[#6E6E73] hover:text-[#1D1D1F] mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Biens
      </Link>

      {/* Header */}
      <div className="bg-white rounded-2xl border border-[#E5E5EA] p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0" style={{ backgroundColor: cfg.bg }}>
            <Icon className="w-7 h-7" style={{ color: cfg.color }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-[24px] font-bold text-[#1D1D1F] tracking-tight leading-tight">{bien.adresse}</h1>
                <div className="flex items-center gap-1.5 mt-1 text-[14px] text-[#6E6E73]">
                  <MapPin className="w-3.5 h-3.5" />
                  {bien.codePostal} {bien.ville}
                </div>
                <div className="flex items-center gap-2 mt-2.5">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-semibold text-white" style={{ backgroundColor: cfg.color }}>
                    {cfg.label}
                  </span>
                  {enCours > 0 && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[12px] font-semibold text-[#0071E3] bg-[#EBF5FF]">
                      <Hammer className="w-3 h-3" />
                      {enCours} chantier{enCours > 1 ? 's' : ''} en cours
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href={`/admin/clients/${bien.proprietaire.id}`}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[13px] font-semibold text-[#0071E3] bg-[#EBF5FF] hover:bg-[#D6EBFF] transition-colors"
                >
                  <User className="w-4 h-4" />
                  Fiche client
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-[#F5F5F7]">
          {[
            { label: 'Surface', value: `${bien.surface} m²` },
            { label: 'Pièces', value: bien.pieces > 0 ? bien.pieces.toString() : 'N/A' },
            { label: 'Année', value: bien.annee.toString() },
            { label: 'DPE', value: bien.dpe, color: DPE_COLOR[bien.dpe] },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-[22px] font-bold tracking-tight" style={{ color: s.color ?? '#1D1D1F' }}>{s.value}</div>
              <div className="text-[12px] text-[#6E6E73] mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-[#F5F5F7] rounded-xl p-1 mb-6 w-fit">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-4 py-2 rounded-lg text-[13px] font-semibold transition-all ${
              tab === key ? 'bg-white text-[#1D1D1F] shadow-sm' : 'text-[#6E6E73] hover:text-[#1D1D1F]'
            }`}
          >
            {label}
            {key === 'chantiers' && totalChantiers > 0 && (
              <span className="ml-1.5 text-[11px] font-bold text-[#6E6E73]">{totalChantiers}</span>
            )}
          </button>
        ))}
      </div>

      {/* Tab: Caractéristiques */}
      {tab === 'caracteristiques' && (
        <div className="grid grid-cols-2 gap-6">
          {/* Localisation */}
          <div className="bg-white rounded-2xl border border-[#E5E5EA] p-6">
            <h2 className="text-[15px] font-bold text-[#1D1D1F] mb-5">Localisation</h2>
            <div className="space-y-4">
              {[
                { label: 'Adresse', value: bien.adresse },
                { label: 'Code postal', value: bien.codePostal },
                { label: 'Ville', value: bien.ville },
                { label: 'Étage', value: bien.etage > 0 ? `${bien.etage}ème étage` : 'Rez-de-chaussée' },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center py-2 border-b border-[#F5F5F7] last:border-0">
                  <span className="text-[13px] text-[#6E6E73]">{label}</span>
                  <span className="text-[13px] font-semibold text-[#1D1D1F]">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Caractéristiques techniques */}
          <div className="bg-white rounded-2xl border border-[#E5E5EA] p-6">
            <h2 className="text-[15px] font-bold text-[#1D1D1F] mb-5">Caractéristiques techniques</h2>
            <div className="space-y-0">
              {[
                { label: 'Type', value: cfg.label },
                { label: 'Surface habitable', value: `${bien.surface} m²` },
                ...(bien.pieces > 0 ? [{ label: 'Nombre de pièces', value: bien.pieces.toString() }] : []),
                { label: 'Année de construction', value: bien.annee.toString() },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center py-2 border-b border-[#F5F5F7] last:border-0">
                  <span className="text-[13px] text-[#6E6E73]">{label}</span>
                  <span className="text-[13px] font-semibold text-[#1D1D1F]">{value}</span>
                </div>
              ))}

              {/* DPE */}
              <div className="flex justify-between items-center py-2">
                <span className="text-[13px] text-[#6E6E73]">DPE</span>
                <div className="flex items-center gap-2">
                  <span
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-[13px] font-bold text-white"
                    style={{ backgroundColor: DPE_COLOR[bien.dpe] ?? '#999' }}
                  >
                    {bien.dpe}
                  </span>
                  <span className="text-[12px] text-[#6E6E73]">{DPE_DESC[bien.dpe]}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          {bien.description && (
            <div className="bg-white rounded-2xl border border-[#E5E5EA] p-6">
              <h2 className="text-[15px] font-bold text-[#1D1D1F] mb-3">Description</h2>
              <p className="text-[13px] text-[#3C3C43] leading-relaxed">{bien.description}</p>
            </div>
          )}

          {/* Syndic / gestionnaire */}
          {bien.syndic && (
            <div className="bg-white rounded-2xl border border-[#E5E5EA] p-6">
              <h2 className="text-[15px] font-bold text-[#1D1D1F] mb-3">Syndic / Gestionnaire</h2>
              <p className="text-[13px] text-[#3C3C43]">{bien.syndic}</p>
            </div>
          )}

          {/* Notes internes */}
          {bien.notesInterne && (
            <div className="col-span-2 bg-[#FFFBEB] rounded-2xl border border-[#FDE68A] p-6">
              <h2 className="text-[14px] font-bold text-[#92400E] mb-2">Notes internes</h2>
              <p className="text-[13px] text-[#78350F] leading-relaxed">{bien.notesInterne}</p>
            </div>
          )}
        </div>
      )}

      {/* Tab: Propriétaires */}
      {tab === 'proprietaires' && (
        <div className="space-y-6">
          {/* Propriétaire actuel */}
          <div className="bg-white rounded-2xl border border-[#E5E5EA] p-6">
            <h2 className="text-[15px] font-bold text-[#1D1D1F] mb-5">Propriétaire actuel</h2>
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-full bg-[#EBF5FF] flex items-center justify-center shrink-0">
                <User className="w-5 h-5 text-[#0071E3]" />
              </div>
              <div className="flex-1">
                <div className="text-[15px] font-semibold text-[#1D1D1F]">{bien.proprietaire.nom}</div>
                <div className="flex items-center gap-4 mt-1.5">
                  <a href={`tel:${bien.proprietaire.telephone}`} className="flex items-center gap-1.5 text-[12px] text-[#6E6E73] hover:text-[#0071E3] transition-colors">
                    <Phone className="w-3.5 h-3.5" />
                    {bien.proprietaire.telephone}
                  </a>
                  <a href={`mailto:${bien.proprietaire.email}`} className="flex items-center gap-1.5 text-[12px] text-[#6E6E73] hover:text-[#0071E3] transition-colors">
                    <Mail className="w-3.5 h-3.5" />
                    {bien.proprietaire.email}
                  </a>
                </div>
              </div>
              <Link
                href={`/admin/clients/${bien.proprietaire.id}`}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[13px] font-semibold text-[#0071E3] bg-[#EBF5FF] hover:bg-[#D6EBFF] transition-colors"
              >
                Fiche client <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Historique */}
          <div className="bg-white rounded-2xl border border-[#E5E5EA] p-6">
            <h2 className="text-[15px] font-bold text-[#1D1D1F] mb-5">Historique de propriété</h2>
            <div className="relative">
              <div className="absolute left-5 top-3 bottom-3 w-px bg-[#E5E5EA]" />
              <div className="space-y-6">
                {bien.historiqueProprietaires.map((h, i) => (
                  <div key={i} className="flex items-start gap-4 pl-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border-2 ${i === 0 ? 'bg-[#0071E3] border-[#0071E3]' : 'bg-white border-[#E5E5EA]'}`}>
                      <User className={`w-3 h-3 ${i === 0 ? 'text-white' : 'text-[#6E6E73]'}`} />
                    </div>
                    <div>
                      <div className="text-[14px] font-semibold text-[#1D1D1F]">{h.nom}</div>
                      <div className="text-[12px] text-[#6E6E73] mt-0.5">
                        Depuis {formatDate(h.de)}{h.a ? ` jusqu'au ${formatDate(h.a)}` : ' · Actuel'}
                      </div>
                    </div>
                    {i === 0 && (
                      <span className="ml-auto text-[11px] font-semibold text-[#34C759] bg-[#34C759]/10 px-2 py-0.5 rounded-full">Actuel</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Chantiers */}
      {tab === 'chantiers' && (
        <div className="space-y-4">
          {bien.chantiers.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#E5E5EA] p-12 text-center">
              <HardHat className="w-10 h-10 text-[#C7C7CC] mx-auto mb-3" />
              <p className="text-[14px] text-[#6E6E73] font-medium">Aucun chantier enregistré sur ce bien</p>
            </div>
          ) : (
            <>
              {bien.chantiers.map((ch) => (
                <div key={ch.id} className="bg-white rounded-2xl border border-[#E5E5EA] p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2.5 mb-2">
                        <StatutBadge statut={ch.statut} />
                        <ActiviteList slugs={ch.activites} />
                      </div>
                      <div className="text-[15px] font-semibold text-[#1D1D1F] mb-1">{ch.titre}</div>
                      <div className="flex items-center gap-3 text-[12px] text-[#6E6E73]">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {formatDateShort(ch.date_debut)} → {formatDateShort(ch.date_fin_prevue)}
                        </span>
                        <span>·</span>
                        <span>{ch.artisan}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-[16px] font-bold text-[#1D1D1F]">{ch.montant}</div>
                      <Link
                        href={`/admin/chantiers/${ch.id}`}
                        className="inline-flex items-center gap-1 text-[12px] text-[#0071E3] hover:underline mt-1"
                      >
                        Voir <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                  {ch.statut !== 'planifie' && (
                    <div className="mt-4 pt-4 border-t border-[#F5F5F7]">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-[#F5F5F7] rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${ch.avancement === 100 ? 'bg-[#34C759]' : 'bg-[#0071E3]'}`}
                            style={{ width: `${ch.avancement}%` }}
                          />
                        </div>
                        <span className="text-[12px] font-bold text-[#1D1D1F] w-8 text-right shrink-0">{ch.avancement}%</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  )
}
