import { env } from "~/env";

/**
 * Mercury API client for bank account data
 *
 * API Docs: https://docs.mercury.com/reference/welcome-to-mercury-api
 * Base URL: https://api.mercury.com/api/v1
 */

const MERCURY_BASE_URL = "https://api.mercury.com/api/v1";

interface MercuryAccount {
  id: string;
  name: string;
  type: string; // Mercury returns "mercury" for all accounts
  kind: "checking" | "savings";
  status: "active" | "closed";
  availableBalance: number;
  currentBalance: number;
  accountNumber: string;
  routingNumber: string;
  nickname?: string;
  createdAt: string;
}

interface MercuryTransaction {
  id: string;
  amount: number;
  bankDescription: string | null;
  counterpartyName: string | null;
  createdAt: string;
  dashboardLink: string;
  details: Record<string, unknown> | null;
  estimatedDeliveryDate: string | null;
  externalMemo: string | null;
  failedAt: string | null;
  feeId: string | null;
  kind: string;
  note: string | null;
  postedAt: string | null;
  reasonForFailure: string | null;
  status: "pending" | "sent" | "cancelled" | "failed";
}

interface MercuryAccountsResponse {
  accounts: MercuryAccount[];
}

interface MercuryTransactionsResponse {
  transactions: MercuryTransaction[];
}

const isDev = process.env.NODE_ENV === "development";

