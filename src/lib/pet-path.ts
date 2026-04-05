/**
 * Generate URLs for pet sub-pages, using query params so static export works
 * with any petId (avoids fetching non-existent RSC data for UUID paths).
 */
export function petHref(
  petId: string,
  sub?: string,
  extra?: Record<string, string>
): string {
  const base = sub ? `/pets/_/${sub}` : '/pets/_'
  const params = new URLSearchParams({ id: petId, ...extra })
  return `${base}?${params.toString()}`
}
