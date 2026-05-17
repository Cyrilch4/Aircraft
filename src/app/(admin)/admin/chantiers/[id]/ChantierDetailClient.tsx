'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft, Hammer, CheckCircle2, Clock, MapPin, Calendar, User,
  Building2, Home, Briefcase, ExternalLink,
  FileText, Image as ImageIcon, AlertCircle,
  MessageSquare, Phone, CheckSquare, Upload, Euro,
} from 'lucide-react'
import { ActiviteList } from '@/components/ActiviteBadge'
import type { ActiviteSlug } from '@/lib/activites'

type Tab = 'synthese' | 'suivi' | 'financier' | 'documents'
type Statut = 'planifie' | 'en_cours' | 'termine'
type BienType = 'appartement' | 'maison' | 'bureau' | 'local'

const TYPE_ICON: Record<BienType, React.ElementType> = {
  appartement: Building2, maison: Home, bureau: Briefcase, local: Building2,
}

const STATUT_CONFIG: Record<Statut, { label: string; icon: React.ElementType; color: string; bg: string }> = {
  planifie: { label: 'Planifié',  icon: Clock,        color: '#6E6E73', bg: '#F5F5F7' },
  en_cours: { label: 'En cours',  icon: Hammer,       color: '#0071E3', bg: '#EBF5FF' },
  termine:  { label: 'Terminé',   icon: CheckCircle2, color: '#34C759', bg: '#34C759/10' },
}

interface Chantier {
  id: string; titre: string;
  client: { id: string; nom: string; telephone: string; email: string };
  bien: { id: string; adresse: string; codePostal: string; ville: string; type: BienType };
  activites: ActiviteSlug[];
  artisans: { id: string; nom: string; activite: string; telephone: string }[];
  statut: Statut;
  date_debut: string; date_fin_prevue: string;
  avancement: number; montant_total: number;
  suivi: { date: string; type: 'rdv' | 'note' | 'alerte' | 'done'; texte: string; auteur?: string }[];
  devis: { ref: string; date: string; artisan: string; montant: number; statut: 'en_attente' | 'accepte' | 'refuse' }[];
  factures: { ref: string; date: string; artisan: string; montant: number; statut: 'emise' | 'payee' | 'en_retard' }[];
  documents: { nom: string; type: 'photo' | 'plan' | 'devis' | 'facture' | 'contrat'; date: string; source: 'client' | 'pro' }[];
}

