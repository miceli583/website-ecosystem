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

interface NotificationEmailProps {
  recipientName: string;
  title: string;
  message?: string;
  linkUrl?: string;
}

export function NotificationEmail({
  recipientName,
  title,
  message,
  linkUrl,
}: NotificationEmailProps) {
  const baseUrl = "https://miraclemind.dev";

  return (
    <Html>
      <Head />
      <Preview>{title}</Preview>
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          <Heading style={headingStyle}>{title}</Heading>
          <Text style={greetingStyle}>Hi {recipientName},</Text>
          {message && <Text style={messageStyle}>{message}</Text>}
          {linkUrl && (
            <Section style={buttonSectionStyle}>
              <Button style={buttonStyle} href={`${baseUrl}${linkUrl}`}>
                View Details
              </Button>
            </Section>
          )}
          <Text style={footerStyle}>— Miracle Mind Admin</Text>
        </Container>
      </Body>
    </Html>
  );
}

const bodyStyle = {
  backgroundColor: "#0a0a0a",
  fontFamily: "Geist, -apple-system, sans-serif",
};

const containerStyle = {
  margin: "0 auto",
  padding: "40px 20px",
  maxWidth: "480px",
};

const headingStyle = {
  color: "#D4AF37",
  fontSize: "20px",
  fontWeight: "600" as const,
  marginBottom: "16px",
};

const greetingStyle = {
  color: "#e5e7eb",
  fontSize: "14px",
  marginBottom: "8px",
};

const messageStyle = {
  color: "#9ca3af",
  fontSize: "14px",
  lineHeight: "1.6",
  marginBottom: "24px",
};

const buttonSectionStyle = {
  marginBottom: "24px",
};

const buttonStyle = {
  backgroundColor: "#D4AF37",
  borderRadius: "8px",
  color: "#000",
  fontSize: "14px",
  fontWeight: "600" as const,
  padding: "10px 20px",
  textDecoration: "none",
};

const footerStyle = {
  color: "#6b7280",
  fontSize: "12px",
  marginTop: "32px",
};
