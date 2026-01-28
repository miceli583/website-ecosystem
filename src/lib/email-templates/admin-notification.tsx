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

interface AdminNotificationEmailProps {
  subject: string;
  fullName: string;
  email: string;
  role?: string;
  message?: string;
}

export function AdminNotificationEmail({
  subject,
  fullName,
  email,
  role,
  message,
}: AdminNotificationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>{subject}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>{subject}</Heading>
          <Section style={detailsSection}>
            <Text style={label}>Name</Text>
            <Text style={value}>{fullName}</Text>
            <Text style={label}>Email</Text>
            <Text style={value}>{email}</Text>
            {role && (
              <>
                <Text style={label}>Role</Text>
                <Text style={value}>{role}</Text>
              </>
            )}
            {message && (
              <>
                <Text style={label}>Message</Text>
                <Text style={value}>{message}</Text>
              </>
            )}
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
  fontSize: "20px",
  fontWeight: "700" as const,
  color: "#1a1a1a",
  margin: "0 0 24px",
};

const detailsSection = {
  padding: "16px",
  backgroundColor: "#f9fafb",
  borderRadius: "6px",
};

const label = {
  fontSize: "12px",
  fontWeight: "600" as const,
  color: "#666666",
  textTransform: "uppercase" as const,
  letterSpacing: "0.5px",
  margin: "12px 0 2px",
};

const value = {
  fontSize: "15px",
  color: "#1a1a1a",
  margin: "0 0 8px",
};
