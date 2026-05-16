import { ArtisanDetailClient } from './ArtisanDetailClient'

export default function ArtisanDetailPage({ params }: { params: { id: string } }) {
  return <ArtisanDetailClient id={params.id} />
}
