/*
  # Initial Schema Setup

  1. Tables
    - users (managed by Supabase Auth)
    - projects
      - id (uuid, primary key)
      - name (text)
      - description (text, nullable)
      - created_at (timestamp with timezone)
      - updated_at (timestamp with timezone)
    - columns
      - id (uuid, primary key)
      - project_id (uuid, foreign key)
      - name (text)
      - order (integer)
      - created_at (timestamp with timezone)
    - tasks
      - id (uuid, primary key)
      - project_id (uuid, foreign key)
      - column_id (uuid, foreign key)
      - title (text)
      - description (text, nullable)
      - assignee (uuid, foreign key to auth.users)
      - priority (enum: low, medium, high, urgent)
      - deadline (timestamp with timezone, nullable)
      - created_at (timestamp with timezone)
      - updated_at (timestamp with timezone)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create priority enum type
CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high', 'urgent');

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create columns table
CREATE TABLE IF NOT EXISTS columns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name text NOT NULL,
  "order" integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  column_id uuid NOT NULL REFERENCES columns(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  assignee uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  priority task_priority DEFAULT 'medium',
  deadline timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE columns ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Create policies for projects
CREATE POLICY "Users can view all projects"
  ON projects
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create projects"
  ON projects
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update projects"
  ON projects
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Users can delete projects"
  ON projects
  FOR DELETE
  TO authenticated
  USING (true);

-- Create policies for columns
CREATE POLICY "Users can view columns of accessible projects"
  ON columns
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create columns in accessible projects"
  ON columns
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update columns in accessible projects"
  ON columns
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Users can delete columns in accessible projects"
  ON columns
  FOR DELETE
  TO authenticated
  USING (true);

-- Create policies for tasks
CREATE POLICY "Users can view tasks of accessible projects"
  ON tasks
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create tasks in accessible projects"
  ON tasks
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update tasks in accessible projects"
  ON tasks
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Users can delete tasks in accessible projects"
  ON tasks
  FOR DELETE
  TO authenticated
  USING (true);