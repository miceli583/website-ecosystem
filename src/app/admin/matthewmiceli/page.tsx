import { DomainLayout } from "~/components/domain-layout";
import { BackButton } from "~/components/back-button";
import { MatthewHomePage } from "~/components/pages/matthew-home";

/**
 * Dev Preview: Matthew Miceli Homepage
 *
 * This is a development preview of matthewmiceli.com
 * Use this to test changes before deploying to production
 *
 * Links point to admin routes for:
 * - UI Playground (/admin/playground?domain=matthew)
 * - Template Gallery (/admin/templates?domain=matthew)
 * - Animation Showcase (/admin/shaders?domain=matthew)
 */
export default async function MatthewDevPage({
  searchParams,
}: {
  searchParams: Promise<{ domain?: string }>;
}) {
  const params = await searchParams;
  const domainParam = params.domain ? `?domain=${params.domain}` : "?domain=matthew";

  return (
    <DomainLayout>
      <BackButton href="/admin" label="Back to Hub" />
      <MatthewHomePage isDevPreview={true} domainParam={domainParam} />
    </DomainLayout>
  );
}
