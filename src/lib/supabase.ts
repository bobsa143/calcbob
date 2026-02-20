import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Project {
  id: string;
  name: string;
  calculation_type: 'wire' | 'turns';
  input_parameters: Record<string, any>;
  results: Record<string, any>;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface WireSpecification {
  id: string;
  diameter_mm: number;
  section_mm2: number;
  resistance_per_m: number;
  weight_per_m: number;
}

export interface WindingFactor {
  id: string;
  winding_type: string;
  coefficient: number;
  description: string;
}
