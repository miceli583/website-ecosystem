import { DomainLayout } from "~/components/domain-layout";
import { BackButton } from "~/components/back-button";
import { MiracleMindDevHomePage } from "~/components/pages/miraclemind-dev-home";

/**
 * Dev Preview: MiracleMind Dev Homepage
 *
 * This is a development preview of miraclemind.dev public homepage
 * Use this to test changes before deploying to production
 */
export default function MiracleMindDevDevPage() {
  return (
    <DomainLayout>
      <BackButton href="/admin" label="Back to Hub" />
      <MiracleMindDevHomePage />
    </DomainLayout>
  );
}
