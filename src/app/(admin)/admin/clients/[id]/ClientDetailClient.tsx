'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft, LogIn, Mail, Phone, MapPin, Globe, Home, Building2,
  CheckCircle2, Clock, AlertCircle, FileText, FileCheck, Camera,
  Map, Calendar, HardHat, PhoneCall, Users, UserPlus, Star,
  ChevronRight, Banknote, XCircle,
} from 'lucide-react'
import { ActiviteBadge, ActiviteList } from '@/components/ActiviteBadge'
import type { ActiviteSlug } from '@/lib/activites'

// ─── Demo data ───────────────────────────────────────────────────────────────

const DEMO = {
  id: 'c1',
  prenom: 'Marie', nom: 'Lefebvre',
  type: 'particulier' as 'particulier' | 'professionnel',
  email: 'marie.lefebvre@email.fr',
  tel: '06 45 67 89 01',
  adresse: '8 allée des Roses, 75016 Paris',
  langues: ['Français'],
  dateEntreeRelation: '15 sept. 2024',

  bien: {
    type: 'appartement' as const,
    surface: 65, pieces: 3, etage: 4, anneeConstruction: 1978,
    adresse: '8 allée des Roses, 75016 Paris',
    notes: 'Copropriété — Syndic Foncia Paris 16',
  },

  chantierEnCours: {
    id: 'CH-2024-051',
    nature: 'Rénovation salle de bain complète',
    activites: ['plomberie', 'carrelage'] as ActiviteSlug[],
    professionnel: 'Sophie Martin',
    professionnelId: '11111111-1111-1111-1111-111111111111',
    dateDebut: '15 oct. 2024',
    dateFin: '30 nov. 2024',
    avancement: 60,
    statut: 'en_cours' as const,
  },

  devisFactures: [
    { type: 'devis'   as const, ref: 'DE-2024-018',   montant: '6 200 €', date: '1 oct. 2024',   statut: 'signe'       as const, note: '' },
    { type: 'facture' as const, ref: 'FA-2024-042-A',  montant: '2 480 €', date: '20 oct. 2024',  statut: 'payee'       as const, note: 'Acompte 40 %' },
    { type: 'facture' as const, ref: 'FA-2024-042-B',  montant: '3 720 €', date: '—',             statut: 'en_attente'  as const, note: 'Solde à la livraison' },
  ],

  historique: [
    { id: 'CH-2023-012', nature: 'Remplacement chaudière', activite: 'chauffage' as ActiviteSlug, professionnel: 'Sophie Martin', montant: '3 400 €', date: 'mars 2023' },
  ],

  rdvAVenir: [
    { type: 'Réunion de chantier', date: '8 nov. 2024', heure: '10h00', professionnel: 'Sophie Martin', lieu: 'Sur place' },
  ],

  documents: [
    { nom: 'Photos avant travaux',      type: 'photo'    as const, source: 'client' as const, date: '10 oct. 2024', nb: 12 },
    { nom: 'Plan salle de bain',         type: 'plan'     as const, source: 'pro'    as const, date: '3 oct. 2024',  nb: 2  },
    { nom: 'Devis signé',               type: 'contrat'  as const, source: 'pro'    as const, date: '5 oct. 2024',  nb: 1  },
    { nom: 'Facture acompte',           type: 'facture'  as const, source: 'pro'    as const, date: '20 oct. 2024', nb: 1  },
    { nom: 'Photos avancement J+15',    type: 'photo'    as const, source: 'pro'    as const, date: '30 oct. 2024', nb: 8  },
  ],

  echanges: [
    { type: 'rdv_presentiel' as const, date: '15 sept. 2024', heure: '14h00', duree: '45 min', participants: ['Sophie Martin'], resume: "Premier rendez-vous de découverte. Sophie présente ses références et son approche du chantier." },
    { type: 'telephone'      as const, date: '2 oct. 2024',   heure: '11h30', duree: '12 min', participants: ['Sophie Martin'], resume: "Validation du devis. Démarrage confirmé au 15 octobre." },
    { type: 'reunion_chantier' as const, date: '30 oct. 2024', heure: '09h00', duree: '30 min', participants: ['Sophie Martin'], resume: "Point avancement à 60 %. Plomberie terminée, carrelage en cours. RDV de livraison fixé au 30 nov." },
  ],

  contacts: {
    prosContactes: [
      { nom: 'Sophie Martin',  activite: 'plomberie'  as ActiviteSlug, statut: 'signe'    as const, date: '1 oct. 2024',   note: 'Devis retenu' },
      { nom: 'Marc Leroy',     activite: 'carrelage'  as ActiviteSlug, statut: 'refuse'   as const, date: '28 sept. 2024', note: 'Devis trop élevé' },
      { nom: 'Julie Bernard',  activite: 'maconnerie' as ActiviteSlug, statut: 'contacte' as const, date: '25 sept. 2024', note: 'Sans suite' },
    ],
    prosConnus: [
      { nom: 'Paul Dubois', activite: 'peinture' as ActiviteSlug, source: 'connaissance', note: 'Travaillé ensemble il y a 3 ans' },
    ],
    autresClients: [
      { nom: 'Pierre Rousseau', lien: 'Recommandé par Sophie Martin', date: '5 oct. 2024', note: 'Projet de rénovation similaire' },
    ],
  },

  notes: {
    parPros: [
      { note: 5, commentaire: "Cliente très organisée et réactive. Documents fournis rapidement, paiements ponctuels.", pro: 'Sophie Martin', chantier: 'Remplacement chaudière', date: 'avr. 2023' },
    ],
    parClients: [
      { note: 5, commentaire: "Marie m'a recommandé Sophie Martin — excellent conseil, je suis très content du résultat.", client: 'Pierre Rousseau', date: 'oct. 2024' },
    ],
  },
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function Stars({ note }: { note: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={`text-[15px] ${i <= note ? 'text-[#FF9500]' : 'text-[#D1D1D6]'}`}>★</span>
      ))}
    </div>
  )
}

