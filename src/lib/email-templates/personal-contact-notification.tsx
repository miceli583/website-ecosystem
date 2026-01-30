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

interface PersonalContactNotificationEmailProps {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

export function PersonalContactNotificationEmail({
  name,
  email,
  phone,
  message,
}: PersonalContactNotificationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>New contact from {name} via matthewmiceli.com</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>New Contact from matthewmiceli.com</Heading>
          <Section style={infoBox}>
            <Text style={label}>Name</Text>
            <Text style={value}>{name}</Text>
            <Text style={label}>Email</Text>
            <Text style={value}>{email}</Text>
            {phone && (
              <>
                <Text style={label}>Phone</Text>
                <Text style={value}>{phone}</Text>
              </>
            )}
          </Section>
          <Section style={messageSection}>
            <Text style={label}>Message</Text>
            <Text style={messageText}>{message}</Text>
          </Section>
          <Section style={footer}>
            <Text style={footerText}>
              Reply directly to this email to respond to {name}.
            </Text>
            <Text style={footerNote}>
              This contact has been added to your CRM.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#0a0a0a",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
};

const container = {
  backgroundColor: "#141414",
  margin: "0 auto",
  padding: "40px 20px",
  maxWidth: "560px",
  borderRadius: "8px",
};

const heading = {
  color: "#D4AF37",
  fontSize: "24px",
  fontWeight: "600",
  lineHeight: "1.3",
  margin: "0 0 24px",
};

const infoBox = {
  backgroundColor: "#1a1a1a",
  borderRadius: "8px",
  padding: "16px",
  marginBottom: "24px",
  border: "1px solid rgba(212, 175, 55, 0.2)",
};

const label = {
  color: "#9ca3af",
  fontSize: "12px",
  fontWeight: "600",
  textTransform: "uppercase" as const,
  letterSpacing: "0.5px",
  margin: "0 0 4px",
};

const value = {
  color: "#ffffff",
  fontSize: "16px",
  margin: "0 0 16px",
};

const messageSection = {
  marginBottom: "24px",
};

const messageText = {
  color: "#e5e7eb",
  fontSize: "16px",
  lineHeight: "1.6",
  margin: "0",
  whiteSpace: "pre-wrap" as const,
};

const footer = {
  borderTop: "1px solid rgba(212, 175, 55, 0.2)",
  paddingTop: "24px",
  marginTop: "24px",
};

const footerText = {
  color: "#9ca3af",
  fontSize: "14px",
  margin: "0 0 8px",
};

const footerNote = {
  color: "#D4AF37",
  fontSize: "12px",
  margin: "0",
};
