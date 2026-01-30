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

interface ContactNotificationEmailProps {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

export function ContactNotificationEmail({
  name,
  email,
  phone,
  message,
}: ContactNotificationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>New contact form submission from {name}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>New Contact Form Submission</Heading>
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
  maxWidth: "560px",
};

const heading = {
  color: "#1a1a1a",
  fontSize: "24px",
  fontWeight: "600",
  lineHeight: "1.3",
  margin: "0 0 24px",
};

const infoBox = {
  backgroundColor: "#f9fafb",
  borderRadius: "8px",
  padding: "16px",
  marginBottom: "24px",
};

const label = {
  color: "#6b7280",
  fontSize: "12px",
  fontWeight: "600",
  textTransform: "uppercase" as const,
  letterSpacing: "0.5px",
  margin: "0 0 4px",
};

const value = {
  color: "#1a1a1a",
  fontSize: "16px",
  margin: "0 0 16px",
};

const messageSection = {
  marginBottom: "24px",
};

const messageText = {
  color: "#1a1a1a",
  fontSize: "16px",
  lineHeight: "1.6",
  margin: "0",
  whiteSpace: "pre-wrap" as const,
};

const footer = {
  borderTop: "1px solid #e5e7eb",
  paddingTop: "24px",
  marginTop: "24px",
};

const footerText = {
  color: "#6b7280",
  fontSize: "14px",
  margin: "0",
};