function SectionHead({ icon: Icon, label, count, color = '#1D1D1F' }: { icon: React.ElementType; label: string; count?: number; color?: string }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4" style={{ color }} />
        <h3 className="text-[15px] font-bold text-[#1D1D1F]">{label}</h3>
      </div>
      {count !== undefined && (
        <span className="text-[12px] text-[#6E6E73] bg-[#F5F5F7] px-2 py-0.5 rounded-full font-medium">{count}</span>
      )}
    </div>
  )
}

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`bg-white rounded-2xl border border-[#E5E5EA] p-6 ${className}`}>{children}</div>
}

const DOC_ICON: Record<string, React.ElementType> = {
  photo: Camera, plan: Map, contrat: FileCheck, facture: Banknote, devis: FileText,
}
const DOC_COLOR: Record<string, string> = {
  photo: '#0071E3', plan: '#AF52DE', contrat: '#34C759', facture: '#FF9500', devis: '#FF9500',
}
const ECHANGE_CONFIG = {
  rdv_presentiel:  { icon: Calendar,  label: 'RDV présentiel',    color: '#0071E3' },
  telephone:       { icon: PhoneCall, label: 'Appel téléphonique', color: '#34C759' },
  reunion_chantier:{ icon: HardHat,   label: 'Réunion chantier',   color: '#FF9500' },
}
const PRO_STATUT = {
  signe:    { label: 'Devis signé',  className: 'text-[#34C759] bg-[#34C759]/10' },
  refuse:   { label: 'Refusé',       className: 'text-[#FF3B30] bg-[#FF3B30]/10' },
  contacte: { label: 'Contacté',     className: 'text-[#6E6E73] bg-[#F5F5F7]'    },
  en_attente:{ label: 'En attente', className: 'text-[#0071E3] bg-[#EBF5FF]'     },
}
const DF_STATUT = {
  signe:      { label: 'Signé',       className: 'text-[#34C759] bg-[#34C759]/10', icon: CheckCircle2 },
  payee:      { label: 'Payée',       className: 'text-[#34C759] bg-[#34C759]/10', icon: CheckCircle2 },
  en_attente: { label: 'En attente',  className: 'text-[#FF9500] bg-[#FF9500]/10', icon: Clock        },
  relancee:   { label: 'Relancée',    className: 'text-[#FF3B30] bg-[#FF3B30]/10', icon: AlertCircle  },
  envoye:     { label: 'Envoyé',      className: 'text-[#0071E3] bg-[#EBF5FF]',    icon: Clock        },
}

