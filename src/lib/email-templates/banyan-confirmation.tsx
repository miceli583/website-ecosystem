import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface BanyanConfirmationEmailProps {
  fullName: string;
}

export function BanyanConfirmationEmail({
  fullName,
}: BanyanConfirmationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>You&apos;re on the BANYAN early access list</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>Welcome to BANYAN</Heading>
          <Text style={text}>Hi {fullName},</Text>
          <Text style={text}>
            Thank you for signing up for early access to BANYAN LifeOS. We&apos;re
            building something special, and we&apos;re thrilled to have you along for
            the journey.
          </Text>
          <Text style={text}>
            We&apos;ll reach out as soon as your spot is ready. In the meantime, keep
            an eye on your inbox for updates.
          </Text>
          <Section style={footer}>
            <Text style={footerText}>
              &mdash; The Miracle Mind Team
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "40px 20px",
  maxWidth: "600px",
  borderRadius: "8px",
};

const heading = {
  fontSize: "24px",
  fontWeight: "700" as const,
  color: "#1a1a1a",
  textAlign: "center" as const,
  margin: "0 0 24px",
};

const text = {
  fontSize: "16px",
  lineHeight: "26px",
  color: "#333333",
  margin: "0 0 16px",
};

const footer = {
  borderTop: "1px solid #eaeaea",
  marginTop: "32px",
  paddingTop: "16px",
};

const footerText = {
  fontSize: "14px",
  color: "#666666",
  margin: "0",
};
