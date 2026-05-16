'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft, LogIn, Mail, Phone, Globe, MapPin, Building2,
  CheckCircle2, Clock, XCircle, AlertCircle, FileText,
  Network, Calendar, Euro, Briefcase, ThumbsUp, Users,
} from 'lucide-react'
import { ActiviteBadge, ActiviteList } from '@/components/ActiviteBadge'
import type { ActiviteSlug } from '@/lib/activites'

// ─── Demo data ──────────────────────────────────────────────────────────────

const DEMO = {
  id: '11111111-1111-1111-1111-111111111111',
  prenom: 'Sophie', nom: 'Martin',
  type: 'independant' as const,
  raisonSociale: 'Sophie Martin EI',
  siren: '845 123 456',
  tvaIntracom: 'FR12845123456',
  adresse: '12 rue du Faubourg Saint-Antoine', codePostal: '75011', ville: 'Paris',
  email: 'sophie.martin@email.fr', tel: '06 12 34 56 78', siteWeb: 'www.sm-plomberie.fr',
  activites: ['plomberie', 'chauffage'] as ActiviteSlug[],
  langues: ['Français', 'Anglais'],
  projets: 8, galaxieTotal: 35, noteMoyenne: 4.7, ca: '38 500 €',
  convention: {
    statut: 'signee' as 'envoyee' | 'attente' | 'signee' | 'validee',
    dateEnvoi: '15 oct. 2024', dateSignature: '22 oct. 2024', dateValidation: '25 oct. 2024',
  },
  galaxie: [
    { niveau: 1, count: 3, taux: 20 }, { niveau: 2, count: 7, taux: 5 },
    { niveau: 3, count: 12, taux: 4 }, { niveau: 4, count: 8, taux: 3 }, { niveau: 5, count: 5, taux: 2 },
  ],
  documents: [
    { nom: 'Convention partenaire', statut: 'recu' as const, date: '22 oct. 2024' },
    { nom: "Pièce d'identité", statut: 'recu' as const, date: '20 oct. 2024' },
    { nom: 'Kbis / Attestation AE', statut: 'manquant' as const },
  ],
  pipeline: [
    { col: 'leads',    nom: 'Jean Dupont',   activite: 'plomberie' as ActiviteSlug, score: 'hot',  valeur: '3 200 €', info: 'Ajouté il y a 2j' },
    { col: 'leads',    nom: 'Marie Lebon',   activite: 'chauffage' as ActiviteSlug, score: 'warm', valeur: '1 800 €', info: 'Ajouté il y a 5j' },
    { col: 'contacte', nom: 'Paul Moreau',   activite: 'plomberie' as ActiviteSlug, score: 'warm', valeur: '4 500 €', info: 'Relance en attente' },
    { col: 'rdv',      nom: 'Alice Renard',  activite: 'chauffage' as ActiviteSlug, score: 'hot',  valeur: '6 200 €', info: 'Demain 14h00' },
    { col: 'devis',    nom: 'Robert Klein',  activite: 'plomberie' as ActiviteSlug, score: 'warm', valeur: '2 700 €', info: 'Envoyé le 3 nov.' },
    { col: 'gagne',    nom: 'Hélène Vidal',  activite: 'chauffage' as ActiviteSlug, score: 'hot',  valeur: '5 400 €', info: 'Signé le 28 oct.' },
    { col: 'perdu',    nom: 'Marc Tissot',   activite: 'plomberie' as ActiviteSlug, score: 'cold', valeur: '1 200 €', info: 'Pas de suite' },
  ],
  chantiers: [
    { id: 'CH-2024-051', client: 'M. Renard',          activite: 'chauffage' as ActiviteSlug, montant: '6 200 €',  date: '20 oct. 2024', statut: 'en_cours' as const },
    { id: 'CH-2024-042', client: 'Famille Dupont',      activite: 'plomberie' as ActiviteSlug, montant: '3 200 €',  date: '15 sept. 2024', statut: 'termine' as const },
    { id: 'CH-2024-033', client: 'Mme Klein',           activite: 'plomberie' as ActiviteSlug, montant: '1 800 €',  date: '5 août 2024',  statut: 'termine' as const },
    { id: 'CH-2024-021', client: 'Résidence Lumière',   activite: 'chauffage' as ActiviteSlug, montant: '18 500 €', date: '12 juil. 2024', statut: 'termine' as const },
  ],
  devisFactures: [
    { type: 'devis' as const,    ref: 'DE-2024-018', client: 'Alice Renard',       montant: '6 200 €',  date: '1 nov. 2024',   statut: 'envoye' as const },
    { type: 'devis' as const,    ref: 'DE-2024-021', client: 'Robert Klein',        montant: '2 700 €',  date: '3 nov. 2024',   statut: 'draft' as const },
    { type: 'facture' as const,  ref: 'FA-2024-042', client: 'Famille Dupont',      montant: '3 200 €',  date: '20 sept. 2024', statut: 'paye' as const },
    { type: 'facture' as const,  ref: 'FA-2024-038', client: 'Résidence Lumière',   montant: '18 500 €', date: '30 août 2024',  statut: 'paye' as const },
    { type: 'facture' as const,  ref: 'FA-2024-031', client: 'Mme Klein',           montant: '1 800 €',  date: '8 août 2024',   statut: 'paye' as const },
  ],
  recommandations: [
    { artisan: 'Thomas Dupont', activite: 'electricite' as ActiviteSlug, client: 'Famille Dupont',    date: '18 sept. 2024', statut: 'accepte' as const },
    { artisan: 'Julie Bernard', activite: 'maconnerie'  as ActiviteSlug, client: 'Résidence Lumière', date: '15 juil. 2024', statut: 'en_cours' as const },
  ],
  notesClients: [
    { note: 5, commentaire: "Travail impeccable, très professionnelle et ponctuelle. Je recommande sans hésitation.", chantier: 'Rénovation salle de bain', client: 'M. & Mme Dupont', date: '25 sept. 2024' },
    { note: 4, commentaire: "Bonne qualité d'exécution, léger retard au démarrage mais résultat au rendez-vous.", chantier: 'Installation chaudière', client: 'Résidence Lumière', date: '10 août 2024' },
    { note: 5, commentaire: "Très à l'écoute et réactive. Problème résolu rapidement.", chantier: 'Dépannage plomberie', client: 'Mme Klein', date: '7 août 2024' },
  ],
  notesConfreres: [
    { note: 5, commentaire: "Excellente coordination sur le chantier Dupont. Respect des délais et très bonne communication.", contexte: 'Chantier Dupont — plomberie + électricité', artisan: 'Thomas Dupont', date: '30 sept. 2024' },
    { note: 4, commentaire: "Professionnelle et réactive. Je referai des chantiers avec elle sans hésiter.", contexte: "Résidence Lumière — travaux multi-corps d'état", artisan: 'Julie Bernard', date: '15 août 2024' },
  ],
}

