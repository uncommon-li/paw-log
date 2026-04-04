import PageContent from './PageContent'

export function generateStaticParams() { return [{ petId: '_' }] }

export default function Page({ params }: { params: Promise<{ petId: string }> }) {
  return <PageContent params={params} />
}
