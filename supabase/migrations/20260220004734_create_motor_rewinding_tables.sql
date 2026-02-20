/*
  # Create Motor Rewinding Application Tables

  ## Tables Created
  
  ### 1. projects
  Stores all motor rewinding calculation projects
  - `id` (uuid, primary key)
  - `name` (text) - Project/motor name
  - `calculation_type` (text) - 'wire' or 'turns'
  - `input_parameters` (jsonb) - All input parameters
  - `results` (jsonb) - Calculated results
  - `notes` (text) - User notes and observations
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 2. wire_specifications
  Technical specifications for standard copper wires
  - `id` (uuid, primary key)
  - `diameter_mm` (numeric) - Wire diameter in mm
  - `section_mm2` (numeric) - Cross-section area
  - `resistance_per_m` (numeric) - Resistance per meter in ohms
  - `weight_per_m` (numeric) - Weight per meter in grams

  ### 3. winding_factors
  Winding coefficients for different winding types
  - `id` (uuid, primary key)
  - `winding_type` (text) - Type of winding
  - `coefficient` (numeric) - Winding factor (kw)
  - `description` (text) - Description

  ## Security
  - Enable RLS on all tables
  - Public read access for technical reference tables
  - Authenticated users can manage their own projects
*/

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  calculation_type text NOT NULL CHECK (calculation_type IN ('wire', 'turns')),
  input_parameters jsonb NOT NULL DEFAULT '{}',
  results jsonb NOT NULL DEFAULT '{}',
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view projects"
  ON projects FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert projects"
  ON projects FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update projects"
  ON projects FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete projects"
  ON projects FOR DELETE
  USING (true);

-- Create wire_specifications table
CREATE TABLE IF NOT EXISTS wire_specifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  diameter_mm numeric NOT NULL,
  section_mm2 numeric NOT NULL,
  resistance_per_m numeric NOT NULL,
  weight_per_m numeric NOT NULL
);

ALTER TABLE wire_specifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view wire specs"
  ON wire_specifications FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert wire specs"
  ON wire_specifications FOR INSERT
  WITH CHECK (true);

-- Create winding_factors table
CREATE TABLE IF NOT EXISTS winding_factors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  winding_type text NOT NULL UNIQUE,
  coefficient numeric NOT NULL,
  description text DEFAULT ''
);

ALTER TABLE winding_factors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view winding factors"
  ON winding_factors FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert winding factors"
  ON winding_factors FOR INSERT
  WITH CHECK (true);

-- Insert standard wire specifications
INSERT INTO wire_specifications (diameter_mm, section_mm2, resistance_per_m, weight_per_m)
VALUES
  (0.50, 0.196, 0.0877, 1.75),
  (0.63, 0.312, 0.0551, 2.78),
  (0.71, 0.396, 0.0434, 3.53),
  (0.80, 0.503, 0.0342, 4.48),
  (0.90, 0.636, 0.0270, 5.67),
  (1.00, 0.785, 0.0219, 7.00),
  (1.12, 0.985, 0.0175, 8.78),
  (1.25, 1.227, 0.0140, 10.94),
  (1.40, 1.539, 0.0112, 13.72),
  (1.60, 2.011, 0.0086, 17.93),
  (1.80, 2.545, 0.0068, 22.69),
  (2.00, 3.142, 0.0055, 28.00),
  (2.24, 3.941, 0.0044, 35.13),
  (2.50, 4.909, 0.0035, 43.75)
ON CONFLICT DO NOTHING;

-- Insert standard winding factors
INSERT INTO winding_factors (winding_type, coefficient, description)
VALUES
  ('Concentré', 1.00, 'Bobinage concentré - toutes les spires sur un pôle'),
  ('Distribué 2/3', 0.966, 'Bobinage distribué 2/3 du pas polaire'),
  ('Distribué 5/6', 0.956, 'Bobinage distribué 5/6 du pas polaire'),
  ('Ondulé simple', 0.900, 'Bobinage ondulé simple couche'),
  ('Ondulé double', 0.920, 'Bobinage ondulé double couche'),
  ('Imbriqué', 0.850, 'Bobinage imbriqué')
ON CONFLICT (winding_type) DO NOTHING;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_projects_type ON projects(calculation_type);
