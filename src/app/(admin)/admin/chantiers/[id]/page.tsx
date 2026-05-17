import { ChantierDetailClient } from './ChantierDetailClient'

export default function ChantierDetailPage({ params }: { params: { id: string } }) {
  return <ChantierDetailClient id={params.id} />
}
