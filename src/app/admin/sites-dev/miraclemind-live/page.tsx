import { DomainLayout } from "~/components/domain-layout";
import { BackButton } from "~/components/back-button";
import { MiracleMindLiveHomePage } from "~/components/pages/miraclemind-live-home";

/**
 * Dev Preview: MiracleMind Live Homepage
 *
 * This is a development preview of miraclemind.live
 * Use this to test changes before deploying to production
 */
export default function MiracleMindLiveDevPage() {
  return (
    <DomainLayout>
      <BackButton href="/admin" label="Back to Hub" />
      <MiracleMindLiveHomePage />
    </DomainLayout>
  );
}