// ─── Pipeline columns config ─────────────────────────────────────────────────

const PIPELINE_COLS = [
  { id: 'leads',    label: 'Nouveaux leads',   color: '#6E6E73', bg: '#F5F5F7' },
  { id: 'contacte', label: 'Contacté',         color: '#0071E3', bg: '#EBF5FF' },
  { id: 'rdv',      label: 'RDV planifié',     color: '#FF9500', bg: '#FFF3E0' },
  { id: 'devis',    label: 'Devis envoyé',     color: '#AF52DE', bg: '#F5EEFF' },
  { id: 'gagne',    label: 'Gagné',            color: '#34C759', bg: '#F0FFF4' },
  { id: 'perdu',    label: 'Perdu',            color: '#FF3B30', bg: '#FFF0EF' },
]

const SCORE_CONFIG = {
  hot:  { label: 'Chaud',  className: 'text-[#FF3B30] bg-[#FF3B30]/10' },
  warm: { label: 'Tiède',  className: 'text-[#FF9500] bg-[#FF9500]/10' },
  cold: { label: 'Froid',  className: 'text-[#6E6E73] bg-[#F5F5F7]' },
}

// ─── Small helpers ───────────────────────────────────────────────────────────

function Stars({ note }: { note: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={`text-[15px] ${i <= note ? 'text-[#FF9500]' : 'text-[#D1D1D6]'}`}>★</span>
      ))}
    </div>
  )
}

