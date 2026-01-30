# Client Portal Architecture

## Overview

The client portal (`/portal/[slug]`) provides authenticated access for clients to view project updates, demos, proposals, billing, and tooling resources. It uses Supabase Auth with magic links for passwordless authentication.

## Route Structure

```
/portal/[slug]/                    → Dashboard (recent updates across all sections)
/portal/[slug]/updates             → Project updates timeline
/portal/[slug]/demos               → Demo listing page
/portal/[slug]/demos/slides/       → Slide Generator demo hub
/portal/[slug]/demos/website/      → Website Build demo hub
/portal/[slug]/proposals           → Proposals with Stripe checkout
/portal/[slug]/billing             → Billing & subscription management
/portal/[slug]/tooling             → Client-specific tools & resources
/portal/[slug]/claim               → Profile claim flow (for new users)
```

## Authentication Flow

### 1. Initial Access
- User visits `/portal/[slug]`
- Middleware checks for Supabase session
- If no session → redirect to `/portal/[slug]/login`

### 2. Magic Link Login
- User enters email at login page
- Supabase sends magic link to email
- Link redirects to `/portal/[slug]/auth/callback`
- Callback exchanges code for session

### 3. Profile Claiming
- On first login, if `portal_users.auth_user_id` is NULL
- User is redirected to `/portal/[slug]/claim`
- Claim page links Supabase auth user to portal_user record
- Sets `auth_user_id` on the portal_users row

### 4. Authorization Check
```
portal_users.email        → Must match authenticated user
portal_users.client_slug  → Must match URL [slug] parameter
portal_users.is_active    → Must be true
```

## Database Schema

### `clients`
Main client record (the organization).
```sql
id              SERIAL PRIMARY KEY
name            TEXT NOT NULL
email           TEXT UNIQUE NOT NULL
slug            TEXT UNIQUE NOT NULL  -- URL identifier
stripe_customer_id  TEXT
status          TEXT DEFAULT 'active'
company         TEXT
notes           TEXT
```

### `portal_users`
Individual users who can access the portal.
```sql
id              UUID PRIMARY KEY DEFAULT gen_random_uuid()
auth_user_id    UUID UNIQUE       -- Links to Supabase auth.users
email           TEXT UNIQUE NOT NULL
name            TEXT NOT NULL
role            TEXT DEFAULT 'client'  -- 'admin' | 'client'
client_slug     TEXT              -- Which client portal they can access
is_active       BOOLEAN DEFAULT true
phone           TEXT
```

### `client_projects`
Projects belonging to a client.
```sql
id              SERIAL PRIMARY KEY
client_id       INTEGER REFERENCES clients(id)
name            TEXT NOT NULL
description     TEXT
status          TEXT DEFAULT 'active'
```

### `client_resources`
Flexible resource system for demos, tools, proposals, etc.
```sql
id              SERIAL PRIMARY KEY
client_id       INTEGER REFERENCES clients(id)
project_id      INTEGER REFERENCES client_projects(id)
section         TEXT DEFAULT 'tooling'  -- 'tooling' | 'demos' | 'proposals'
type            TEXT DEFAULT 'link'     -- 'link' | 'embed' | 'proposal' | 'credential'
title           TEXT NOT NULL
description     TEXT
url             TEXT
metadata        JSONB DEFAULT '{}'
is_active       BOOLEAN DEFAULT true
stripe_product_id TEXT  -- For subscription-gated resources
```

## API Layer (tRPC)

### `portal` Router
Located at `src/server/api/routers/portal.ts`

**Queries:**
- `getClientBySlug` - Fetch client with projects/updates
- `getResources` - Fetch resources by section
- `getProposals` - Fetch proposals with metadata

**Mutations:**
- `claimProfile` - Link auth user to portal_user
- `createProposalCheckout` - Create Stripe checkout session

## Component Structure

```
src/components/
├── pages/
│   └── client-portal.tsx       → Main layout wrapper
├── portal/
│   ├── index.ts               → Exports all portal components
│   ├── search-filter-bar.tsx  → Reusable search/filter UI
│   ├── list-container.tsx     → List wrapper with empty states
│   ├── list-item.tsx          → Individual list item
│   └── proposal-modal.tsx     → Proposal viewing/checkout
```

## Proposal System

### Data Model
Proposals are stored in `client_resources` with:
- `section = 'proposals'`
- `type = 'proposal'`
- `metadata` containing:
```typescript
interface ProposalMetadata {
  status: 'draft' | 'sent' | 'accepted' | 'declined';
  customerInfo?: { name, email, company };
  packages: Array<{
    id: string;
    name: string;
    description?: string;
    price: number;
    type: 'one-time' | 'subscription';
    interval?: 'month' | 'year';
    required?: boolean;
    popular?: boolean;
    lineItems?: Array<{ name, quantity, unitPrice }>;
  }>;
  currency: string;
  notes?: string;
  validUntil?: string;
}
```

### Checkout Flow
1. User opens proposal modal
2. Selects desired packages
3. Clicks "Checkout"
4. `createProposalCheckout` mutation creates Stripe checkout
5. User completes payment on Stripe
6. Webhook updates proposal status to 'accepted'

## Subscription-Gated Resources

Resources can be linked to Stripe products via `stripe_product_id`:
- When set, resource only appears if client has active subscription
- Checked via `billing.getActiveSubscriptions` query
- Enables "upgrade to unlock" patterns

## Demo System

Demos are stored as resources with `section = 'demos'`:
- Listed on `/portal/[slug]/demos` page
- URL points to demo route under `/portal/[slug]/demos/...`
- Demo pages use dynamic `[slug]` for proper back-navigation

### Current Demos
1. **Training Slide Generator** (`/portal/[slug]/demos/slides/`)
   - Input documents viewer
   - Presentation preview
   - Talking tracks

2. **Website Build** (`/portal/[slug]/demos/website/`)
   - Landing page demo
   - Admin dashboard demo

## Security Considerations

1. **Row Level Security (RLS)**
   - All client tables have RLS enabled
   - Policies check `auth.uid()` against `portal_users.auth_user_id`

2. **Slug Validation**
   - API validates user's `client_slug` matches request
   - Prevents cross-client data access

3. **Magic Links**
   - No passwords stored
   - Links expire after 1 hour
   - Single-use tokens

4. **Stripe Integration**
   - Customer ID stored on client record
   - Checkout sessions created server-side
   - Webhooks verify Stripe signatures

## Adding a New Client

```sql
-- 1. Create client record
INSERT INTO clients (name, email, slug, company)
VALUES ('Client Name', 'client@example.com', 'client-slug', 'Company Inc');

-- 2. Create portal user(s)
INSERT INTO portal_users (email, name, role, client_slug)
VALUES ('user@example.com', 'User Name', 'client', 'client-slug');

-- 3. Add resources as needed
INSERT INTO client_resources (client_id, section, type, title, url)
VALUES (1, 'demos', 'link', 'Demo Title', '/portal/client-slug/demos/...');
```

## Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
```
