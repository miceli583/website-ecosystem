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
 * - UI Playground (/admin/playground)
 * - Template Gallery (/admin/templates)
 * - Animation Showcase (/admin/shaders)
 */
export default function MatthewDevPage() {
  return (
    <DomainLayout>
      <BackButton href="/admin" label="Back to Hub" />
      <MatthewHomePage isDevPreview={true} />
    </DomainLayout>
  );
}
