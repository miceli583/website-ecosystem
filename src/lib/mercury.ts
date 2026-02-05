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
  type: "checking" | "savings";
  status: "active" | "closed";
  availableBalance: number;
  currentBalance: number;
  accountNumber: string;
  routingNumber: string;
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

async function mercuryFetch<T>(endpoint: string): Promise<T | null> {
  if (!env.MERCURY_API_KEY) {
    console.warn("Mercury API key not configured");
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
      console.error(`Mercury API error: ${response.status} ${response.statusText}`);
      return null;
    }

    return response.json() as Promise<T>;
  } catch (error) {
    console.error("Mercury API fetch error:", error);
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
export async function getMercuryAccount(accountId: string): Promise<MercuryAccount | null> {
  return mercuryFetch<MercuryAccount>(`/account/${accountId}`);
}

/**
 * Get transactions for an account
 * @param accountId - Mercury account ID
 * @param limit - Number of transactions (default 100)
 * @param offset - Pagination offset
 */
export async function getMercuryTransactions(
  accountId: string,
  limit = 100,
  offset = 0
): Promise<MercuryTransaction[]> {
  const data = await mercuryFetch<MercuryTransactionsResponse>(
    `/account/${accountId}/transactions?limit=${limit}&offset=${offset}`
  );
  return data?.transactions ?? [];
}

/**
 * Get total balance across all accounts
 */
export async function getMercuryTotalBalance(): Promise<{
  available: number;
  current: number;
  accounts: Array<{ id: string; name: string; type: string; available: number }>;
}> {
  const accounts = await getMercuryAccounts();

  const available = accounts.reduce((sum, acc) => sum + acc.availableBalance, 0);
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

export type { MercuryAccount, MercuryTransaction };
