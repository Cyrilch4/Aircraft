import { BienDetailClient } from './BienDetailClient'

export default function BienDetailPage({ params }: { params: { id: string } }) {
  return <BienDetailClient id={params.id} />
}
