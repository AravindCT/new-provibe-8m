-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS activity_logs CASCADE;
DROP TABLE IF EXISTS chat_messages CASCADE;
DROP TABLE IF EXISTS project_sources CASCADE;
DROP TABLE IF EXISTS documents CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'enterprise')),
  company TEXT,
  role TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create projects table with target audience fields
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'saas' CHECK (type IN ('saas', 'mobile', 'api', 'ecommerce', 'other')),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'complete', 'paused', 'archived')),
  progress INTEGER DEFAULT 0,
  owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
  starred BOOLEAN DEFAULT FALSE,
  tags TEXT[] DEFAULT '{}',
  collaborators INTEGER DEFAULT 1,
  documents_count INTEGER DEFAULT 0,
  target_audience TEXT,
  market_size TEXT,
  business_model TEXT,
  key_features TEXT[],
  tech_stack TEXT[],
  timeline TEXT,
  budget_range TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_updated TEXT DEFAULT 'just now'
);

-- Create documents table
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'prd' CHECK (type IN ('prd', 'spec', 'user-story', 'api-doc', 'design-doc', 'test-plan', 'other')),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'approved', 'archived')),
  author_id UUID REFERENCES users(id) ON DELETE CASCADE,
  template_id TEXT,
  ai_generated BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create chat_messages table
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create project_sources table
CREATE TABLE project_sources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('github', 'figma', 'notion', 'file', 'confluence', 'linear', 'other')),
  url TEXT,
  status TEXT DEFAULT 'disconnected' CHECK (status IN ('connected', 'processing', 'error', 'disconnected')),
  metadata JSONB,
  last_sync TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create activity_logs table
