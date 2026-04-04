export function generateStaticParams() { return [{ petId: '_' }] }

export default function PetLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
