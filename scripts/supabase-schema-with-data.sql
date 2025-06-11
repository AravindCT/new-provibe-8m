-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'enterprise')),
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
  last_updated TEXT DEFAULT 'just now'
);

-- Create documents table
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'prd' CHECK (type IN ('prd', 'spec', 'user-story', 'api-doc', 'other')),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'approved', 'archived')),
  author_id UUID REFERENCES users(id) ON DELETE CASCADE,
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

-- Create project_sources table
CREATE TABLE IF NOT EXISTS project_sources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('github', 'figma', 'notion', 'file', 'other')),
  url TEXT,
  status TEXT DEFAULT 'disconnected' CHECK (status IN ('connected', 'processing', 'error', 'disconnected')),
  metadata JSONB,
  last_sync TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create activity_logs table
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  description TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_projects_owner_id ON projects(owner_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_documents_project_id ON documents(project_id);
CREATE INDEX IF NOT EXISTS idx_documents_author_id ON documents(author_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_project_id ON chat_messages(project_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_project_sources_project_id ON project_sources(project_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_project_id ON activity_logs(project_id);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

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

-- Insert dummy users
INSERT INTO users (id, email, full_name, avatar_url, plan) VALUES 
  ('550e8400-e29b-41d4-a716-446655440000', 'sarah.chen@example.com', 'Sarah Chen', 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150', 'pro'),
  ('550e8400-e29b-41d4-a716-446655440001', 'mike.johnson@example.com', 'Mike Johnson', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', 'free'),
  ('550e8400-e29b-41d4-a716-446655440002', 'alex.garcia@example.com', 'Alex Garcia', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', 'enterprise'),
  ('550e8400-e29b-41d4-a716-446655440003', 'emma.wilson@example.com', 'Emma Wilson', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150', 'pro')
ON CONFLICT (email) DO NOTHING;

-- Insert dummy projects
INSERT INTO projects (id, name, description, type, status, progress, owner_id, starred, tags, collaborators, documents_count, last_updated, created_at, updated_at) VALUES 
  ('proj-550e8400-e29b-41d4-a716-446655440000', 'TaskFlow SaaS Platform', 'AI-powered project management tool with advanced analytics and team collaboration features', 'saas', 'active', 75, '550e8400-e29b-41d4-a716-446655440000', true, ARRAY['saas', 'ai', 'productivity', 'collaboration'], 5, 12, '2 hours ago', NOW() - INTERVAL '2 weeks', NOW() - INTERVAL '2 hours'),
  ('proj-550e8400-e29b-41d4-a716-446655440001', 'E-commerce Mobile App', 'Modern e-commerce solution with AR try-on features and personalized recommendations', 'mobile', 'active', 60, '550e8400-e29b-41d4-a716-446655440000', false, ARRAY['mobile', 'ecommerce', 'ar', 'react-native'], 3, 8, '1 day ago', NOW() - INTERVAL '1 week', NOW() - INTERVAL '1 day'),
  ('proj-550e8400-e29b-41d4-a716-446655440002', 'FinTech API Gateway', 'Secure microservices API gateway for financial applications with real-time monitoring', 'api', 'complete', 100, '550e8400-e29b-41d4-a716-446655440000', true, ARRAY['fintech', 'api', 'microservices', 'security'], 2, 15, '1 week ago', NOW() - INTERVAL '3 months', NOW() - INTERVAL '1 week'),
  ('proj-550e8400-e29b-41d4-a716-446655440003', 'Healthcare Dashboard', 'Patient management dashboard with telemedicine integration and analytics', 'saas', 'draft', 25, '550e8400-e29b-41d4-a716-446655440000', false, ARRAY['healthcare', 'dashboard', 'telemedicine'], 1, 4, '3 days ago', NOW() - INTERVAL '5 days', NOW() - INTERVAL '3 days'),
  ('proj-550e8400-e29b-41d4-a716-446655440004', 'EdTech Learning Platform', 'Interactive learning platform with AI-powered personalized curriculum', 'saas', 'active', 45, '550e8400-e29b-41d4-a716-446655440000', true, ARRAY['edtech', 'ai', 'learning', 'education'], 4, 7, '5 hours ago', NOW() - INTERVAL '10 days', NOW() - INTERVAL '5 hours'),
  ('proj-550e8400-e29b-41d4-a716-446655440005', 'IoT Device Manager', 'Centralized IoT device management with real-time monitoring and alerts', 'api', 'paused', 35, '550e8400-e29b-41d4-a716-446655440000', false, ARRAY['iot', 'monitoring', 'alerts', 'dashboard'], 2, 6, '2 weeks ago', NOW() - INTERVAL '1 month', NOW() - INTERVAL '2 weeks'),
  ('proj-550e8400-e29b-41d4-a716-446655440006', 'Social Media Analytics', 'Comprehensive social media analytics and reporting platform', 'saas', 'active', 80, '550e8400-e29b-41d4-a716-446655440000', false, ARRAY['analytics', 'social-media', 'reporting'], 3, 10, '6 hours ago', NOW() - INTERVAL '3 weeks', NOW() - INTERVAL '6 hours'),
  ('proj-550e8400-e29b-41d4-a716-446655440007', 'Blockchain Wallet', 'Secure multi-currency blockchain wallet with DeFi integration', 'mobile', 'draft', 15, '550e8400-e29b-41d4-a716-446655440000', true, ARRAY['blockchain', 'wallet', 'defi', 'crypto'], 1, 3, '1 week ago', NOW() - INTERVAL '2 days', NOW() - INTERVAL '1 week')
ON CONFLICT (id) DO NOTHING;

-- Insert dummy documents
INSERT INTO documents (id, project_id, title, content, type, status, author_id, created_at, updated_at) VALUES 
  ('doc-550e8400-e29b-41d4-a716-446655440000', 'proj-550e8400-e29b-41d4-a716-446655440000', 'TaskFlow PRD', 'Product Requirements Document for TaskFlow SaaS Platform...', 'prd', 'approved', '550e8400-e29b-41d4-a716-446655440000', NOW() - INTERVAL '1 week', NOW() - INTERVAL '2 days'),
  ('doc-550e8400-e29b-41d4-a716-446655440001', 'proj-550e8400-e29b-41d4-a716-446655440000', 'Technical Architecture', 'Technical specification and architecture overview...', 'spec', 'review', '550e8400-e29b-41d4-a716-446655440001', NOW() - INTERVAL '5 days', NOW() - INTERVAL '1 day'),
  ('doc-550e8400-e29b-41d4-a716-446655440002', 'proj-550e8400-e29b-41d4-a716-446655440000', 'User Stories', 'Comprehensive user stories for all features...', 'user-story', 'approved', '550e8400-e29b-41d4-a716-446655440002', NOW() - INTERVAL '3 days', NOW() - INTERVAL '1 day'),
  ('doc-550e8400-e29b-41d4-a716-446655440003', 'proj-550e8400-e29b-41d4-a716-446655440001', 'E-commerce API Spec', 'API specification for e-commerce mobile app...', 'api-doc', 'draft', '550e8400-e29b-41d4-a716-446655440000', NOW() - INTERVAL '2 days', NOW() - INTERVAL '6 hours'),
  ('doc-550e8400-e29b-41d4-a716-446655440004', 'proj-550e8400-e29b-41d4-a716-446655440002', 'Security Requirements', 'Security requirements and compliance documentation...', 'spec', 'approved', '550e8400-e29b-41d4-a716-446655440000', NOW() - INTERVAL '2 weeks', NOW() - INTERVAL '1 week')
ON CONFLICT (id) DO NOTHING;

-- Insert dummy chat messages
INSERT INTO chat_messages (id, project_id, user_id, content, role, created_at) VALUES 
  ('msg-550e8400-e29b-41d4-a716-446655440000', 'proj-550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440000', 'Hello! I need help with the user authentication flow for TaskFlow.', 'user', NOW() - INTERVAL '2 hours'),
  ('msg-550e8400-e29b-41d4-a716-446655440001', 'proj-550e8400-e29b-41d4-a716-446655440000', NULL, 'I can help you design a secure authentication flow for TaskFlow. Based on your project being a SaaS platform, I recommend implementing OAuth 2.0 with JWT tokens. Would you like me to create a detailed authentication specification document?', 'assistant', NOW() - INTERVAL '2 hours'),
  ('msg-550e8400-e29b-41d4-a716-446655440002', 'proj-550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440000', 'Yes, that would be great! Please include multi-factor authentication options.', 'user', NOW() - INTERVAL '1 hour'),
  ('msg-550e8400-e29b-41d4-a716-446655440003', 'proj-550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 'Can you help me plan the AR try-on feature for the e-commerce app?', 'user', NOW() - INTERVAL '1 day'),
  ('msg-550e8400-e29b-41d4-a716-446655440004', 'proj-550e8400-e29b-41d4-a716-446655440001', NULL, 'For AR try-on features, you will need to consider camera integration, 3D model rendering, and face/body tracking. I can help you create a technical specification that covers the AR SDK integration, performance requirements, and user experience flow.', 'assistant', NOW() - INTERVAL '1 day')
ON CONFLICT (id) DO NOTHING;

-- Insert dummy project sources
INSERT INTO project_sources (id, project_id, name, type, url, status, last_sync, created_at, updated_at) VALUES 
  ('src-550e8400-e29b-41d4-a716-446655440000', 'proj-550e8400-e29b-41d4-a716-446655440000', 'TaskFlow Repository', 'github', 'https://github.com/company/taskflow', 'connected', NOW() - INTERVAL '2 hours', NOW() - INTERVAL '1 week', NOW() - INTERVAL '2 hours'),
  ('src-550e8400-e29b-41d4-a716-446655440001', 'proj-550e8400-e29b-41d4-a716-446655440000', 'Design System', 'figma', 'https://figma.com/design/taskflow-system', 'connected', NOW() - INTERVAL '1 day', NOW() - INTERVAL '5 days', NOW() - INTERVAL '1 day'),
  ('src-550e8400-e29b-41d4-a716-446655440002', 'proj-550e8400-e29b-41d4-a716-446655440001', 'E-commerce Backend', 'github', 'https://github.com/company/ecommerce-api', 'processing', NULL, NOW() - INTERVAL '3 days', NOW() - INTERVAL '1 hour'),
  ('src-550e8400-e29b-41d4-a716-446655440003', 'proj-550e8400-e29b-41d4-a716-446655440002', 'API Documentation', 'notion', 'https://notion.so/fintech-api-docs', 'connected', NOW() - INTERVAL '1 week', NOW() - INTERVAL '2 weeks', NOW() - INTERVAL '1 week')
ON CONFLICT (id) DO NOTHING;

-- Insert dummy activity logs
INSERT INTO activity_logs (id, user_id, project_id, action, description, created_at) VALUES 
  ('act-550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440000', 'proj-550e8400-e29b-41d4-a716-446655440000', 'document_created', 'Created new PRD document', NOW() - INTERVAL '2 hours'),
  ('act-550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 'proj-550e8400-e29b-41d4-a716-446655440000', 'project_updated', 'Updated project progress to 75%', NOW() - INTERVAL '3 hours'),
  ('act-550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'proj-550e8400-e29b-41d4-a716-446655440000', 'document_reviewed', 'Reviewed technical architecture document', NOW() - INTERVAL '1 day'),
  ('act-550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440000', 'proj-550e8400-e29b-41d4-a716-446655440001', 'source_connected', 'Connected GitHub repository', NOW() - INTERVAL '2 days'),
  ('act-550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440000', 'proj-550e8400-e29b-41d4-a716-446655440002', 'project_completed', 'Marked FinTech API Gateway as complete', NOW() - INTERVAL '1 week'),
  ('act-550e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440000', 'proj-550e8400-e29b-41d4-a716-446655440004', 'project_created', 'Created new EdTech Learning Platform project', NOW() - INTERVAL '10 days')
ON CONFLICT (id) DO NOTHING;

-- Update projects with correct document counts
UPDATE projects SET documents_count = (
  SELECT COUNT(*) FROM documents WHERE documents.project_id = projects.id
);
