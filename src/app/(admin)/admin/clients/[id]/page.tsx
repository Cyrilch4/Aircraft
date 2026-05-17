import { ClientDetailClient } from './ClientDetailClient'

export default function ClientDetailPage({ params }: { params: { id: string } }) {
  return <ClientDetailClient id={params.id} />
}
