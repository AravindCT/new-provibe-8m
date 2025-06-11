-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'saas',
  status TEXT NOT NULL DEFAULT 'draft',
  progress INTEGER DEFAULT 0,
  owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
  starred BOOLEAN DEFAULT FALSE,
  tags TEXT[] DEFAULT '{}',
  collaborators INTEGER DEFAULT 1,
  documents_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  lastUpdated TEXT DEFAULT NOW()::TEXT
);

-- Create documents table
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'requirements',
  status TEXT NOT NULL DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_projects_owner_id ON projects(owner_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_documents_project_id ON documents(project_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_project_id ON chat_messages(project_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own projects" ON projects
  FOR SELECT USING (auth.uid() = owner_id);

CREATE POLICY "Users can create own projects" ON projects
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update own projects" ON projects
  FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete own projects" ON projects
  FOR DELETE USING (auth.uid() = owner_id);

CREATE POLICY "Users can view project documents" ON documents
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = documents.project_id 
      AND projects.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can create project documents" ON documents
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = documents.project_id 
      AND projects.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can view project chat messages" ON chat_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = chat_messages.project_id 
      AND projects.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can create project chat messages" ON chat_messages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = chat_messages.project_id 
      AND projects.owner_id = auth.uid()
    )
  );

-- Insert sample data
INSERT INTO users (id, email, full_name) VALUES 
  ('user-123', 'sarah@example.com', 'Sarah Chen')
ON CONFLICT (email) DO NOTHING;

INSERT INTO projects (id, name, description, type, status, progress, owner_id, starred, tags, collaborators, documents_count, lastUpdated) VALUES 
  ('proj-1', 'E-commerce Platform', 'Modern e-commerce solution with AI recommendations', 'ecommerce', 'active', 75, 'user-123', true, ARRAY['react', 'nextjs', 'ai'], 3, 8, '2 hours ago'),
  ('proj-2', 'Task Management App', 'Collaborative task management with real-time updates', 'saas', 'active', 60, 'user-123', false, ARRAY['productivity', 'collaboration'], 2, 5, '1 day ago'),
  ('proj-3', 'Mobile Banking App', 'Secure mobile banking application', 'mobile', 'draft', 25, 'user-123', true, ARRAY['fintech', 'mobile'], 1, 3, '3 days ago'),
  ('proj-4', 'API Gateway Service', 'Microservices API gateway with monitoring', 'api', 'complete', 100, 'user-123', false, ARRAY['microservices', 'api'], 4, 12, '1 week ago')
ON CONFLICT (id) DO NOTHING;
