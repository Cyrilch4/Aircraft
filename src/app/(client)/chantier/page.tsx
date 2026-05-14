import { CheckCircle2, Clock, Circle, FileText, Phone, Mail } from 'lucide-react'

const ETAPES = [
  { label: 'Devis accepté', date: '12 mars 2026', done: true },
  { label: 'Acompte reçu (30 %)', date: '18 mars 2026', done: true },
  { label: 'Démarrage des travaux', date: '1er avril 2026', done: true },
  { label: 'Finitions', date: 'En cours', done: false, active: true },
  { label: 'Réception du chantier', date: 'Prévu mi-juin 2026', done: false },
]

const DOCUMENTS = [
  { label: 'Devis signé', ref: 'DEV-2026-012', date: '12 mars 2026' },
  { label: 'Contrat de travaux', ref: 'CTR-2026-008', date: '15 mars 2026' },
  { label: 'Facture acompte 30 %', ref: 'FAC-2026-031', date: '18 mars 2026' },
]

export default function ChantierPage() {
  const progress = Math.round((ETAPES.filter((e) => e.done).length / ETAPES.length) * 100)

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      {/* Header chantier */}
      <div className="mb-8">
        <div className="text-[13px] font-medium text-[#6E6E73] mb-1">Rénovation complète</div>
        <h1 className="text-[28px] font-bold text-[#1D1D1F] tracking-tight leading-tight">
          14 rue des Lilas, Lyon 7e
        </h1>
        <p className="mt-2 text-[15px] text-[#6E6E73]">Suivi en temps réel de votre chantier</p>
      </div>

      {/* Barre de progression */}
      <div className="bg-white rounded-2xl border border-[#E5E5EA] p-5 mb-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[14px] font-semibold text-[#1D1D1F]">Avancement global</span>
          <span className="text-[14px] font-bold text-[#34C759]">{progress} %</span>
        </div>
        <div className="h-2 bg-[#F5F5F7] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#34C759] rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-2.5 text-[12px] text-[#6E6E73]">
          Dernière mise à jour : aujourd'hui à 09h14
        </p>
      </div>

      {/* Étapes */}
      <div className="bg-white rounded-2xl border border-[#E5E5EA] overflow-hidden mb-5">
        <div className="px-5 py-4 border-b border-[#F5F5F7]">
          <h2 className="font-semibold text-[15px] text-[#1D1D1F]">Étapes du chantier</h2>
        </div>
        <ul className="divide-y divide-[#F5F5F7]">
          {ETAPES.map((e) => (
            <li key={e.label} className="flex items-center gap-4 px-5 py-4">
              {e.done ? (
                <CheckCircle2 className="w-5 h-5 text-[#34C759] shrink-0" />
              ) : e.active ? (
                <Clock className="w-5 h-5 text-[#FF9500] shrink-0" />
              ) : (
                <Circle className="w-5 h-5 text-[#D2D2D7] shrink-0" />
              )}
              <div className="flex-1">
                <div
                  className={`text-[14px] font-medium ${
                    e.done
                      ? 'text-[#1D1D1F]'
                      : e.active
                      ? 'text-[#FF9500]'
                      : 'text-[#C7C7CC]'
                  }`}
                >
                  {e.label}
                </div>
              </div>
              <div
                className={`text-[12px] shrink-0 ${
                  e.done ? 'text-[#6E6E73]' : e.active ? 'text-[#FF9500] font-medium' : 'text-[#C7C7CC]'
                }`}
              >
                {e.date}
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Documents */}
        <div className="bg-white rounded-2xl border border-[#E5E5EA] overflow-hidden">
          <div className="px-5 py-4 border-b border-[#F5F5F7]">
            <h2 className="font-semibold text-[15px] text-[#1D1D1F]">Documents</h2>
          </div>
          <ul className="divide-y divide-[#F5F5F7]">
            {DOCUMENTS.map((d) => (
              <li key={d.ref} className="flex items-center gap-3 px-5 py-3.5">
                <FileText className="w-4 h-4 text-[#0071E3] shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-medium text-[#1D1D1F] truncate">{d.label}</div>
                  <div className="text-[11px] text-[#6E6E73]">{d.ref} · {d.date}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact artisan */}
        <div className="bg-white rounded-2xl border border-[#E5E5EA] overflow-hidden">
          <div className="px-5 py-4 border-b border-[#F5F5F7]">
            <h2 className="font-semibold text-[15px] text-[#1D1D1F]">Votre artisan</h2>
          </div>
          <div className="px-5 py-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#0071E3]/10 flex items-center justify-center">
                <span className="text-[14px] font-bold text-[#0071E3]">TM</span>
              </div>
              <div>
                <div className="text-[14px] font-semibold text-[#1D1D1F]">Thomas Mercier</div>
                <div className="text-[12px] text-[#6E6E73]">Chef de chantier</div>
              </div>
            </div>
            <div className="space-y-2">
              <a
                href="tel:+33600000000"
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[14px] text-[#1D1D1F] hover:bg-[#F5F5F7] transition-colors"
              >
                <Phone className="w-4 h-4 text-[#34C759]" />
                06 00 00 00 00
              </a>
              <a
                href="mailto:artisan@example.com"
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[14px] text-[#1D1D1F] hover:bg-[#F5F5F7] transition-colors"
              >
                <Mail className="w-4 h-4 text-[#0071E3]" />
                Envoyer un message
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
