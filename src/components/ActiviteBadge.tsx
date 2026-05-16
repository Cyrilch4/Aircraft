import { ACTIVITES, type ActiviteSlug } from '@/lib/activites'

export function ActiviteBadge({ slug }: { slug: ActiviteSlug }) {
  const { label, couleur } = ACTIVITES[slug]
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold text-white"
      style={{ backgroundColor: couleur }}
    >
      {label}
    </span>
  )
}

export function ActiviteList({ slugs }: { slugs: ActiviteSlug[] }) {
  return (
    <div className="flex flex-wrap gap-1">
      {slugs.map((slug) => (
        <ActiviteBadge key={slug} slug={slug} />
      ))}
    </div>
  )
}
