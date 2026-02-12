import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface ClientUpdateEmailProps {
  clientName: string;
  updateTitle: string;
  updateType: string;
  projectName: string;
  portalUrl: string;
  content?: string;
}

export function ClientUpdateEmail({
  clientName,
  updateTitle,
  updateType,
  projectName,
  portalUrl,
  content,
}: ClientUpdateEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>New {updateType} from Miracle Mind: {updateTitle}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>New Update from Miracle Mind</Heading>
          <Text style={text}>Hi {clientName},</Text>
          <Text style={text}>
            There&apos;s a new <strong>{updateType}</strong> for your project{" "}
            <strong>{projectName}</strong>:
          </Text>
          <Section style={updateBox}>
            <Text style={updateTitle_style}>{updateTitle}</Text>
            {content && (
              <div
                style={contentStyle}
                dangerouslySetInnerHTML={{ __html: content }}
              />
            )}
          </Section>
          <Section style={buttonContainer}>
            <Button style={button} href={portalUrl}>
              View in Portal
            </Button>
          </Section>
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
  fontSize: "22px",
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

const updateBox = {
  backgroundColor: "#f9fafb",
  borderLeft: "4px solid #D4AF37",
  padding: "16px 20px",
  borderRadius: "0 6px 6px 0",
  margin: "0 0 24px",
};

const updateTitle_style = {
  fontSize: "18px",
  fontWeight: "600" as const,
  color: "#1a1a1a",
  margin: "0",
};

const contentStyle = {
  fontSize: "15px",
  lineHeight: "24px",
  color: "#444444",
  marginTop: "12px",
};

const buttonContainer = {
  textAlign: "center" as const,
  margin: "0 0 32px",
};

const button = {
  backgroundColor: "#D4AF37",
  color: "#000000",
  fontSize: "16px",
  fontWeight: "600" as const,
  padding: "12px 32px",
  borderRadius: "6px",
  textDecoration: "none",
};

const footer = {
  borderTop: "1px solid #eaeaea",
  marginTop: "16px",
  paddingTop: "16px",
};

const footerText = {
  fontSize: "14px",
  color: "#666666",
  margin: "0",
};
