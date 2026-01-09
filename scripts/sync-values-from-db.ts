import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

interface Value {
  id?: number;
  name?: string;
  value?: string;
  title?: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

async function fetchCoreValues(): Promise<string[]> {
  const { data, error } = await supabase
    .from('core_values')
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    console.error('Error fetching core_values:', error);
    return [];
  }

  if (!data || data.length === 0) {
    console.log('No data found in core_values table');
    return [];
  }

  console.log('Core values from DB:', data);

  // Extract the value name from various possible column names
  return data.map((row: Value) =>
    row.name || row.value || row.title || String(row.id)
  ).filter(Boolean);
}

async function fetchSupportingValues(): Promise<string[]> {
  const { data, error } = await supabase
    .from('supporting_values')
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    console.error('Error fetching supporting_values:', error);
    return [];
  }

  if (!data || data.length === 0) {
    console.log('No data found in supporting_values table');
    return [];
  }

  console.log('Supporting values from DB:', data);

  // Extract the value name from various possible column names
  return data.map((row: Value) =>
    row.name || row.value || row.title || String(row.id)
  ).filter(Boolean);
}

async function updateMarkdownFiles() {
  const coreValues = await fetchCoreValues();
  const supportingValues = await fetchSupportingValues();

  const lifeOsDir = path.join(process.cwd(), '__LifeOS');

  // Read existing files to preserve any values not in DB
  const existingCoreValues = fs.readFileSync(
    path.join(lifeOsDir, 'CoreValues.md'),
    'utf-8'
  ).split('\n').filter(line => line.trim());

  const existingSupportingValues = fs.readFileSync(
    path.join(lifeOsDir, 'SupportingValues.md'),
    'utf-8'
  ).split('\n').filter(line => line.trim());

  // Merge DB values with existing values (remove duplicates)
  const mergedCoreValues = Array.from(new Set([...coreValues, ...existingCoreValues]));
  const mergedSupportingValues = Array.from(new Set([...supportingValues, ...existingSupportingValues]));

  // Ensure all core values are in supporting values
  const finalSupportingValues = Array.from(new Set([...mergedCoreValues, ...mergedSupportingValues]));

  // Write updated files
  fs.writeFileSync(
    path.join(lifeOsDir, 'CoreValues.md'),
    mergedCoreValues.join('\n') + '\n'
  );

  fs.writeFileSync(
    path.join(lifeOsDir, 'SupportingValues.md'),
    finalSupportingValues.join('\n') + '\n'
  );

  console.log('\n✅ Updated CoreValues.md with', mergedCoreValues.length, 'values');
  console.log('✅ Updated SupportingValues.md with', finalSupportingValues.length, 'values');
  console.log('\nCore Values includes:', mergedCoreValues.length, 'values');
  console.log('Supporting Values includes:', finalSupportingValues.length, 'values (includes all Core Values)');
}

updateMarkdownFiles().catch(console.error);
