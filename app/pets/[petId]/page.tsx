import PageContent from './PageContent'

export function generateStaticParams() { return [{ petId: '_' }] }

export default function Page() {
  return <PageContent />
}