CREATE TABLE activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  description TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create templates table
CREATE TABLE templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  content TEXT NOT NULL,
  author_id UUID REFERENCES users(id),
  is_public BOOLEAN DEFAULT TRUE,
  usage_count INTEGER DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0.0,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_projects_owner_id ON projects(owner_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_type ON projects(type);
CREATE INDEX idx_documents_project_id ON documents(project_id);
CREATE INDEX idx_documents_author_id ON documents(author_id);
CREATE INDEX idx_chat_messages_project_id ON chat_messages(project_id);
CREATE INDEX idx_chat_messages_created_at ON chat_messages(created_at);
CREATE INDEX idx_project_sources_project_id ON project_sources(project_id);
CREATE INDEX idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_project_id ON activity_logs(project_id);
CREATE INDEX idx_templates_category ON templates(category);
CREATE INDEX idx_templates_public ON templates(is_public);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (simplified for demo)
CREATE POLICY "Enable read access for all users" ON users FOR SELECT USING (true);
CREATE POLICY "Enable read access for all projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Enable read access for all documents" ON documents FOR SELECT USING (true);
CREATE POLICY "Enable read access for all chat_messages" ON chat_messages FOR SELECT USING (true);
CREATE POLICY "Enable read access for all project_sources" ON project_sources FOR SELECT USING (true);
CREATE POLICY "Enable read access for all activity_logs" ON activity_logs FOR SELECT USING (true);
CREATE POLICY "Enable read access for all templates" ON templates FOR SELECT USING (true);

-- Insert target audience users (Product Managers, Startup Founders, Development Teams)
INSERT INTO users (id, email, full_name, avatar_url, plan, company, role) VALUES 
  ('550e8400-e29b-41d4-a716-446655440000', 'sarah.chen@techcorp.com', 'Sarah Chen', 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150', 'pro', 'TechCorp Inc.', 'Senior Product Manager'),
  ('550e8400-e29b-41d4-a716-446655440001', 'mike.rodriguez@startup.io', 'Mike Rodriguez', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', 'enterprise', 'InnovateLab', 'Founder & CEO'),
  ('550e8400-e29b-41d4-a716-446655440002', 'alex.kim@devstudio.com', 'Alex Kim', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', 'pro', 'DevStudio', 'Lead Developer'),
  ('550e8400-e29b-41d4-a716-446655440003', 'emma.wilson@fintech.co', 'Emma Wilson', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150', 'enterprise', 'FinTech Solutions', 'Head of Product'),
  ('550e8400-e29b-41d4-a716-446655440004', 'david.park@healthtech.ai', 'David Park', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150', 'pro', 'HealthTech AI', 'CTO'),
  ('550e8400-e29b-41d4-a716-446655440005', 'lisa.zhang@ecommerce.plus', 'Lisa Zhang', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150', 'free', 'E-commerce Plus', 'Product Owner')
ON CONFLICT (email) DO NOTHING;

-- Insert realistic projects for target audience
INSERT INTO projects (id, name, description, type, status, progress, owner_id, starred, tags, collaborators, documents_count, target_audience, market_size, business_model, key_features, tech_stack, timeline, budget_range, last_updated, created_at, updated_at) VALUES 
  (
    'proj-550e8400-e29b-41d4-a716-446655440000', 
    'TaskFlow Pro - AI Project Management', 
    'Next-generation project management platform with AI-powered insights, automated workflows, and intelligent resource allocation for enterprise teams',
    'saas', 
    'active', 
    75, 
    '550e8400-e29b-41d4-a716-446655440000', 
    true, 
    ARRAY['saas', 'ai', 'productivity', 'enterprise', 'project-management'], 
    8, 
    15,
    'Enterprise teams (50-500 employees), Project Managers, Development Teams, C-level executives',
    '$12B global project management software market, targeting 2% market share',
    'SaaS subscription model: $29/user/month (Professional), $49/user/month (Enterprise)',
    ARRAY['AI-powered task prioritization', 'Real-time collaboration', 'Advanced analytics', 'Custom workflows', 'Integration hub'],
    ARRAY['React', 'Node.js', 'PostgreSQL', 'Redis', 'AWS', 'OpenAI API'],
    '18 months MVP to market, 24 months full feature set',
    '$2M - $5M Series A funding',
    '2 hours ago', 
    NOW() - INTERVAL '3 months', 
    NOW() - INTERVAL '2 hours'
  ),
  (
    'proj-550e8400-e29b-41d4-a716-446655440001', 
    'FinanceAI - Personal Wealth Assistant', 
    'AI-driven personal finance app that provides intelligent investment recommendations, automated budgeting, and financial goal tracking',
    'mobile', 
    'active', 
    60, 
    '550e8400-e29b-41d4-a716-446655440001', 
    true, 
    ARRAY['fintech', 'ai', 'mobile', 'personal-finance', 'investment'], 
    5, 
    12,
    'Millennials and Gen Z (25-40 years), Income $50K+, Tech-savvy individuals seeking financial growth',
    '$1.2T personal finance app market, targeting 0.5% market share',
    'Freemium model: Free basic features, $9.99/month Premium, $19.99/month Pro with AI advisor',
    ARRAY['AI investment advisor', 'Automated budgeting', 'Goal tracking', 'Portfolio optimization', 'Educational content'],
    ARRAY['React Native', 'Python', 'TensorFlow', 'PostgreSQL', 'AWS', 'Plaid API'],
    '12 months MVP, 18 months full launch',
    '$1M - $3M Seed funding',
    '1 day ago', 
    NOW() - INTERVAL '2 months', 
    NOW() - INTERVAL '1 day'
  ),
  (
    'proj-550e8400-e29b-41d4-a716-446655440002', 
    'MedConnect - Telemedicine Platform', 
    'Comprehensive telemedicine platform connecting patients with healthcare providers, featuring AI symptom checker and integrated health records',
    'saas', 
    'active', 
    45, 
    '550e8400-e29b-41d4-a716-446655440004', 
    false, 
    ARRAY['healthcare', 'telemedicine', 'ai', 'saas', 'hipaa'], 
    12, 
    18,
    'Healthcare providers (clinics, hospitals), Patients seeking remote care, Rural communities with limited healthcare access',
    '$55B telemedicine market, targeting 1% market share',
    'B2B2C model: $199/month per provider, $2.99 per consultation fee',
    ARRAY['Video consultations', 'AI symptom checker', 'EHR integration', 'Prescription management', 'Appointment scheduling'],
    ARRAY['React', 'Node.js', 'WebRTC', 'PostgreSQL', 'AWS', 'HIPAA compliance'],
    '24 months MVP due to regulatory requirements',
    '$5M - $10M Series A funding',
    '3 days ago', 
    NOW() - INTERVAL '6 months', 
    NOW() - INTERVAL '3 days'
  ),
  (
    'proj-550e8400-e29b-41d4-a716-446655440003', 
    'EduTech Learning Hub', 
    'Adaptive learning platform for K-12 education with AI-powered personalized curriculum and real-time progress tracking for students and teachers',
    'saas', 
    'draft', 
    25, 
    '550e8400-e29b-41d4-a716-446655440002', 
    true, 
    ARRAY['edtech', 'ai', 'education', 'k12', 'adaptive-learning'], 
    6, 
    8,
    'K-12 schools, Teachers, Students (ages 5-18), Parents, School administrators',
    '$350B global education technology market, targeting 0.3% market share',
    'B2B licensing: $5/student/month for schools, $15/month for individual families',
    ARRAY['Adaptive learning paths', 'Real-time analytics', 'Gamification', 'Parent dashboard', 'Teacher tools'],
    ARRAY['React', 'Python', 'TensorFlow', 'PostgreSQL', 'AWS', 'Learning analytics'],
    '15 months MVP, 20 months full platform',
    '$3M - $7M Series A funding',
    '1 week ago', 
    NOW() - INTERVAL '1 month', 
    NOW() - INTERVAL '1 week'
  ),
  (
    'proj-550e8400-e29b-41d4-a716-446655440004', 
    'RetailOptimize - E-commerce Analytics', 
    'Advanced e-commerce analytics platform with AI-powered demand forecasting, inventory optimization, and customer behavior insights',
    'saas', 
    'active', 
    80, 
    '550e8400-e29b-41d4-a716-446655440005', 
    false, 
    ARRAY['ecommerce', 'analytics', 'ai', 'retail', 'forecasting'], 
    4, 
    14,
    'E-commerce businesses ($1M+ annual revenue), Retail managers, Inventory planners, Marketing teams',
    '$6.2B retail analytics market, targeting 1.5% market share',
    'Tiered SaaS: $299/month (Starter), $799/month (Professional), $1,999/month (Enterprise)',
    ARRAY['Demand forecasting', 'Inventory optimization', 'Customer segmentation', 'Price optimization', 'ROI tracking'],
    ARRAY['React', 'Python', 'Scikit-learn', 'PostgreSQL', 'Redis', 'Shopify API'],
    '10 months MVP, 14 months full launch',
    '$2M - $4M Seed funding',
    '5 hours ago', 
    NOW() - INTERVAL '8 months', 
    NOW() - INTERVAL '5 hours'
  ),
  (
    'proj-550e8400-e29b-41d4-a716-446655440005', 
    'CryptoVault - DeFi Portfolio Manager', 
    'Decentralized finance portfolio management tool with automated yield farming, risk assessment, and cross-chain asset tracking',
    'mobile', 
    'draft', 
    15, 
    '550e8400-e29b-41d4-a716-446655440001', 
    true, 
    ARRAY['defi', 'crypto', 'blockchain', 'portfolio', 'yield-farming'], 
    3, 
    5,
    'Crypto investors, DeFi enthusiasts, Portfolio managers, High-net-worth individuals in crypto',
    '$13B DeFi market, targeting 2% market share',
    'Transaction-based fees: 0.5% on managed assets, Premium features $29/month',
    ARRAY['Cross-chain portfolio tracking', 'Automated yield farming', 'Risk assessment', 'Tax reporting', 'DeFi protocol integration'],
    ARRAY['React Native', 'Solidity', 'Web3.js', 'Node.js', 'IPFS', 'Ethereum'],
    '18 months MVP due to security requirements',
    '$1M - $2M Pre-seed funding',
    '2 weeks ago', 
    NOW() - INTERVAL '3 weeks', 
    NOW() - INTERVAL '2 weeks'
  ),
  (
    'proj-550e8400-e29b-41d4-a716-446655440006', 
    'GreenTech Carbon Tracker', 
    'Enterprise carbon footprint tracking and ESG reporting platform with AI-powered sustainability recommendations',
    'saas', 
    'active', 
    55, 
    '550e8400-e29b-41d4-a716-446655440003', 
    false, 
    ARRAY['sustainability', 'esg', 'carbon-tracking', 'enterprise', 'ai'], 
    7, 
    11,
    'Large enterprises (Fortune 1000), Sustainability officers, ESG reporting teams, Government agencies',
    '$16B ESG software market, targeting 0.8% market share',
    'Enterprise licensing: $50K/year (up to 1000 employees), $150K/year (enterprise)',
    ARRAY['Carbon footprint calculation', 'ESG reporting', 'Sustainability recommendations', 'Compliance tracking', 'Supplier assessment'],
    ARRAY['React', 'Python', 'PostgreSQL', 'AWS', 'Machine Learning', 'API integrations'],
    '20 months MVP, 30 months full compliance suite',
    '$8M - $15M Series A funding',
    '1 day ago', 
    NOW() - INTERVAL '4 months', 
    NOW() - INTERVAL '1 day'
  ),
  (
    'proj-550e8400-e29b-41d4-a716-446655440007', 
    'FoodieAI - Restaurant Discovery', 
    'AI-powered restaurant recommendation app with personalized taste profiles, social features, and integrated reservation system',
    'mobile', 
    'complete', 
    100, 
    '550e8400-e29b-41d4-a716-446655440002', 
    true, 
    ARRAY['food', 'ai', 'recommendations', 'social', 'mobile'], 
    4, 
    20,
    'Food enthusiasts (ages 18-45), Urban professionals, Social diners, Restaurant discovery seekers',
    '$150B restaurant industry, targeting 0.1% of discovery market',
    'Freemium + commission: Free app, 3% commission on reservations, $4.99/month premium features',
    ARRAY['AI taste profiling', 'Social recommendations', 'Reservation integration', 'Photo recognition', 'Review aggregation'],
    ARRAY['React Native', 'Python', 'TensorFlow', 'PostgreSQL', 'AWS', 'OpenTable API'],
    'Completed in 14 months',
    '$500K - $1M Pre-seed (completed)',
    '1 month ago', 
    NOW() - INTERVAL '18 months', 
    NOW() - INTERVAL '1 month'
  )
ON CONFLICT (id) DO NOTHING;

-- Insert comprehensive documents for each project
INSERT INTO documents (id, project_id, title, content, type, status, author_id, ai_generated, created_at, updated_at) VALUES 
  ('doc-550e8400-e29b-41d4-a716-446655440000', 'proj-550e8400-e29b-41d4-a716-446655440000', 'TaskFlow Pro - Product Requirements Document', 'Comprehensive PRD for TaskFlow Pro including market analysis, user personas, feature specifications, and success metrics...', 'prd', 'approved', '550e8400-e29b-41d4-a716-446655440000', true, NOW() - INTERVAL '2 weeks', NOW() - INTERVAL '1 week'),
  ('doc-550e8400-e29b-41d4-a716-446655440001', 'proj-550e8400-e29b-41d4-a716-446655440000', 'AI Integration Technical Specification', 'Technical architecture for AI-powered features including machine learning models, data pipelines, and API integrations...', 'spec', 'review', '550e8400-e29b-41d4-a716-446655440002', true, NOW() - INTERVAL '1 week', NOW() - INTERVAL '2 days'),
  ('doc-550e8400-e29b-41d4-a716-446655440002', 'proj-550e8400-e29b-41d4-a716-446655440001', 'FinanceAI User Stories', 'Complete user stories for personal finance app covering investment recommendations, budgeting, and goal tracking...', 'user-story', 'approved', '550e8400-e29b-41d4-a716-446655440001', false, NOW() - INTERVAL '3 days', NOW() - INTERVAL '1 day'),
  ('doc-550e8400-e29b-41d4-a716-446655440003', 'proj-550e8400-e29b-41d4-a716-446655440002', 'HIPAA Compliance Documentation', 'Healthcare compliance requirements and implementation guidelines for telemedicine platform...', 'spec', 'approved', '550e8400-e29b-41d4-a716-446655440004', false, NOW() - INTERVAL '1 month', NOW() - INTERVAL '2 weeks'),
  ('doc-550e8400-e29b-41d4-a716-446655440004', 'proj-550e8400-e29b-41d4-a716-446655440003', 'Adaptive Learning Algorithm Design', 'Design document for AI-powered adaptive learning system including personalization algorithms...', 'design-doc', 'draft', '550e8400-e29b-41d4-a716-446655440002', true, NOW() - INTERVAL '5 days', NOW() - INTERVAL '1 day')
ON CONFLICT (id) DO NOTHING;

-- Insert realistic chat messages showing AI assistance
INSERT INTO chat_messages (id, project_id, user_id, content, role, created_at) VALUES 
  ('msg-550e8400-e29b-41d4-a716-446655440000', 'proj-550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440000', 'I need help defining the AI features for TaskFlow Pro. What machine learning capabilities should we prioritize for project management?', 'user', NOW() - INTERVAL '3 hours'),
  ('msg-550e8400-e29b-41d4-a716-446655440001', 'proj-550e8400-e29b-41d4-a716-446655440000', NULL, 'For TaskFlow Pro, I recommend prioritizing these AI capabilities: 1) Intelligent task prioritization using historical data and deadlines, 2) Resource allocation optimization, 3) Risk prediction for project delays, 4) Automated time estimation based on similar tasks. Would you like me to create a detailed technical specification for any of these features?', 'assistant', NOW() - INTERVAL '3 hours'),
  ('msg-550e8400-e29b-41d4-a716-446655440002', 'proj-550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Can you help me create user personas for FinanceAI? I want to target millennials who are new to investing.', 'user', NOW() - INTERVAL '1 day'),
  ('msg-550e8400-e29b-41d4-a716-446655440003', 'proj-550e8400-e29b-41d4-a716-446655440001', NULL, 'I will create detailed user personas for FinanceAI targeting millennials. Based on market research, here are three primary personas: 1) "Investment Newbie" - 25-30, $60K income, wants simple guidance, 2) "Growth Seeker" - 30-35, $80K income, seeks optimization, 3) "Goal-Oriented Saver" - 28-33, $70K income, focused on specific financial goals. Should I develop full persona profiles with pain points and motivations?', 'assistant', NOW() - INTERVAL '1 day'),
  ('msg-550e8400-e29b-41d4-a716-446655440004', 'proj-550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440004', 'What are the key HIPAA requirements I need to consider for the telemedicine platform?', 'user', NOW() - INTERVAL '2 days'),
  ('msg-550e8400-e29b-41d4-a716-446655440005', 'proj-550e8400-e29b-41d4-a716-446655440002', NULL, 'For HIPAA compliance in your telemedicine platform, focus on these key requirements: 1) End-to-end encryption for all communications, 2) Access controls and user authentication, 3) Audit logs for all PHI access, 4) Business Associate Agreements with third-party services, 5) Data backup and recovery procedures. I can help you create a comprehensive HIPAA compliance checklist and implementation plan.', 'assistant', NOW() - INTERVAL '2 days')
ON CONFLICT (id) DO NOTHING;

-- Insert project sources
INSERT INTO project_sources (id, project_id, name, type, url, status, last_sync, created_at, updated_at) VALUES 
  ('src-550e8400-e29b-41d4-a716-446655440000', 'proj-550e8400-e29b-41d4-a716-446655440000', 'TaskFlow Repository', 'github', 'https://github.com/techcorp/taskflow-pro', 'connected', NOW() - INTERVAL '2 hours', NOW() - INTERVAL '2 weeks', NOW() - INTERVAL '2 hours'),
  ('src-550e8400-e29b-41d4-a716-446655440001', 'proj-550e8400-e29b-41d4-a716-446655440000', 'Design System', 'figma', 'https://figma.com/design/taskflow-design-system', 'connected', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 week', NOW() - INTERVAL '1 day'),
  ('src-550e8400-e29b-41d4-a716-446655440002', 'proj-550e8400-e29b-41d4-a716-446655440001', 'FinanceAI Backend', 'github', 'https://github.com/innovatelab/financeai-api', 'processing', NULL, NOW() - INTERVAL '3 days', NOW() - INTERVAL '1 hour'),
  ('src-550e8400-e29b-41d4-a716-446655440003', 'proj-550e8400-e29b-41d4-a716-446655440002', 'Medical Compliance Docs', 'confluence', 'https://healthtech.atlassian.net/wiki/compliance', 'connected', NOW() - INTERVAL '1 week', NOW() - INTERVAL '1 month', NOW() - INTERVAL '1 week')
ON CONFLICT (id) DO NOTHING;

-- Insert activity logs
INSERT INTO activity_logs (id, user_id, project_id, action, description, created_at) VALUES 
  ('act-550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440000', 'proj-550e8400-e29b-41d4-a716-446655440000', 'document_generated', 'Generated AI-powered PRD for TaskFlow Pro', NOW() - INTERVAL '2 weeks'),
  ('act-550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'proj-550e8400-e29b-41d4-a716-446655440001', 'project_created', 'Created FinanceAI project with target audience analysis', NOW() - INTERVAL '2 months'),
  ('act-550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440004', 'proj-550e8400-e29b-41d4-a716-446655440002', 'compliance_review', 'Completed HIPAA compliance review for MedConnect', NOW() - INTERVAL '2 weeks'),
  ('act-550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', 'proj-550e8400-e29b-41d4-a716-446655440007', 'project_completed', 'Successfully launched FoodieAI to app stores', NOW() - INTERVAL '1 month'),
  ('act-550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440005', 'proj-550e8400-e29b-41d4-a716-446655440004', 'analytics_integration', 'Connected Shopify analytics for RetailOptimize', NOW() - INTERVAL '5 hours')
ON CONFLICT (id) DO NOTHING;

-- Insert document templates for target audience
INSERT INTO templates (id, name, description, category, content, author_id, usage_count, rating, tags, created_at, updated_at) VALUES 
  ('tpl-550e8400-e29b-41d4-a716-446655440000', 'SaaS Product Requirements Document', 'Comprehensive PRD template specifically designed for SaaS products with sections for market analysis, user personas, feature specifications, and success metrics', 'prd', '# Product Requirements Document\n\n## Executive Summary\n\n### Product Vision\n[Define the product vision and mission]\n\n### Target Market\n[Describe target audience and market size]\n\n## Market Analysis\n\n### Market Size and Opportunity\n[TAM, SAM, SOM analysis]\n\n### Competitive Landscape\n[Competitor analysis and differentiation]\n\n## User Personas\n\n### Primary Persona\n[Detailed user persona with pain points]\n\n## Feature Specifications\n\n### Core Features\n[Detailed feature requirements]\n\n### Success Metrics\n[KPIs and measurement criteria]', '550e8400-e29b-41d4-a716-446655440000', 1247, 4.8, ARRAY['saas', 'prd', 'product-management', 'requirements'], NOW() - INTERVAL '6 months', NOW() - INTERVAL '1 week'),
  ('tpl-550e8400-e29b-41d4-a716-446655440001', 'Mobile App Technical Specification', 'Technical architecture template for mobile applications including platform considerations, API design, security requirements, and performance specifications', 'spec', '# Mobile App Technical Specification\n\n## Architecture Overview\n\n### Platform Strategy\n[iOS, Android, or Cross-platform approach]\n\n### Technology Stack\n[Frontend, Backend, Database, APIs]\n\n## System Architecture\n\n### Client-Server Architecture\n[Communication protocols and data flow]\n\n### Security Requirements\n[Authentication, encryption, data protection]\n\n## API Specifications\n\n### Endpoint Documentation\n[RESTful API design and documentation]\n\n## Performance Requirements\n[Load times, scalability, offline capabilities]', '550e8400-e29b-41d4-a716-446655440002', 892, 4.7, ARRAY['mobile', 'technical', 'architecture', 'specification'], NOW() - INTERVAL '4 months', NOW() - INTERVAL '3 days'),
  ('tpl-550e8400-e29b-41d4-a716-446655440002', 'Startup Business Model Canvas', 'Business model template tailored for startups including value propositions, customer segments, revenue streams, and key partnerships', 'business', '# Business Model Canvas\n\n## Value Propositions\n[What value do you deliver to customers?]\n\n## Customer Segments\n[Who are your most important customers?]\n\n## Customer Relationships\n[What type of relationship do you establish?]\n\n## Channels\n[How do you reach your customers?]\n\n## Revenue Streams\n[How do you make money?]\n\n## Key Resources\n[What key resources do you need?]\n\n## Key Activities\n[What key activities do you perform?]\n\n## Key Partnerships\n[Who are your key partners?]\n\n## Cost Structure\n[What are the most important costs?]', '550e8400-e29b-41d4-a716-446655440001', 756, 4.6, ARRAY['startup', 'business-model', 'strategy', 'canvas'], NOW() - INTERVAL '3 months', NOW() - INTERVAL '1 week'),
  ('tpl-550e8400-e29b-41d4-a716-446655440003', 'AI/ML Project Specification', 'Comprehensive template for AI and machine learning projects including data requirements, model specifications, and evaluation metrics', 'spec', '# AI/ML Project Specification\n\n## Problem Definition\n[Clear definition of the ML problem to solve]\n\n## Data Requirements\n\n### Data Sources\n[Where will training data come from?]\n\n### Data Quality\n[Data cleaning and preprocessing requirements]\n\n## Model Specifications\n\n### Algorithm Selection\n[Recommended algorithms and approaches]\n\n### Training Strategy\n[Training methodology and validation]\n\n## Evaluation Metrics\n[How will model performance be measured?]\n\n## Deployment Strategy\n[How will the model be deployed and monitored?]', '550e8400-e29b-41d4-a716-446655440002', 634, 4.9, ARRAY['ai', 'machine-learning', 'specification', 'data-science'], NOW() - INTERVAL '2 months', NOW() - INTERVAL '5 days')
ON CONFLICT (id) DO NOTHING;

-- Update projects with correct document counts
UPDATE projects SET documents_count = (
  SELECT COUNT(*) FROM documents WHERE documents.project_id = projects.id
);
