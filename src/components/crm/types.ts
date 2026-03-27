/**
 * Shared CRM types.
 * Single source of truth for contact row shape across CRM components.
 */

export type ContactRow = {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  company: string | null;
  status: string;
  source: string;
  referredBy: string | null;
  referredByExternal: string | null;
  accountManagerId: string | null;
  accountManagerName: string | null;
  connectorId: string | null;
  assignedDeveloperId: string | null;
  createdBy: string | null;
  tags: string[] | null;
  notes: string | null;
  lastContactAt: Date;
  submissionSources: string[];
  portalClient: {
    id: number;
    slug: string;
    name: string;
    company: string | null;
  } | null;
};