function InfoRow({ icon: Icon, label, value, href }: { icon: React.ElementType; label: string; value: string; href?: string }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-[#F5F5F7] last:border-0">
      <Icon className="w-4 h-4 text-[#C7C7CC] mt-0.5 shrink-0" />
      <div className="min-w-0">
        <div className="text-[11px] text-[#6E6E73] uppercase tracking-wide font-semibold mb-0.5">{label}</div>
        {href ? (
          <a href={href} className="text-[13px] text-[#0071E3] hover:underline">{value}</a>
        ) : (
          <div className="text-[13px] text-[#1D1D1F] font-medium">{value}</div>
        )}
      </div>
    </div>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="text-[15px] font-bold text-[#1D1D1F] mb-4">{children}</h3>
}

// ─── Tab content components ──────────────────────────────────────────────────

function TabIdentification() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Coordonnées */}
      <div className="bg-white rounded-2xl border border-[#E5E5EA] p-6">
        <SectionTitle>Coordonnées</SectionTitle>
        <InfoRow icon={Mail}   label="Email"     value={DEMO.email}   href={`mailto:${DEMO.email}`} />
        <InfoRow icon={Phone}  label="Téléphone" value={DEMO.tel}     href={`tel:${DEMO.tel.replace(/\s/g, '')}`} />
        <InfoRow icon={MapPin} label="Adresse"   value={`${DEMO.adresse}, ${DEMO.codePostal} ${DEMO.ville}`} />
        <InfoRow icon={Globe}  label="Site web"  value={DEMO.siteWeb} href={`https://${DEMO.siteWeb}`} />
        <div className="pt-3">
          <div className="text-[11px] text-[#6E6E73] uppercase tracking-wide font-semibold mb-2">Langues</div>
          <div className="flex gap-2">
            {DEMO.langues.map((l) => (
              <span key={l} className="px-2.5 py-1 rounded-full bg-[#F5F5F7] text-[12px] font-semibold text-[#1D1D1F]">{l}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Informations professionnelles */}
      <div className="bg-white rounded-2xl border border-[#E5E5EA] p-6">
        <SectionTitle>Informations professionnelles</SectionTitle>
        <InfoRow icon={Building2} label="Raison sociale" value={DEMO.raisonSociale} />
        <InfoRow icon={FileText}  label="SIREN"           value={DEMO.siren} />
        <InfoRow icon={FileText}  label="TVA intracommunautaire" value={DEMO.tvaIntracom} />
        <div className="pt-3">
          <div className="text-[11px] text-[#6E6E73] uppercase tracking-wide font-semibold mb-2">Activités</div>
          <ActiviteList slugs={DEMO.activites} />
        </div>
      </div>
    </div>
  )
}

