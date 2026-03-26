-- Glo Moss Account Merge Migration
-- Merges client account (wrong email) into team member account (correct email)
--
-- Old client email: executiveassitant@e.read.ai
-- Correct team email: info@newearthmedia.org
-- Client slug: glo-moss
--
-- Run this against the production Supabase database.

BEGIN;

-- 1. Update the client record to use the correct email
UPDATE clients
SET email = 'info@newearthmedia.org',
    updated_at = NOW()
WHERE slug = 'glo-moss';

-- 2. Link the team member portal_users record to the glo-moss client portal
UPDATE portal_users
SET client_slug = 'glo-moss',
    updated_at = NOW()
WHERE email = 'info@newearthmedia.org'
  AND is_company_member = true;

-- 3. Delete the old client-role portal_users record (wrong email)
DELETE FROM portal_users
WHERE email = 'executiveassitant@e.read.ai'
  AND role = 'client';

COMMIT;

-- Verify the merge worked:
-- SELECT id, email, name, role, is_company_member, client_slug
-- FROM portal_users
-- WHERE email = 'info@newearthmedia.org';
--
-- Expected: one row with role='admin', is_company_member=true, client_slug='glo-moss'