const CHANTIERS: Record<string, Chantier> = {
  ch1: {
    id: 'ch1',
    titre: 'Rénovation salle de bain + mise aux normes électriques',
    client: { id: 'c1', nom: 'Marie Lefebvre', telephone: '06 12 34 56 78', email: 'marie.lefebvre@email.fr' },
    bien: { id: 'b1', adresse: '8 allée des Roses', codePostal: '75016', ville: 'Paris', type: 'appartement' },
    activites: ['plomberie', 'electricite'],
    artisans: [
      { id: '11111111-1111-1111-1111-111111111111', nom: 'Sophie Martin',    activite: 'Plomberie',    telephone: '06 21 43 65 87' },
      { id: '22222222-2222-2222-2222-222222222222', nom: 'Dupont Elec SARL', activite: 'Électricité',  telephone: '03 20 11 22 33' },
    ],
    statut: 'en_cours',
    date_debut: '2026-04-15', date_fin_prevue: '2026-06-30',
    avancement: 60, montant_total: 9800,
    suivi: [
      { date: '2026-05-14', type: 'note', texte: 'Pose faïence terminée côté douche. RAS.', auteur: 'Sophie Martin' },
      { date: '2026-05-10', type: 'rdv', texte: 'Visite de chantier avec le client — validation de l\'avancement', auteur: 'Admin' },
      { date: '2026-05-03', type: 'alerte', texte: 'Retard livraison robinetterie. Délai repoussé de 5 jours.', auteur: 'Sophie Martin' },
      { date: '2026-04-28', type: 'done', texte: 'Démolition ancienne salle de bain terminée', auteur: 'Sophie Martin' },
      { date: '2026-04-15', type: 'done', texte: 'Démarrage chantier', auteur: 'Admin' },
    ],
    devis: [
      { ref: 'DEV-2026-047', date: '2026-03-20', artisan: 'Sophie Martin',    montant: 6200, statut: 'accepte' },
      { ref: 'DEV-2026-051', date: '2026-03-25', artisan: 'Dupont Elec SARL', montant: 3600, statut: 'accepte' },
    ],
    factures: [
      { ref: 'FAC-2026-112', date: '2026-05-01', artisan: 'Sophie Martin',    montant: 3100, statut: 'payee' },
    ],
    documents: [
      { nom: 'Plan salle de bain', type: 'plan', date: '2026-03-15', source: 'pro' },
      { nom: 'Photo avant travaux', type: 'photo', date: '2026-04-15', source: 'client' },
      { nom: 'Photo faïence posée', type: 'photo', date: '2026-05-14', source: 'pro' },
      { nom: 'Devis plomberie signé', type: 'devis', date: '2026-03-20', source: 'pro' },
      { nom: 'Devis électricité signé', type: 'devis', date: '2026-03-25', source: 'pro' },
      { nom: 'Facture acompte plomberie', type: 'facture', date: '2026-05-01', source: 'pro' },
    ],
  },
  ch2: {
    id: 'ch2',
    titre: 'Extension maison — fondations et gros œuvre',
    client: { id: 'c3', nom: 'Isabelle Moreau', telephone: '06 11 22 33 44', email: 'i.moreau@email.fr' },
    bien: { id: 'b3', adresse: '15 avenue Foch', codePostal: '31000', ville: 'Toulouse', type: 'appartement' },
    activites: ['maconnerie'],
    artisans: [
      { id: '33333333-3333-3333-3333-333333333333', nom: 'Julie Bernard', activite: 'Maçonnerie', telephone: '05 61 22 44 66' },
    ],
    statut: 'en_cours',
    date_debut: '2026-05-02', date_fin_prevue: '2026-09-15',
    avancement: 20, montant_total: 38000,
    suivi: [
      { date: '2026-05-12', type: 'done', texte: 'Terrassement terminé, coffrage en cours', auteur: 'Julie Bernard' },
      { date: '2026-05-02', type: 'done', texte: 'Démarrage chantier', auteur: 'Admin' },
    ],
    devis: [
      { ref: 'DEV-2026-038', date: '2026-04-01', artisan: 'Julie Bernard', montant: 38000, statut: 'accepte' },
    ],
    factures: [],
    documents: [
      { nom: 'Permis de construire', type: 'contrat', date: '2026-03-10', source: 'client' },
      { nom: 'Plan extension', type: 'plan', date: '2026-04-01', source: 'pro' },
    ],
  },
  ch3: {
    id: 'ch3',
    titre: 'Installation pompe à chaleur + tableau électrique',
    client: { id: 'c6', nom: 'Antoine Girard', telephone: '06 77 88 99 00', email: 'a.girard@email.fr' },
    bien: { id: 'b5', adresse: '14 rue des Acacias', codePostal: '59000', ville: 'Lille', type: 'bureau' },
    activites: ['electricite', 'chauffage'],
    artisans: [
      { id: '22222222-2222-2222-2222-222222222222', nom: 'Dupont Elec SARL', activite: 'Électricité + Chauffage', telephone: '03 20 11 22 33' },
    ],
    statut: 'en_cours',
    date_debut: '2026-05-10', date_fin_prevue: '2026-07-20',
    avancement: 45, montant_total: 12400,
    suivi: [
      { date: '2026-05-15', type: 'note', texte: 'Tableau électrique posé. PAC en attente de livraison.', auteur: 'Dupont Elec SARL' },
      { date: '2026-05-10', type: 'done', texte: 'Démarrage chantier', auteur: 'Admin' },
    ],
    devis: [
      { ref: 'DEV-2026-059', date: '2026-04-20', artisan: 'Dupont Elec SARL', montant: 12400, statut: 'accepte' },
    ],
    factures: [
      { ref: 'FAC-2026-118', date: '2026-05-12', artisan: 'Dupont Elec SARL', montant: 4000, statut: 'payee' },
    ],
    documents: [
      { nom: 'Devis PAC + tableau', type: 'devis', date: '2026-04-20', source: 'pro' },
      { nom: 'Attestation RGE', type: 'contrat', date: '2026-04-20', source: 'pro' },
    ],
  },
  ch4: {
    id: 'ch4',
    titre: 'Ravalement façade + peinture intérieure',
    client: { id: 'c8', nom: 'Nicolas Fontaine', telephone: '06 33 44 55 66', email: 'n.fontaine@email.fr' },
    bien: { id: 'b6', adresse: '19 rue du Commerce', codePostal: '44000', ville: 'Nantes', type: 'appartement' },
    activites: ['peinture', 'menuiserie'],
    artisans: [
      { id: '44444444-4444-4444-4444-444444444444', nom: 'Leroy Bâtiment', activite: 'Peinture', telephone: '02 40 11 22 33' },
    ],
    statut: 'planifie',
    date_debut: '2026-07-01', date_fin_prevue: '2026-08-31',
    avancement: 0, montant_total: 7200,
    suivi: [
      { date: '2026-05-05', type: 'note', texte: 'Devis validé par le client. Démarrage prévu le 1er juillet.', auteur: 'Admin' },
    ],
    devis: [
      { ref: 'DEV-2026-064', date: '2026-05-01', artisan: 'Leroy Bâtiment', montant: 7200, statut: 'accepte' },
    ],
    factures: [],
    documents: [
      { nom: 'Devis ravalement', type: 'devis', date: '2026-05-01', source: 'pro' },
    ],
  },
  ch5: {
    id: 'ch5',
    titre: 'Rénovation complète appartement haussmannien',
    client: { id: 'c4', nom: 'François Blanc', telephone: '06 55 44 33 22', email: 'f.blanc@email.fr' },
    bien: { id: 'b4', adresse: '22 rue de la Paix', codePostal: '33000', ville: 'Bordeaux', type: 'appartement' },
    activites: ['maconnerie', 'peinture', 'electricite', 'plomberie'],
    artisans: [
      { id: '44444444-4444-4444-4444-444444444444', nom: 'Leroy Bâtiment',   activite: 'Maçonnerie + Peinture', telephone: '02 40 11 22 33' },
      { id: '11111111-1111-1111-1111-111111111111', nom: 'Sophie Martin',     activite: 'Plomberie',             telephone: '06 21 43 65 87' },
      { id: '22222222-2222-2222-2222-222222222222', nom: 'Dupont Elec SARL',  activite: 'Électricité',           telephone: '03 20 11 22 33' },
    ],
    statut: 'termine',
    date_debut: '2025-10-01', date_fin_prevue: '2026-02-28',
    avancement: 100, montant_total: 54000,
    suivi: [
      { date: '2026-02-28', type: 'done', texte: 'Réception des travaux signée. Chantier clôturé.', auteur: 'Admin' },
      { date: '2026-02-20', type: 'rdv', texte: 'Visite de réception avec le client', auteur: 'Admin' },
      { date: '2026-01-15', type: 'note', texte: 'Peinture terminée. Nettoyage en cours.', auteur: 'Leroy Bâtiment' },
      { date: '2025-12-01', type: 'done', texte: 'Électricité et plomberie terminées', auteur: 'Admin' },
      { date: '2025-10-01', type: 'done', texte: 'Démarrage chantier', auteur: 'Admin' },
    ],
    devis: [
      { ref: 'DEV-2025-112', date: '2025-09-10', artisan: 'Leroy Bâtiment',   montant: 28000, statut: 'accepte' },
      { ref: 'DEV-2025-118', date: '2025-09-15', artisan: 'Sophie Martin',     montant: 14000, statut: 'accepte' },
      { ref: 'DEV-2025-122', date: '2025-09-18', artisan: 'Dupont Elec SARL',  montant: 12000, statut: 'accepte' },
    ],
    factures: [
      { ref: 'FAC-2026-041', date: '2026-02-28', artisan: 'Leroy Bâtiment',   montant: 28000, statut: 'payee' },
      { ref: 'FAC-2026-038', date: '2026-02-25', artisan: 'Sophie Martin',     montant: 14000, statut: 'payee' },
      { ref: 'FAC-2026-040', date: '2026-02-26', artisan: 'Dupont Elec SARL',  montant: 12000, statut: 'payee' },
    ],
    documents: [
      { nom: 'PV réception signé', type: 'contrat', date: '2026-02-28', source: 'client' },
      { nom: 'Photos après travaux', type: 'photo', date: '2026-02-20', source: 'pro' },
      { nom: 'Plans rénovation', type: 'plan', date: '2025-09-05', source: 'pro' },
    ],
  },
}