// ─── Tab: Identification ──────────────────────────────────────────────────────

function TabIdentification() {
  const BIEN_ICON = { appartement: Building2, maison: Home, bureau: Building2 }
  const BienIcon = BIEN_ICON[DEMO.bien.type] ?? Home
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <SectionHead icon={Mail} label="Coordonnées" color="#0071E3" />
        {[
          { icon: Mail,   label: 'Email',     value: DEMO.email,   href: `mailto:${DEMO.email}` },
          { icon: Phone,  label: 'Téléphone', value: DEMO.tel,     href: `tel:${DEMO.tel.replace(/\s/g,'')}` },
          { icon: MapPin, label: 'Adresse',   value: DEMO.adresse },
        ].map(({ icon: Icon, label, value, href }) => (
          <div key={label} className="flex items-start gap-3 py-3 border-b border-[#F5F5F7] last:border-0">
            <Icon className="w-4 h-4 text-[#C7C7CC] mt-0.5 shrink-0" />
            <div>
              <div className="text-[11px] text-[#6E6E73] uppercase tracking-wide font-semibold mb-0.5">{label}</div>
              {href
                ? <a href={href} className="text-[13px] text-[#0071E3] hover:underline font-medium">{value}</a>
                : <div className="text-[13px] text-[#1D1D1F] font-medium">{value}</div>}
            </div>
          </div>
        ))}
        <div className="pt-3">
          <div className="text-[11px] text-[#6E6E73] uppercase tracking-wide font-semibold mb-2">Langues</div>
          <div className="flex gap-2">
            {DEMO.langues.map((l) => (
              <span key={l} className="px-2.5 py-1 rounded-full bg-[#F5F5F7] text-[12px] font-semibold text-[#1D1D1F]">{l}</span>
            ))}
          </div>
        </div>
      </Card>

      <Card>
        <SectionHead icon={BienIcon} label="Le bien" color="#34C759" />
        <div className="flex items-center gap-3 p-4 bg-[#F9F9FB] rounded-xl mb-4">
          <div className="w-10 h-10 rounded-xl bg-[#34C759]/10 flex items-center justify-center shrink-0">
            <BienIcon className="w-5 h-5 text-[#34C759]" />
          </div>
          <div>
            <div className="font-semibold text-[14px] text-[#1D1D1F] capitalize">{DEMO.bien.type}</div>
            <div className="text-[12px] text-[#6E6E73]">{DEMO.bien.adresse}</div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Surface', value: `${DEMO.bien.surface} m²` },
            { label: 'Pièces',  value: String(DEMO.bien.pieces) },
            { label: 'Étage',   value: `${DEMO.bien.etage}ᵉ étage` },
            { label: 'Construction', value: String(DEMO.bien.anneeConstruction) },
          ].map(({ label, value }) => (
            <div key={label} className="p-3 bg-[#F9F9FB] rounded-xl">
              <div className="text-[11px] text-[#6E6E73] font-semibold uppercase tracking-wide mb-0.5">{label}</div>
              <div className="text-[14px] font-bold text-[#1D1D1F]">{value}</div>
            </div>
          ))}
        </div>
        {DEMO.bien.notes && (
          <div className="mt-3 p-3 bg-[#FFF3E0] rounded-xl">
            <div className="text-[12px] text-[#FF9500] font-semibold mb-0.5">Notes</div>
            <div className="text-[12px] text-[#1D1D1F]">{DEMO.bien.notes}</div>
          </div>
        )}
      </Card>
    </div>
  )
}