async function mercuryFetch<T>(endpoint: string): Promise<T | null> {
  if (!env.MERCURY_API_KEY) {
    if (isDev) console.warn("[Mercury] API key not configured");
    return null;
  }

  try {
    const response = await fetch(`${MERCURY_BASE_URL}${endpoint}`, {
      headers: {
        Authorization: `Bearer ${env.MERCURY_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      if (isDev)
        console.error(
          `[Mercury] GET error: ${response.status} ${response.statusText}`
        );
      return null;
    }

    return response.json() as Promise<T>;
  } catch (error) {
    if (isDev) console.error("[Mercury] GET fetch error:", error);
    return null;
  }
}

async function mercuryPost<T>(
  endpoint: string,
  body: Record<string, unknown>
): Promise<T | null> {
  if (!env.MERCURY_API_KEY) {
    if (isDev) console.warn("[Mercury] API key not configured");
    return null;
  }

  try {
    const response = await fetch(`${MERCURY_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.MERCURY_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      if (isDev)
        console.error(
          `[Mercury] POST error: ${response.status} ${response.statusText}`,
          errorText
        );
      return null;
    }

    return response.json() as Promise<T>;
  } catch (error) {
    if (isDev) console.error("[Mercury] POST error:", error);
    return null;
  }
}

/**
 * Get all Mercury accounts
 */
export async function getMercuryAccounts(): Promise<MercuryAccount[]> {
  const data = await mercuryFetch<MercuryAccountsResponse>("/accounts");
  return data?.accounts ?? [];
}

/**
 * Get account details including balance
 */
export async function getMercuryAccount(
  accountId: string
): Promise<MercuryAccount | null> {
  return mercuryFetch<MercuryAccount>(`/account/${accountId}`);
}

/**
 * Get transactions for an account
 * @param accountId - Mercury account ID
 * @param limit - Number of transactions (default 100)
 * @param offset - Pagination offset
 * @param start - Start date filter (YYYY-MM-DD)
 * @param end - End date filter (YYYY-MM-DD)
 */
export async function getMercuryTransactions(
  accountId: string,
  limit = 100,
  offset = 0,
  start?: string,
  end?: string
): Promise<MercuryTransaction[]> {
  const params = new URLSearchParams({
    limit: String(limit),
    offset: String(offset),
  });
  if (start) params.set("start", start);
  if (end) params.set("end", end);

  const data = await mercuryFetch<MercuryTransactionsResponse>(
    `/account/${accountId}/transactions?${params.toString()}`
  );
  return data?.transactions ?? [];
}

/**
 * Get total balance across all accounts
 */
export async function getMercuryTotalBalance(): Promise<{
  available: number;
  current: number;
  accounts: Array<{
    id: string;
    name: string;
    type: string;
    available: number;
  }>;
}> {
  const accounts = await getMercuryAccounts();

  const available = accounts.reduce(
    (sum, acc) => sum + acc.availableBalance,
    0
  );
  const current = accounts.reduce((sum, acc) => sum + acc.currentBalance, 0);

  return {
    available,
    current,
    accounts: accounts.map((acc) => ({
      id: acc.id,
      name: acc.name,
      type: acc.type,
      available: acc.availableBalance,
    })),
  };
}

// ============================================================================
// MERCURY ACCOUNTS RECEIVABLE (INVOICING) API
// Docs: https://docs.mercury.com/reference/createinvoice
// ============================================================================

interface MercuryInvoiceLineItem {
  name: string;
  unitPrice: number; // dollars
  quantity: number;
  salesTaxRate?: number;
}

interface MercuryInvoiceCreateParams {
  recipientEmail: string;
  recipientName: string;
  description: string;
  lineItems: MercuryInvoiceLineItem[];
  dueDate: string; // YYYY-MM-DD
  accountId: string; // Mercury checking account to receive payment
}

interface MercuryCustomer {
  id: string;
  name: string;
  email: string;
}

interface MercuryInvoice {
  id: string;
  invoiceNumber?: string;
  slug?: string;
  status: "Unpaid" | "Paid" | "Cancelled" | "Processing";
  amount?: number;
  dueDate: string;
  paidAt?: string | null;
  link?: string; // computed from slug: https://app.mercury.com/pay/{slug}
  createdAt?: string;
}

/**
 * Find or create a Mercury AR customer by email.
 * Mercury requires a customerId for invoice creation.
 */
async function findOrCreateMercuryCustomer(
  name: string,
  email: string
): Promise<MercuryCustomer | null> {
  // Search existing customers
  const customers = await mercuryFetch<{ customers: MercuryCustomer[] }>(
    "/ar/customers"
  );
  const existing = customers?.customers?.find(
    (c) => c.email.toLowerCase() === email.toLowerCase()
  );
  if (existing) return existing;

  // Create new customer
  return mercuryPost<MercuryCustomer>("/ar/customers", { name, email });
}

/**
 * Create a Mercury invoice via the Accounts Receivable API.
 * Automatically finds or creates the customer first.
 * Returns the invoice with a shareable payment link.
 */
export async function createMercuryInvoice(
  params: MercuryInvoiceCreateParams
): Promise<MercuryInvoice | null> {
  // Step 1: Find or create customer
  const customer = await findOrCreateMercuryCustomer(
    params.recipientName,
    params.recipientEmail
  );
  if (!customer) {
    if (isDev) console.error("[Mercury] Failed to find or create customer");
    return null;
  }

  // Step 2: Create invoice
  const today = new Date().toISOString().split("T")[0]!;
  const invoice = await mercuryPost<MercuryInvoice>("/ar/invoices", {
    customerId: customer.id,
    destinationAccountId: params.accountId,
    invoiceDate: today,
    dueDate: params.dueDate,
    lineItems: params.lineItems.map((item) => ({
      name: item.name,
      unitPrice: item.unitPrice,
      quantity: item.quantity,
    })),
    ccEmails: [],
    creditCardEnabled: false,
    achDebitEnabled: true,
    useRealAccountNumber: false,
    payerMemo: params.description,
    sendEmailOption: "SendNow",
  });

  if (!invoice) return null;

  // Build payment link from slug
  if (invoice.slug) {
    invoice.link = `https://app.mercury.com/pay/${invoice.slug}`;
  }

  return invoice;
}

/**
 * Get a Mercury invoice by ID (for polling payment status)
 */
export async function getMercuryInvoice(
  invoiceId: string
): Promise<MercuryInvoice | null> {
  return mercuryFetch<MercuryInvoice>(`/ar/invoices/${invoiceId}`);
}

export type {
  MercuryAccount,
  MercuryTransaction,
  MercuryInvoice,
  MercuryInvoiceCreateParams,
  MercuryInvoiceLineItem,
};