function TabAdministratif() {
  const CONV_STEPS = [
    { label: 'Convention envoyée',     date: DEMO.convention.dateEnvoi,      done: true },
    { label: 'En attente de signature', date: '—',                           done: DEMO.convention.statut !== 'envoyee' },
    { label: 'Convention signée',       date: DEMO.convention.dateSignature, done: ['signee', 'validee'].includes(DEMO.convention.statut) },
    { label: 'Validée par InvestHub',   date: DEMO.convention.dateValidation, done: DEMO.convention.statut === 'validee' },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Convention */}
      <div className="bg-white rounded-2xl border border-[#E5E5EA] p-6">
        <SectionTitle>Convention partenaire</SectionTitle>
        <div className="space-y-0">
          {CONV_STEPS.map((step, i) => (
            <div key={i} className="flex gap-4 pb-4 last:pb-0 relative">
              {i < CONV_STEPS.length - 1 && (
                <div className={`absolute left-[11px] top-6 bottom-0 w-0.5 ${step.done ? 'bg-[#34C759]' : 'bg-[#E5E5EA]'}`} />
              )}
              <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 z-10 ${step.done ? 'bg-[#34C759]' : 'bg-[#F5F5F7]'}`}>
                {step.done
                  ? <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                  : <Clock className="w-3.5 h-3.5 text-[#C7C7CC]" />}
              </div>
              <div>
                <div className={`text-[13px] font-semibold ${step.done ? 'text-[#1D1D1F]' : 'text-[#C7C7CC]'}`}>{step.label}</div>
                <div className="text-[12px] text-[#6E6E73]">{step.date}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Documents */}
      <div className="bg-white rounded-2xl border border-[#E5E5EA] p-6">
        <SectionTitle>Documents</SectionTitle>
        <div className="space-y-3">
          {DEMO.documents.map((doc, i) => (
            <div key={i} className="flex items-center justify-between py-2.5 border-b border-[#F5F5F7] last:border-0">
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4 text-[#C7C7CC]" />
                <span className="text-[13px] text-[#1D1D1F] font-medium">{doc.nom}</span>
              </div>
              {doc.statut === 'recu' ? (
                <div className="flex items-center gap-1.5">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold text-[#34C759] bg-[#34C759]/10">
                    <CheckCircle2 className="w-3 h-3" /> Reçu
                  </span>
                  <span className="text-[11px] text-[#6E6E73]">{doc.date}</span>
                </div>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold text-[#FF3B30] bg-[#FF3B30]/10">
                  <XCircle className="w-3 h-3" /> Manquant
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Galaxie */}
      <div className="bg-white rounded-2xl border border-[#E5E5EA] p-6 md:col-span-2">
        <div className="flex items-center gap-2 mb-4">
          <Network className="w-4 h-4 text-[#AF52DE]" />
          <SectionTitle>Réseau · Galaxie</SectionTitle>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-[#F9F9FB] border-b border-[#E5E5EA]">
                {['Niveau', 'Contacts', 'Taux MLM', 'Contribution estimée'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6E6E73]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5F5F7]">
              {DEMO.galaxie.map((row) => (
                <tr key={row.niveau} className="hover:bg-[#F5F5F7] transition-colors">
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-semibold text-[#AF52DE] bg-[#AF52DE]/10">
                      <Network className="w-3 h-3" /> N{row.niveau}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-semibold text-[14px] text-[#1D1D1F]">{row.count}</td>
                  <td className="px-4 py-3 text-[13px] text-[#1D1D1F]">{row.taux} %</td>
                  <td className="px-4 py-3 text-[13px] text-[#6E6E73]">calculé sur CA reversé</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function TabActivite() {
  // Statuts chantier
  const CHANTIER_STATUS = {
    en_cours:  { label: 'En cours',  className: 'text-[#0071E3] bg-[#EBF5FF]' },
    termine:   { label: 'Terminé',   className: 'text-[#34C759] bg-[#34C759]/10' },
    annule:    { label: 'Annulé',    className: 'text-[#FF3B30] bg-[#FF3B30]/10' },
  }
  const DF_STATUS = {
    draft:   { label: 'Brouillon', className: 'text-[#6E6E73] bg-[#F5F5F7]' },
    envoye:  { label: 'Envoyé',   className: 'text-[#0071E3] bg-[#EBF5FF]' },
    paye:    { label: 'Payé',     className: 'text-[#34C759] bg-[#34C759]/10' },
  }
  const RECO_STATUS = {
    accepte:  { label: 'Accepté',   className: 'text-[#34C759] bg-[#34C759]/10' },
    en_cours: { label: 'En cours',  className: 'text-[#0071E3] bg-[#EBF5FF]' },
    refuse:   { label: 'Refusé',    className: 'text-[#FF3B30] bg-[#FF3B30]/10' },
  }

  return (
    <div className="space-y-8">

      {/* Pipeline CRM */}
      <div className="bg-white rounded-2xl border border-[#E5E5EA] p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#0071E3]" />
            <h3 className="text-[15px] font-bold text-[#1D1D1F]">Pipeline CRM</h3>
          </div>
          <span className="text-[12px] text-[#6E6E73]">{DEMO.pipeline.length} contacts</span>
        </div>
        <div className="overflow-x-auto pb-2">
          <div className="flex gap-3 min-w-max">
            {PIPELINE_COLS.map((col) => {
              const cards = DEMO.pipeline.filter((p) => p.col === col.id)
              return (
                <div key={col.id} className="w-[200px] shrink-0">
                  <div className="flex items-center justify-between mb-2.5 px-1">
                    <span className="text-[11px] font-bold uppercase tracking-wide" style={{ color: col.color }}>{col.label}</span>
                    <span className="text-[11px] font-semibold text-[#6E6E73] bg-[#F5F5F7] px-1.5 py-0.5 rounded-full">{cards.length}</span>
                  </div>
                  <div className="space-y-2">
                    {cards.length === 0 ? (
                      <div className="rounded-xl border border-dashed border-[#E5E5EA] h-16 flex items-center justify-center">
                        <span className="text-[11px] text-[#C7C7CC]">Vide</span>
                      </div>
                    ) : cards.map((card, i) => (
                      <div key={i} className="bg-white rounded-xl border border-[#E5E5EA] p-3 hover:border-[#C7C7CC] transition-colors">
                        <div className="flex items-start justify-between gap-1 mb-2">
                          <span className="text-[12px] font-semibold text-[#1D1D1F] leading-tight">{card.nom}</span>
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${SCORE_CONFIG[card.score as keyof typeof SCORE_CONFIG].className}`}>
                            {SCORE_CONFIG[card.score as keyof typeof SCORE_CONFIG].label}
                          </span>
                        </div>
                        <ActiviteBadge slug={card.activite} />
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-[11px] font-bold text-[#1D1D1F]">{card.valeur}</span>
                        </div>
                        <div className="text-[10px] text-[#6E6E73] mt-1">{card.info}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Chantiers */}
      <div className="bg-white rounded-2xl border border-[#E5E5EA] p-6">
        <div className="flex items-center gap-2 mb-4">
          <Briefcase className="w-4 h-4 text-[#34C759]" />
          <h3 className="text-[15px] font-bold text-[#1D1D1F]">Chantiers réalisés</h3>
        </div>
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-[#F9F9FB] border-b border-[#E5E5EA]">
              {['Référence', 'Client', 'Activité', 'Montant', 'Date', 'Statut'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6E6E73]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F5F5F7]">
            {DEMO.chantiers.map((c) => (
              <tr key={c.id} className="hover:bg-[#F5F5F7] transition-colors">
                <td className="px-4 py-3 text-[12px] font-mono text-[#6E6E73]">{c.id}</td>
                <td className="px-4 py-3 text-[13px] font-medium text-[#1D1D1F]">{c.client}</td>
                <td className="px-4 py-3"><ActiviteBadge slug={c.activite} /></td>
                <td className="px-4 py-3 text-[13px] font-semibold text-[#1D1D1F]">{c.montant}</td>
                <td className="px-4 py-3 text-[12px] text-[#6E6E73]">{c.date}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-semibold ${CHANTIER_STATUS[c.statut].className}`}>
                    {CHANTIER_STATUS[c.statut].label}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Devis & Factures */}
      <div className="bg-white rounded-2xl border border-[#E5E5EA] p-6">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-4 h-4 text-[#AF52DE]" />
          <h3 className="text-[15px] font-bold text-[#1D1D1F]">Devis & Factures</h3>
        </div>
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-[#F9F9FB] border-b border-[#E5E5EA]">
              {['Type', 'Référence', 'Client', 'Montant', 'Date', 'Statut'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6E6E73]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F5F5F7]">
            {DEMO.devisFactures.map((d) => (
              <tr key={d.ref} className="hover:bg-[#F5F5F7] transition-colors">
                <td className="px-4 py-3">
                  <span className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-semibold ${d.type === 'facture' ? 'text-[#0071E3] bg-[#EBF5FF]' : 'text-[#AF52DE] bg-[#F5EEFF]'}`}>
                    {d.type === 'facture' ? 'Facture' : 'Devis'}
                  </span>
                </td>
                <td className="px-4 py-3 text-[12px] font-mono text-[#6E6E73]">{d.ref}</td>
                <td className="px-4 py-3 text-[13px] text-[#1D1D1F]">{d.client}</td>
                <td className="px-4 py-3 text-[13px] font-semibold text-[#1D1D1F]">{d.montant}</td>
                <td className="px-4 py-3 text-[12px] text-[#6E6E73]">{d.date}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-semibold ${DF_STATUS[d.statut].className}`}>
                    {DF_STATUS[d.statut].label}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Recommandations */}
      <div className="bg-white rounded-2xl border border-[#E5E5EA] p-6">
        <div className="flex items-center gap-2 mb-4">
          <ThumbsUp className="w-4 h-4 text-[#FF9500]" />
          <h3 className="text-[15px] font-bold text-[#1D1D1F]">Recommandations faites</h3>
        </div>
        <div className="space-y-3">
          {DEMO.recommandations.map((r, i) => (
            <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-[#F9F9FB] border border-[#F5F5F7]">
              <div className="w-9 h-9 rounded-full bg-[#FF9500]/10 flex items-center justify-center shrink-0">
                <span className="text-[13px] font-bold text-[#FF9500]">{r.artisan.split(' ').map((n) => n[0]).join('')}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-[13px] text-[#1D1D1F]">{r.artisan}</div>
                <div className="text-[12px] text-[#6E6E73]">Pour {r.client} · {r.date}</div>
              </div>
              <ActiviteBadge slug={r.activite} />
              <span className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-semibold ${RECO_STATUS[r.statut].className}`}>
                {RECO_STATUS[r.statut].label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function TabNotes() {
  const moyClients = (DEMO.notesClients.reduce((s, n) => s + n.note, 0) / DEMO.notesClients.length).toFixed(1)
  const moyConfreres = (DEMO.notesConfreres.reduce((s, n) => s + n.note, 0) / DEMO.notesConfreres.length).toFixed(1)
  const moyGlobale = ((DEMO.notesClients.reduce((s, n) => s + n.note, 0) + DEMO.notesConfreres.reduce((s, n) => s + n.note, 0)) / (DEMO.notesClients.length + DEMO.notesConfreres.length)).toFixed(1)

  return (
    <div className="space-y-6">
      {/* Score global */}
      <div className="bg-white rounded-2xl border border-[#E5E5EA] p-6">
        <div className="flex items-center gap-8">
          <div className="text-center">
            <div className="text-[48px] font-bold text-[#1D1D1F] leading-none">{moyGlobale}</div>
            <div className="mt-1"><Stars note={Math.round(parseFloat(moyGlobale))} /></div>
            <div className="text-[12px] text-[#6E6E73] mt-1">Note globale</div>
          </div>
          <div className="w-px h-16 bg-[#E5E5EA]" />
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-[12px] text-[#6E6E73] w-28">Clients finaux</span>
              <Stars note={Math.round(parseFloat(moyClients))} />
              <span className="text-[13px] font-semibold text-[#1D1D1F]">{moyClients}</span>
              <span className="text-[12px] text-[#6E6E73]">({DEMO.notesClients.length} avis)</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[12px] text-[#6E6E73] w-28">Confrères</span>
              <Stars note={Math.round(parseFloat(moyConfreres))} />
              <span className="text-[13px] font-semibold text-[#1D1D1F]">{moyConfreres}</span>
              <span className="text-[12px] text-[#6E6E73]">({DEMO.notesConfreres.length} avis)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Notes clients */}
      <div className="bg-white rounded-2xl border border-[#E5E5EA] p-6">
        <h3 className="text-[15px] font-bold text-[#1D1D1F] mb-4">Avis des clients finaux</h3>
        <div className="space-y-4">
          {DEMO.notesClients.map((n, i) => (
            <div key={i} className="p-4 rounded-xl bg-[#F9F9FB] border border-[#F5F5F7]">
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <div className="font-semibold text-[13px] text-[#1D1D1F]">{n.client}</div>
                  <div className="text-[12px] text-[#6E6E73]">Chantier : {n.chantier} · {n.date}</div>
                </div>
                <Stars note={n.note} />
              </div>
              <p className="text-[13px] text-[#1D1D1F] leading-relaxed">{n.commentaire}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Notes confrères */}
      <div className="bg-white rounded-2xl border border-[#E5E5EA] p-6">
        <h3 className="text-[15px] font-bold text-[#1D1D1F] mb-4">Avis des confrères artisans</h3>
        <div className="space-y-4">
          {DEMO.notesConfreres.map((n, i) => (
            <div key={i} className="p-4 rounded-xl bg-[#F9F9FB] border border-[#F5F5F7]">
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <div className="font-semibold text-[13px] text-[#1D1D1F]">{n.artisan}</div>
                  <div className="text-[12px] text-[#6E6E73]">{n.contexte} · {n.date}</div>
                </div>
                <Stars note={n.note} />
              </div>
              <p className="text-[13px] text-[#1D1D1F] leading-relaxed">{n.commentaire}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Main component ──────────────────────────────────────────────────────────

type Tab = 'identification' | 'administratif' | 'activite' | 'notes'

const TABS: { id: Tab; label: string }[] = [
  { id: 'identification', label: 'Identification' },
  { id: 'administratif',  label: 'Administratif' },
  { id: 'activite',       label: 'Activité' },
  { id: 'notes',          label: 'Notes & Avis' },
]

export function ArtisanDetailClient({ id }: { id: string }) {
  const [activeTab, setActiveTab] = useState<Tab>('identification')
  const encodedName = encodeURIComponent(`${DEMO.prenom} ${DEMO.nom}`)

  return (
    <div className="p-8 max-w-6xl mx-auto">

      {/* Navigation retour */}
      <Link href="/admin/artisans" className="inline-flex items-center gap-1.5 text-[13px] text-[#6E6E73] hover:text-[#1D1D1F] transition-colors mb-6">
        <ArrowLeft className="w-3.5 h-3.5" />
        Retour aux artisans
      </Link>

      {/* Header */}
      <div className="bg-white rounded-2xl border border-[#E5E5EA] p-6 mb-6">
        <div className="flex items-start justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#0071E3]/10 flex items-center justify-center shrink-0">
              <span className="text-[22px] font-bold text-[#0071E3]">{DEMO.prenom[0]}{DEMO.nom[0]}</span>
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-[22px] font-bold text-[#1D1D1F] tracking-tight">{DEMO.prenom} {DEMO.nom}</h1>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-semibold text-[#6E6E73] bg-[#F5F5F7]">
                  Indépendant
                </span>
              </div>
              <div className="text-[13px] text-[#6E6E73] mt-0.5">{DEMO.raisonSociale} · SIREN {DEMO.siren}</div>
              <div className="mt-2">
                <ActiviteList slugs={DEMO.activites} />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <a
              href={`/admin/impersonate?id=${DEMO.id}&type=artisan&name=${encodedName}`}
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
          { label: 'Projets réalisés', value: String(DEMO.projets),         icon: Briefcase, color: '#0071E3', bg: '#EBF5FF' },
          { label: 'Taille galaxie',   value: String(DEMO.galaxieTotal),    icon: Network,   color: '#AF52DE', bg: '#F5EEFF' },
          { label: 'Note moyenne',     value: `★ ${DEMO.noteMoyenne}`,      icon: null,      color: '#FF9500', bg: '#FFF3E0' },
          { label: "CA total",         value: DEMO.ca,                      icon: Euro,      color: '#34C759', bg: '#F0FFF4' },
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
      <div className="flex gap-1 p-1 bg-[#F5F5F7] rounded-xl w-fit mb-6">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-[13px] font-semibold transition-all ${
              activeTab === tab.id
                ? 'bg-white text-[#1D1D1F] shadow-sm'
                : 'text-[#6E6E73] hover:text-[#1D1D1F]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'identification' && <TabIdentification />}
      {activeTab === 'administratif'  && <TabAdministratif />}
      {activeTab === 'activite'       && <TabActivite />}
      {activeTab === 'notes'          && <TabNotes />}
    </div>
  )
}