// ─── Tab: Chantier ────────────────────────────────────────────────────────────

function TabChantier() {
  const total = DEMO.historique.length + 1
  return (
    <div className="space-y-6">
      {/* Chantier en cours */}
      <Card>
        <div className="flex items-start justify-between mb-5">
          <SectionHead icon={HardHat} label="Chantier en cours" color="#34C759" />
          <span className="inline-flex px-2.5 py-1 rounded-full text-[12px] font-semibold text-[#34C759] bg-[#34C759]/10">En cours</span>
        </div>
        <div className="space-y-4">
          <div>
            <div className="text-[16px] font-bold text-[#1D1D1F] mb-1">{DEMO.chantierEnCours.nature}</div>
            <div className="flex items-center gap-2 flex-wrap">
              <ActiviteList slugs={DEMO.chantierEnCours.activites} />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#0071E3]/10 flex items-center justify-center shrink-0">
              <span className="text-[11px] font-bold text-[#0071E3]">SM</span>
            </div>
            <Link
              href={`/admin/artisans/${DEMO.chantierEnCours.professionnelId}`}
              className="text-[13px] font-semibold text-[#0071E3] hover:underline"
            >
              {DEMO.chantierEnCours.professionnel}
            </Link>
            <span className="text-[12px] text-[#6E6E73]">· Professionnel en charge</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-[#F9F9FB] rounded-xl">
              <div className="text-[11px] text-[#6E6E73] font-semibold uppercase tracking-wide mb-0.5">Début</div>
              <div className="text-[13px] font-semibold text-[#1D1D1F]">{DEMO.chantierEnCours.dateDebut}</div>
            </div>
            <div className="p-3 bg-[#F9F9FB] rounded-xl">
              <div className="text-[11px] text-[#6E6E73] font-semibold uppercase tracking-wide mb-0.5">Fin prévue</div>
              <div className="text-[13px] font-semibold text-[#1D1D1F]">{DEMO.chantierEnCours.dateFin}</div>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[12px] text-[#6E6E73] font-medium">Avancement</span>
              <span className="text-[13px] font-bold text-[#34C759]">{DEMO.chantierEnCours.avancement} %</span>
            </div>
            <div className="h-2 bg-[#F5F5F7] rounded-full overflow-hidden">
              <div className="h-full bg-[#34C759] rounded-full transition-all" style={{ width: `${DEMO.chantierEnCours.avancement}%` }} />
            </div>
          </div>
        </div>
      </Card>

      {/* Devis & Factures */}
      <Card>
        <SectionHead icon={FileText} label="Devis & Factures" color="#AF52DE" count={DEMO.devisFactures.length} />
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-[#F9F9FB] border-b border-[#E5E5EA]">
              {['Type', 'Référence', 'Montant', 'Date', 'Note', 'Statut'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6E6E73]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F5F5F7]">
            {DEMO.devisFactures.map((d) => {
              const s = DF_STATUT[d.statut]
              return (
                <tr key={d.ref} className="hover:bg-[#F5F5F7] transition-colors">
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-semibold ${d.type === 'facture' ? 'text-[#0071E3] bg-[#EBF5FF]' : 'text-[#AF52DE] bg-[#F5EEFF]'}`}>
                      {d.type === 'facture' ? 'Facture' : 'Devis'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[12px] font-mono text-[#6E6E73]">{d.ref}</td>
                  <td className="px-4 py-3 text-[13px] font-bold text-[#1D1D1F]">{d.montant}</td>
                  <td className="px-4 py-3 text-[12px] text-[#6E6E73]">{d.date}</td>
                  <td className="px-4 py-3 text-[12px] text-[#6E6E73] italic">{d.note}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold ${s.className}`}>
                      <s.icon className="w-3 h-3" />{s.label}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </Card>

      {/* Historique */}
      <Card>
        <SectionHead icon={Clock} label={`Historique · ${total} chantier${total > 1 ? 's' : ''} au total`} color="#6E6E73" count={DEMO.historique.length} />
        {DEMO.historique.length === 0 ? (
          <div className="text-center py-8 text-[13px] text-[#C7C7CC]">Aucun chantier antérieur</div>
        ) : (
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-[#F9F9FB] border-b border-[#E5E5EA]">
                {['Réf.', 'Nature', 'Activité', 'Professionnel', 'Montant', 'Date'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6E6E73]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5F5F7]">
              {DEMO.historique.map((h) => (
                <tr key={h.id} className="hover:bg-[#F5F5F7] transition-colors">
                  <td className="px-4 py-3 text-[12px] font-mono text-[#6E6E73]">{h.id}</td>
                  <td className="px-4 py-3 text-[13px] text-[#1D1D1F] font-medium">{h.nature}</td>
                  <td className="px-4 py-3"><ActiviteBadge slug={h.activite} /></td>
                  <td className="px-4 py-3">
                    <span className="text-[13px] text-[#0071E3] hover:underline cursor-pointer">{h.professionnel}</span>
                  </td>
                  <td className="px-4 py-3 text-[13px] font-semibold text-[#1D1D1F]">{h.montant}</td>
                  <td className="px-4 py-3 text-[12px] text-[#6E6E73]">{h.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  )
}

// ─── Tab: Activité ────────────────────────────────────────────────────────────

function TabActivite() {
  return (
    <div className="space-y-6">
      {/* Dates clés + RDV */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <SectionHead icon={Calendar} label="Dates clés" color="#0071E3" />
          <div className="space-y-3">
            {[
              { label: "Entrée en relation", value: DEMO.dateEntreeRelation, color: '#6E6E73' },
              { label: "Début chantier",     value: DEMO.chantierEnCours.dateDebut, color: '#0071E3' },
              { label: "Fin prévisionnelle", value: DEMO.chantierEnCours.dateFin,   color: '#FF9500' },
            ].map(({ label, value, color }) => (
              <div key={label} className="flex items-center justify-between py-2.5 border-b border-[#F5F5F7] last:border-0">
                <span className="text-[13px] text-[#6E6E73]">{label}</span>
                <span className="text-[13px] font-semibold" style={{ color }}>{value}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <SectionHead icon={Calendar} label="Prochains rendez-vous" color="#FF9500" count={DEMO.rdvAVenir.length} />
          {DEMO.rdvAVenir.length === 0 ? (
            <div className="text-center py-6 text-[13px] text-[#C7C7CC]">Aucun RDV planifié</div>
          ) : (
            <div className="space-y-3">
              {DEMO.rdvAVenir.map((r, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-[#FFF3E0] rounded-xl">
                  <Calendar className="w-4 h-4 text-[#FF9500] mt-0.5 shrink-0" />
                  <div>
                    <div className="text-[13px] font-semibold text-[#1D1D1F]">{r.type}</div>
                    <div className="text-[12px] text-[#6E6E73]">{r.date} à {r.heure} · {r.lieu}</div>
                    <div className="text-[12px] text-[#0071E3] mt-0.5">avec {r.professionnel}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Documents */}
      <Card>
        <SectionHead icon={FileText} label="Documents" color="#AF52DE" count={DEMO.documents.reduce((s, d) => s + d.nb, 0)} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {DEMO.documents.map((doc, i) => {
            const Icon = DOC_ICON[doc.type] ?? FileText
            const color = DOC_COLOR[doc.type] ?? '#6E6E73'
            return (
              <div key={i} className="flex items-center gap-3 p-3.5 rounded-xl bg-[#F9F9FB] border border-[#F5F5F7] hover:border-[#E5E5EA] transition-colors">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${color}18` }}>
                  <Icon className="w-4.5 h-4.5" style={{ color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-semibold text-[#1D1D1F] truncate">{doc.nom}</div>
                  <div className="text-[11px] text-[#6E6E73]">{doc.nb} fichier{doc.nb > 1 ? 's' : ''} · {doc.date}</div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${doc.source === 'client' ? 'text-[#34C759] bg-[#34C759]/10' : 'text-[#0071E3] bg-[#EBF5FF]'}`}>
                  {doc.source === 'client' ? 'Client' : 'Pro'}
                </span>
              </div>
            )
          })}
        </div>
      </Card>

      {/* Échanges */}
      <Card>
        <SectionHead icon={PhoneCall} label="Échanges liés au chantier" color="#34C759" count={DEMO.echanges.length} />
        <div className="space-y-0">
          {DEMO.echanges.map((e, i) => {
            const cfg = ECHANGE_CONFIG[e.type]
            return (
              <div key={i} className="flex gap-4 pb-5 last:pb-0 relative">
                {i < DEMO.echanges.length - 1 && (
                  <div className="absolute left-[15px] top-8 bottom-0 w-0.5 bg-[#F5F5F7]" />
                )}
                <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10" style={{ backgroundColor: `${cfg.color}18` }}>
                  <cfg.icon className="w-4 h-4" style={{ color: cfg.color }} />
                </div>
                <div className="flex-1 pt-0.5">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-[13px] font-semibold text-[#1D1D1F]">{cfg.label}</span>
                    <span className="text-[11px] text-[#6E6E73]">{e.date} à {e.heure} · {e.duree}</span>
                  </div>
                  <div className="text-[12px] text-[#6E6E73] mb-1.5">Participants : {e.participants.join(', ')}</div>
                  <div className="text-[13px] text-[#1D1D1F] bg-[#F9F9FB] rounded-xl p-3 leading-relaxed">{e.resume}</div>
                </div>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}

// ─── Tab: Contacts ────────────────────────────────────────────────────────────

function TabContacts() {
  return (
    <div className="space-y-6">
      {/* Professionnels contactés */}
      <Card>
        <SectionHead icon={Users} label="Professionnels contactés pour ce chantier" color="#0071E3" count={DEMO.contacts.prosContactes.length} />
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-[#F9F9FB] border-b border-[#E5E5EA]">
              {['Professionnel', 'Activité', 'Date contact', 'Statut', 'Note'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6E6E73]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F5F5F7]">
            {DEMO.contacts.prosContactes.map((p, i) => {
              const s = PRO_STATUT[p.statut]
              return (
                <tr key={i} className="hover:bg-[#F5F5F7] transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-[#0071E3]/10 flex items-center justify-center shrink-0">
                        <span className="text-[10px] font-bold text-[#0071E3]">{p.nom.split(' ').map(n => n[0]).join('')}</span>
                      </div>
                      <span className="text-[13px] font-semibold text-[#1D1D1F]">{p.nom}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3"><ActiviteBadge slug={p.activite} /></td>
                  <td className="px-4 py-3 text-[12px] text-[#6E6E73]">{p.date}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-semibold ${s.className}`}>{s.label}</span>
                  </td>
                  <td className="px-4 py-3 text-[12px] text-[#6E6E73] italic">{p.note}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </Card>

      {/* Pros connus personnellement */}
      <Card>
        <SectionHead icon={UserPlus} label="Professionnels entrés par le client" color="#FF9500" count={DEMO.contacts.prosConnus.length} />
        <div className="space-y-3">
          {DEMO.contacts.prosConnus.map((p, i) => (
            <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-[#FFF3E0] border border-[#FFE0B2]">
              <div className="w-9 h-9 rounded-full bg-[#FF9500]/15 flex items-center justify-center shrink-0">
                <span className="text-[12px] font-bold text-[#FF9500]">{p.nom.split(' ').map(n => n[0]).join('')}</span>
              </div>
              <div className="flex-1">
                <div className="font-semibold text-[13px] text-[#1D1D1F]">{p.nom}</div>
                <div className="text-[12px] text-[#6E6E73]">{p.note}</div>
              </div>
              <ActiviteBadge slug={p.activite} />
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full text-[#FF9500] bg-[#FF9500]/10">Connaissance perso</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Autres clients */}
      <Card>
        <SectionHead icon={Users} label="Autres clients (réseau & entraide)" color="#AF52DE" count={DEMO.contacts.autresClients.length} />
        <div className="space-y-3">
          {DEMO.contacts.autresClients.map((c, i) => (
            <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-[#F5EEFF] border border-[#E5D5FF]">
              <div className="w-9 h-9 rounded-full bg-[#AF52DE]/15 flex items-center justify-center shrink-0">
                <span className="text-[12px] font-bold text-[#AF52DE]">{c.nom.split(' ').map(n => n[0]).join('')}</span>
              </div>
              <div className="flex-1">
                <div className="font-semibold text-[13px] text-[#1D1D1F]">{c.nom}</div>
                <div className="text-[12px] text-[#6E6E73]">{c.lien} · {c.date}</div>
                <div className="text-[12px] text-[#AF52DE] mt-0.5">{c.note}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

// ─── Tab: Notes ───────────────────────────────────────────────────────────────

function TabNotes() {
  const all = [...DEMO.notes.parPros.map(n => n.note), ...DEMO.notes.parClients.map(n => n.note)]
  const moy = all.length ? (all.reduce((s, n) => s + n, 0) / all.length).toFixed(1) : '—'
  return (
    <div className="space-y-6">
      <Card>
        <div className="flex items-center gap-8">
          <div className="text-center">
            <div className="text-[48px] font-bold text-[#1D1D1F] leading-none">{moy}</div>
            <div className="mt-1"><Stars note={Math.round(parseFloat(moy))} /></div>
            <div className="text-[12px] text-[#6E6E73] mt-1">Note globale</div>
          </div>
          <div className="w-px h-16 bg-[#E5E5EA]" />
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-[12px] text-[#6E6E73] w-32">Par les pros</span>
              <Stars note={Math.round(DEMO.notes.parPros.reduce((s,n)=>s+n.note,0)/Math.max(1,DEMO.notes.parPros.length))} />
              <span className="text-[12px] text-[#6E6E73]">({DEMO.notes.parPros.length} avis)</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[12px] text-[#6E6E73] w-32">Par d'autres clients</span>
              <Stars note={Math.round(DEMO.notes.parClients.reduce((s,n)=>s+n.note,0)/Math.max(1,DEMO.notes.parClients.length))} />
              <span className="text-[12px] text-[#6E6E73]">({DEMO.notes.parClients.length} avis)</span>
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <h3 className="text-[15px] font-bold text-[#1D1D1F] mb-4">Avis des professionnels</h3>
        <div className="space-y-4">
          {DEMO.notes.parPros.map((n, i) => (
            <div key={i} className="p-4 rounded-xl bg-[#F9F9FB] border border-[#F5F5F7]">
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <div className="font-semibold text-[13px] text-[#1D1D1F]">{n.pro}</div>
                  <div className="text-[12px] text-[#6E6E73]">Chantier : {n.chantier} · {n.date}</div>
                </div>
                <Stars note={n.note} />
              </div>
              <p className="text-[13px] text-[#1D1D1F] leading-relaxed">{n.commentaire}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h3 className="text-[15px] font-bold text-[#1D1D1F] mb-4">Avis d'autres clients</h3>
        <div className="space-y-4">
          {DEMO.notes.parClients.map((n, i) => (
            <div key={i} className="p-4 rounded-xl bg-[#F9F9FB] border border-[#F5F5F7]">
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <div className="font-semibold text-[13px] text-[#1D1D1F]">{n.client}</div>
                  <div className="text-[12px] text-[#6E6E73]">{n.date}</div>
                </div>
                <Stars note={n.note} />
              </div>
              <p className="text-[13px] text-[#1D1D1F] leading-relaxed">{n.commentaire}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

type Tab = 'identification' | 'chantier' | 'activite' | 'contacts' | 'notes'
const TABS: { id: Tab; label: string }[] = [
  { id: 'identification', label: 'Identification' },
  { id: 'chantier',       label: 'Chantier' },
  { id: 'activite',       label: 'Activité' },
  { id: 'contacts',       label: 'Contacts' },
  { id: 'notes',          label: 'Notes & Avis' },
]

export function ClientDetailClient({ id }: { id: string }) {
  const [activeTab, setActiveTab] = useState<Tab>('identification')
  const encodedName = encodeURIComponent(`${DEMO.prenom} ${DEMO.nom}`)
  const totalChantiers = DEMO.historique.length + 1
  const noteGlobale = (() => {
    const all = [...DEMO.notes.parPros.map(n=>n.note), ...DEMO.notes.parClients.map(n=>n.note)]
    return all.length ? (all.reduce((s,n)=>s+n,0)/all.length).toFixed(1) : '—'
  })()

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <Link href="/admin/clients" className="inline-flex items-center gap-1.5 text-[13px] text-[#6E6E73] hover:text-[#1D1D1F] transition-colors mb-6">
        <ArrowLeft className="w-3.5 h-3.5" />
        Retour aux clients
      </Link>

      {/* Header */}
      <div className="bg-white rounded-2xl border border-[#E5E5EA] p-6 mb-6">
        <div className="flex items-start justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#34C759]/10 flex items-center justify-center shrink-0">
              <span className="text-[22px] font-bold text-[#34C759]">{DEMO.prenom[0]}{DEMO.nom[0]}</span>
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-[22px] font-bold text-[#1D1D1F] tracking-tight">{DEMO.prenom} {DEMO.nom}</h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[12px] font-semibold text-[#6E6E73] bg-[#F5F5F7]">
                  Particulier
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-semibold text-[#34C759] bg-[#34C759]/10">
                  <HardHat className="w-3 h-3" /> Chantier en cours
                </span>
              </div>
              <div className="text-[13px] text-[#6E6E73] mt-0.5">{DEMO.bien.type.charAt(0).toUpperCase() + DEMO.bien.type.slice(1)} · {DEMO.bien.surface} m² · {DEMO.adresse}</div>
              <div className="text-[13px] text-[#6E6E73] mt-0.5">{DEMO.email} · {DEMO.tel}</div>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <a
              href={`/admin/impersonate?id=${DEMO.id}&type=client&name=${encodedName}`}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#FF9500]/10 text-[#FF9500] text-[13px] font-semibold rounded-xl hover:bg-[#FF9500]/20 transition-colors"
            >
              <LogIn className="w-4 h-4" />
              Accéder au portail
            </a>
            <button className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#0071E3] text-white text-[13px] font-semibold rounded-xl hover:bg-[#0077ED] transition-colors">
              Modifier
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Chantiers',     value: String(totalChantiers), icon: HardHat,  color: '#34C759', bg: '#F0FFF4' },
          { label: 'Documents',     value: String(DEMO.documents.reduce((s,d)=>s+d.nb,0)), icon: FileText, color: '#0071E3', bg: '#EBF5FF' },
          { label: 'Note moyenne',  value: `★ ${noteGlobale}`,    icon: null,     color: '#FF9500', bg: '#FFF3E0' },
          { label: 'Valeur travaux',value: '9 600 €',              icon: Banknote, color: '#AF52DE', bg: '#F5EEFF' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl border border-[#E5E5EA] p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[12px] text-[#6E6E73] font-medium">{stat.label}</span>
              {stat.icon && (
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: stat.bg }}>
                  <stat.icon className="w-3.5 h-3.5" style={{ color: stat.color }} />
                </div>
              )}
            </div>
            <div className="text-[22px] font-bold" style={{ color: stat.color }}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-[#F5F5F7] rounded-xl w-fit mb-6 flex-wrap">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-[13px] font-semibold transition-all ${
              activeTab === tab.id ? 'bg-white text-[#1D1D1F] shadow-sm' : 'text-[#6E6E73] hover:text-[#1D1D1F]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'identification' && <TabIdentification />}
      {activeTab === 'chantier'       && <TabChantier />}
      {activeTab === 'activite'       && <TabActivite />}
      {activeTab === 'contacts'       && <TabContacts />}
      {activeTab === 'notes'          && <TabNotes />}
    </div>
  )
}
