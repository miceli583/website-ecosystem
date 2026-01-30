import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
  Row,
  Column,
} from "@react-email/components";

interface ProposalReceiptEmailProps {
  clientName: string;
  proposalTitle: string;
  packages: Array<{
    name: string;
    price: number;
    type: "one-time" | "subscription";
    interval?: string;
  }>;
  totalAmount: number;
  currency: string;
  paidAt: Date;
}

function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount);
}

export function ProposalReceiptEmail({
  clientName,
  proposalTitle,
  packages,
  totalAmount,
  currency,
  paidAt,
}: ProposalReceiptEmailProps) {
  const oneTimeItems = packages.filter((p) => p.type === "one-time");
  const subscriptionItems = packages.filter((p) => p.type === "subscription");
  const oneTimeTotal = oneTimeItems.reduce((sum, p) => sum + p.price, 0);
  const subscriptionTotal = subscriptionItems.reduce((sum, p) => sum + p.price, 0);

  return (
    <Html>
      <Head />
      <Preview>Receipt for {proposalTitle}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>Payment Receipt</Heading>

          <Text style={paragraph}>Hi {clientName},</Text>

          <Text style={paragraph}>
            Thank you for your payment. Here&apos;s a summary of your purchase:
          </Text>

          <Section style={receiptBox}>
            <Text style={proposalTitleStyle}>{proposalTitle}</Text>
            <Text style={dateText}>
              {paidAt.toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </Text>

            <Hr style={divider} />

            {packages.map((pkg, index) => (
              <Row key={index} style={lineItemRow}>
                <Column style={lineItemName}>
                  {pkg.name}
                  {pkg.type === "subscription" && (
                    <span style={subscriptionBadge}>
                      {" "}
                      (/{pkg.interval ?? "month"})
                    </span>
                  )}
                </Column>
                <Column style={lineItemPrice}>
                  {formatCurrency(pkg.price, currency)}
                </Column>
              </Row>
            ))}

            <Hr style={divider} />

            {oneTimeTotal > 0 && (
              <Row style={totalRow}>
                <Column style={totalLabel}>One-time total:</Column>
                <Column style={totalValue}>
                  {formatCurrency(oneTimeTotal, currency)}
                </Column>
              </Row>
            )}

            {subscriptionTotal > 0 && (
              <Row style={totalRow}>
                <Column style={totalLabel}>Recurring total:</Column>
                <Column style={totalValue}>
                  {formatCurrency(subscriptionTotal, currency)}/
                  {subscriptionItems[0]?.interval ?? "month"}
                </Column>
              </Row>
            )}

            <Row style={grandTotalRow}>
              <Column style={grandTotalLabel}>Amount paid today:</Column>
              <Column style={grandTotalValue}>
                {formatCurrency(totalAmount, currency)}
              </Column>
            </Row>
          </Section>

          <Text style={paragraph}>
            If you have any questions about your purchase, please don&apos;t hesitate
            to reach out.
          </Text>

          <Text style={footer}>
            — The Miracle Mind Team
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#0a0a0a",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif',
};

const container = {
  backgroundColor: "#111111",
  margin: "0 auto",
  padding: "40px 20px",
  maxWidth: "560px",
  borderRadius: "8px",
};

const heading = {
  color: "#D4AF37",
  fontSize: "28px",
  fontWeight: "bold",
  margin: "0 0 24px",
  textAlign: "center" as const,
};

const paragraph = {
  color: "#e5e5e5",
  fontSize: "16px",
  lineHeight: "26px",
  margin: "16px 0",
};

const receiptBox = {
  backgroundColor: "#1a1a1a",
  borderRadius: "8px",
  padding: "24px",
  margin: "24px 0",
  border: "1px solid #333",
};

const proposalTitleStyle = {
  color: "#ffffff",
  fontSize: "18px",
  fontWeight: "600",
  margin: "0 0 4px",
};

const dateText = {
  color: "#888888",
  fontSize: "14px",
  margin: "0 0 16px",
};

const divider = {
  borderColor: "#333333",
  margin: "16px 0",
};

const lineItemRow = {
  margin: "8px 0",
};

const lineItemName = {
  color: "#e5e5e5",
  fontSize: "14px",
};

const subscriptionBadge = {
  color: "#888888",
  fontSize: "12px",
};

const lineItemPrice = {
  color: "#e5e5e5",
  fontSize: "14px",
  textAlign: "right" as const,
};

const totalRow = {
  margin: "8px 0",
};

const totalLabel = {
  color: "#888888",
  fontSize: "14px",
};

const totalValue = {
  color: "#e5e5e5",
  fontSize: "14px",
  textAlign: "right" as const,
};

const grandTotalRow = {
  margin: "16px 0 0",
};

const grandTotalLabel = {
  color: "#D4AF37",
  fontSize: "16px",
  fontWeight: "600",
};

const grandTotalValue = {
  color: "#D4AF37",
  fontSize: "18px",
  fontWeight: "bold",
  textAlign: "right" as const,
};

const footer = {
  color: "#888888",
  fontSize: "14px",
  marginTop: "32px",
};