const SUIVI_CONFIG = {
  rdv:    { icon: Calendar,      color: '#0071E3', bg: '#EBF5FF',        label: 'RDV' },
  note:   { icon: MessageSquare, color: '#6E6E73', bg: '#F5F5F7',        label: 'Note' },
  alerte: { icon: AlertCircle,   color: '#FF3B30', bg: '#FFF1F0',        label: 'Alerte' },
  done:   { icon: CheckSquare,   color: '#34C759', bg: '#34C759]/10',    label: 'Étape' },
}

const DOC_CONFIG = {
  photo:    { icon: ImageIcon,  color: '#AF52DE', bg: '#F5EEFF', label: 'Photo' },
  plan:     { icon: FileText,   color: '#0071E3', bg: '#EBF5FF', label: 'Plan' },
  devis:    { icon: FileText,   color: '#FF9500', bg: '#FFF3E0', label: 'Devis' },
  facture:  { icon: Euro,       color: '#34C759', bg: '#F0FFF4', label: 'Facture' },
  contrat:  { icon: FileText,   color: '#6E6E73', bg: '#F5F5F7', label: 'Contrat' },
}

const DEVIS_STATUT = {
  en_attente: { label: 'En attente', className: 'text-[#6E6E73] bg-[#F5F5F7]' },
  accepte:    { label: 'Accepté',    className: 'text-[#34C759] bg-[#34C759]/10' },
  refuse:     { label: 'Refusé',     className: 'text-[#FF3B30] bg-[#FFF1F0]' },
}

