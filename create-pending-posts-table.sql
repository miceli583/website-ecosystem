-- Create the pending_posts table for buffer station
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS "pending_posts" (
  "id" text PRIMARY KEY NOT NULL,
  "zapier_payload" text NOT NULL,
  "scheduled_for" timestamp with time zone NOT NULL,
  "status" text DEFAULT 'pending' NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "sent_at" timestamp with time zone
);

-- Verify table was created
SELECT * FROM pending_posts;
