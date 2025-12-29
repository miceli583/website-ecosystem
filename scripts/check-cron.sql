-- Try different ways to check cron jobs

-- Method 1: Check all cron jobs
SELECT * FROM cron.job;

-- Method 2: Check with specific schema
SELECT * FROM cron.job WHERE jobname LIKE '%instagram%';

-- Method 3: Check recent runs
SELECT * FROM cron.job_run_details ORDER BY start_time DESC LIMIT 5;

-- Method 4: List all scheduled jobs with pg_cron function
SELECT cron.schedule_in_database(
  'test',
  '* * * * *',
  'SELECT 1',
  'postgres'
);

-- Method 5: Check what's in the cron schema
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'cron';