const FAC_STATUT = {
  emise:     { label: 'Émise',      className: 'text-[#FF9500] bg-[#FFF3E0]' },
  payee:     { label: 'Payée',      className: 'text-[#34C759] bg-[#34C759]/10' },
  en_retard: { label: 'En retard',  className: 'text-[#FF3B30] bg-[#FFF1F0]' },
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}
function formatDateShort(d: string) {
  return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
}
function formatMontant(n: number) {
  return n.toLocaleString('fr-FR') + ' €'
}

const TABS: { key: Tab; label: string }[] = [
  { key: 'synthese',   label: 'Synthèse' },
  { key: 'suivi',      label: 'Suivi' },
  { key: 'financier',  label: 'Financier' },
  { key: 'documents',  label: 'Documents' },
]

export function ChantierDetailClient({ id }: { id: string }) {
  const [tab, setTab] = useState<Tab>('synthese')
  const ch = CHANTIERS[id]

  if (!ch) {
    return (
      <div className="p-8">
        <p className="text-[#6E6E73]">Chantier introuvable.</p>
        <Link href="/admin/chantiers" className="text-[#0071E3] text-[14px] hover:underline">← Retour à la liste</Link>
      </div>
    )
  }

  const sc = STATUT_CONFIG[ch.statut]
  const BienIcon = TYPE_ICON[ch.bien.type]
  const totalFacture = ch.factures.reduce((s, f) => s + f.montant, 0)
  const totalDevis = ch.devis.reduce((s, d) => s + d.montant, 0)

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Back */}
      <Link href="/admin/chantiers" className="inline-flex items-center gap-1.5 text-[13px] text-[#6E6E73] hover:text-[#1D1D1F] mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Chantiers
      </Link>

      {/* Header */}
      <div className="bg-white rounded-2xl border border-[#E5E5EA] p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#EBF5FF] flex items-center justify-center shrink-0">
            <Hammer className="w-7 h-7 text-[#0071E3]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2.5 mb-2">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-semibold ${
                      ch.statut === 'planifie' ? 'text-[#6E6E73] bg-[#F5F5F7]' :
                      ch.statut === 'en_cours' ? 'text-[#0071E3] bg-[#EBF5FF]' :
                      'text-[#34C759] bg-[#34C759]/10'
                    }`}
                  >
                    <sc.icon className="w-3.5 h-3.5" />
                    {sc.label}
                  </span>
                  <ActiviteList slugs={ch.activites} />
                </div>
                <h1 className="text-[22px] font-bold text-[#1D1D1F] tracking-tight leading-snug">{ch.titre}</h1>
                <div className="flex items-center gap-1.5 mt-1.5 text-[13px] text-[#6E6E73]">
                  <MapPin className="w-3.5 h-3.5" />
                  {ch.bien.adresse}, {ch.bien.codePostal} {ch.bien.ville}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-[#F5F5F7]">
          <div className="text-center">
            <div className="text-[22px] font-bold text-[#1D1D1F] tracking-tight">{ch.avancement}%</div>
            <div className="text-[12px] text-[#6E6E73] mt-0.5">Avancement</div>
          </div>
          <div className="text-center">
            <div className="text-[22px] font-bold text-[#1D1D1F] tracking-tight">{formatMontant(ch.montant_total)}</div>
            <div className="text-[12px] text-[#6E6E73] mt-0.5">Montant total</div>
          </div>
          <div className="text-center">
            <div className="text-[22px] font-bold text-[#34C759] tracking-tight">{formatMontant(totalFacture)}</div>
            <div className="text-[12px] text-[#6E6E73] mt-0.5">Facturé</div>
          </div>
          <div className="text-center">
            <div className="text-[22px] font-bold text-[#FF9500] tracking-tight">{formatMontant(ch.montant_total - totalFacture)}</div>
            <div className="text-[12px] text-[#6E6E73] mt-0.5">Reste à facturer</div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4 flex items-center gap-3">
          <div className="flex-1 h-2 bg-[#F5F5F7] rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${ch.avancement === 100 ? 'bg-[#34C759]' : 'bg-[#0071E3]'}`}
              style={{ width: `${ch.avancement}%` }}
            />
          </div>
          <span className="text-[13px] font-semibold text-[#1D1D1F] w-10 text-right shrink-0">{ch.avancement}%</span>
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
          </button>
        ))}
      </div>

      {/* Tab: Synthèse */}
      {tab === 'synthese' && (
        <div className="grid grid-cols-2 gap-6">
          {/* Client */}
          <div className="bg-white rounded-2xl border border-[#E5E5EA] p-6">
            <h2 className="text-[14px] font-bold text-[#6E6E73] uppercase tracking-wide mb-4">Client</h2>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#F0FFF4] flex items-center justify-center shrink-0">
                <User className="w-5 h-5 text-[#34C759]" />
              </div>
              <div>
                <div className="text-[14px] font-semibold text-[#1D1D1F]">{ch.client.nom}</div>
                <div className="text-[12px] text-[#6E6E73]">{ch.client.telephone}</div>
              </div>
            </div>
            <Link
              href={`/admin/clients/${ch.client.id}`}
              className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#0071E3] hover:underline"
            >
              Fiche client <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Bien */}
          <div className="bg-white rounded-2xl border border-[#E5E5EA] p-6">
            <h2 className="text-[14px] font-bold text-[#6E6E73] uppercase tracking-wide mb-4">Bien</h2>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#EBF5FF] flex items-center justify-center shrink-0">
                <BienIcon className="w-5 h-5 text-[#0071E3]" />
              </div>
              <div>
                <div className="text-[14px] font-semibold text-[#1D1D1F]">{ch.bien.adresse}</div>
                <div className="text-[12px] text-[#6E6E73]">{ch.bien.codePostal} {ch.bien.ville}</div>
              </div>
            </div>
            <Link
              href={`/admin/biens/${ch.bien.id}`}
              className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#0071E3] hover:underline"
            >
              Fiche bien <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Dates */}
          <div className="bg-white rounded-2xl border border-[#E5E5EA] p-6">
            <h2 className="text-[14px] font-bold text-[#6E6E73] uppercase tracking-wide mb-4">Calendrier</h2>
            <div className="space-y-3">
              {[
                { label: 'Date de démarrage', value: formatDate(ch.date_debut) },
                { label: 'Fin prévisionnelle',  value: formatDate(ch.date_fin_prevue) },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center">
                  <span className="text-[13px] text-[#6E6E73]">{label}</span>
                  <span className="text-[13px] font-semibold text-[#1D1D1F]">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Intervenants */}
          <div className="bg-white rounded-2xl border border-[#E5E5EA] p-6">
            <h2 className="text-[14px] font-bold text-[#6E6E73] uppercase tracking-wide mb-4">Intervenants</h2>
            <div className="space-y-3">
              {ch.artisans.map((a) => (
                <div key={a.id} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#F5EEFF] flex items-center justify-center shrink-0">
                    <User className="w-4 h-4 text-[#AF52DE]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link href={`/admin/artisans/${a.id}`} className="text-[13px] font-semibold text-[#0071E3] hover:underline truncate block">
                      {a.nom}
                    </Link>
                    <div className="text-[12px] text-[#6E6E73] truncate">{a.activite}</div>
                  </div>
                  <a href={`tel:${a.telephone}`} className="text-[12px] text-[#6E6E73] hover:text-[#0071E3] transition-colors shrink-0">
                    <Phone className="w-3.5 h-3.5" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Suivi */}
      {tab === 'suivi' && (
        <div className="bg-white rounded-2xl border border-[#E5E5EA] p-6">
          <h2 className="text-[15px] font-bold text-[#1D1D1F] mb-6">Journal de suivi</h2>
          <div className="relative">
            <div className="absolute left-5 top-3 bottom-3 w-px bg-[#E5E5EA]" />
            <div className="space-y-6">
              {ch.suivi.map((s, i) => {
                const cfg = SUIVI_CONFIG[s.type]
                const SIcon = cfg.icon
                return (
                  <div key={i} className="flex items-start gap-4 pl-2">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 border-2 border-white shadow-sm"
                      style={{ backgroundColor: cfg.bg.includes('/') ? '#F0FFF4' : cfg.bg }}
                    >
                      <SIcon className="w-3 h-3" style={{ color: cfg.color }} />
                    </div>
                    <div className="flex-1 pb-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: cfg.color }}>{cfg.label}</span>
                          {s.auteur && <span className="text-[11px] text-[#6E6E73] ml-1.5">· {s.auteur}</span>}
                          <p className="text-[13px] text-[#1D1D1F] mt-0.5 leading-relaxed">{s.texte}</p>
                        </div>
                        <span className="text-[11px] text-[#C7C7CC] shrink-0">{formatDateShort(s.date)}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Financier */}
      {tab === 'financier' && (
        <div className="space-y-6">
          {/* Récap */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Montant total',      value: formatMontant(ch.montant_total), color: '#1D1D1F' },
              { label: 'Total devis signés', value: formatMontant(totalDevis),        color: '#0071E3' },
              { label: 'Total facturé',      value: formatMontant(totalFacture),      color: '#34C759' },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-2xl border border-[#E5E5EA] p-5 text-center">
                <div className="text-[22px] font-bold tracking-tight" style={{ color: s.color }}>{s.value}</div>
                <div className="text-[12px] text-[#6E6E73] mt-1">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Devis */}
          <div className="bg-white rounded-2xl border border-[#E5E5EA] overflow-hidden">
            <div className="px-6 py-4 border-b border-[#E5E5EA]">
              <h2 className="text-[15px] font-bold text-[#1D1D1F]">Devis</h2>
            </div>
            {ch.devis.length === 0 ? (
              <div className="p-8 text-center text-[13px] text-[#6E6E73]">Aucun devis</div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#F9F9FB] border-b border-[#E5E5EA]">
                    {['Référence', 'Date', 'Artisan', 'Montant', 'Statut'].map((h) => (
                      <th key={h} className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6E6E73]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F5F5F7]">
                  {ch.devis.map((d) => (
                    <tr key={d.ref} className="hover:bg-[#F9F9FB]">
                      <td className="px-5 py-3.5 text-[13px] font-mono text-[#1D1D1F]">{d.ref}</td>
                      <td className="px-5 py-3.5 text-[13px] text-[#6E6E73]">{formatDateShort(d.date)}</td>
                      <td className="px-5 py-3.5 text-[13px] text-[#1D1D1F]">{d.artisan}</td>
                      <td className="px-5 py-3.5 text-[13px] font-semibold text-[#1D1D1F]">{formatMontant(d.montant)}</td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[12px] font-semibold ${DEVIS_STATUT[d.statut].className}`}>
                          {DEVIS_STATUT[d.statut].label}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Factures */}
          <div className="bg-white rounded-2xl border border-[#E5E5EA] overflow-hidden">
            <div className="px-6 py-4 border-b border-[#E5E5EA]">
              <h2 className="text-[15px] font-bold text-[#1D1D1F]">Factures</h2>
            </div>
            {ch.factures.length === 0 ? (
              <div className="p-8 text-center text-[13px] text-[#6E6E73]">Aucune facture</div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#F9F9FB] border-b border-[#E5E5EA]">
                    {['Référence', 'Date', 'Artisan', 'Montant', 'Statut'].map((h) => (
                      <th key={h} className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6E6E73]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F5F5F7]">
                  {ch.factures.map((f) => (
                    <tr key={f.ref} className="hover:bg-[#F9F9FB]">
                      <td className="px-5 py-3.5 text-[13px] font-mono text-[#1D1D1F]">{f.ref}</td>
                      <td className="px-5 py-3.5 text-[13px] text-[#6E6E73]">{formatDateShort(f.date)}</td>
                      <td className="px-5 py-3.5 text-[13px] text-[#1D1D1F]">{f.artisan}</td>
                      <td className="px-5 py-3.5 text-[13px] font-semibold text-[#1D1D1F]">{formatMontant(f.montant)}</td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[12px] font-semibold ${FAC_STATUT[f.statut].className}`}>
                          {FAC_STATUT[f.statut].label}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* Tab: Documents */}
      {tab === 'documents' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-[13px] text-[#6E6E73]">{ch.documents.length} document{ch.documents.length > 1 ? 's' : ''}</p>
            <button className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#EBF5FF] text-[#0071E3] text-[13px] font-semibold rounded-xl hover:bg-[#D6EBFF] transition-colors">
              <Upload className="w-3.5 h-3.5" />
              Ajouter
            </button>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {ch.documents.map((doc, i) => {
              const dc = DOC_CONFIG[doc.type]
              const DIcon = dc.icon
              return (
                <div key={i} className="bg-white rounded-2xl border border-[#E5E5EA] p-4 hover:border-[#0071E3]/30 transition-colors group cursor-pointer">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: dc.bg }}>
                      <DIcon className="w-4.5 h-4.5" style={{ color: dc.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-semibold text-[#1D1D1F] truncate">{doc.nom}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[11px] font-medium" style={{ color: dc.color }}>{dc.label}</span>
                        <span className="text-[11px] text-[#C7C7CC]">·</span>
                        <span className={`text-[11px] font-semibold px-1.5 py-0.5 rounded-full ${doc.source === 'pro' ? 'text-[#AF52DE] bg-[#F5EEFF]' : 'text-[#34C759] bg-[#34C759]/10'}`}>
                          {doc.source === 'pro' ? 'Pro' : 'Client'}
                        </span>
                      </div>
                      <div className="text-[11px] text-[#C7C7CC] mt-0.5">{formatDateShort(doc.date)}</div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
