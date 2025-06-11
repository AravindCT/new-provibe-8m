-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS activity_logs CASCADE;
DROP TABLE IF EXISTS chat_messages CASCADE;
DROP TABLE IF EXISTS project_sources CASCADE;
DROP TABLE IF EXISTS documents CASCADE;
DROP TABLE IF EXISTS templates CASCADE;
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

-- Create documents table
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'prd' CHECK (type IN ('prd', 'spec', 'user-story', 'api-doc', 'design-doc', 'test-plan', 'other')),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'approved', 'archived')),
  author_id UUID REFERENCES users(id) ON DELETE CASCADE,
  template_id UUID REFERENCES templates(id),
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

-- Insert target audience users with PROPER UUIDs
INSERT INTO users (id, email, full_name, avatar_url, plan, company, role) VALUES 
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'sarah.chen@techcorp.com', 'Sarah Chen', 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150', 'pro', 'TechCorp Inc.', 'Senior Product Manager'),
  ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'mike.rodriguez@startup.io', 'Mike Rodriguez', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', 'enterprise', 'InnovateLab', 'Founder & CEO'),
  ('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'alex.kim@devstudio.com', 'Alex Kim', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', 'pro', 'DevStudio', 'Lead Developer'),
  ('d3eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'emma.wilson@fintech.co', 'Emma Wilson', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150', 'enterprise', 'FinTech Solutions', 'Head of Product'),
  ('e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', 'david.park@healthtech.ai', 'David Park', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150', 'pro', 'HealthTech AI', 'CTO'),
  ('f5eebc99-9c0b-4ef8-bb6d-6bb9bd380a16', 'lisa.zhang@ecommerce.plus', 'Lisa Zhang', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150', 'free', 'E-commerce Plus', 'Product Owner')
ON CONFLICT (email) DO NOTHING;

-- Insert document templates first
INSERT INTO templates (id, name, description, category, content, author_id, usage_count, rating, tags, created_at, updated_at) VALUES 
  ('t1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'SaaS Product Requirements Document', 'Comprehensive PRD template specifically designed for SaaS products with sections for market analysis, user personas, feature specifications, and success metrics', 'prd', '# Product Requirements Document

## Executive Summary

### Product Vision
[Define the product vision and mission]

### Target Market
[Describe target audience and market size]

## Market Analysis

### Market Size and Opportunity
[TAM, SAM, SOM analysis]

### Competitive Landscape
[Competitor analysis and differentiation]

## User Personas

### Primary Persona
[Detailed user persona with pain points]

## Feature Specifications

### Core Features
[Detailed feature requirements]

### Success Metrics
[KPIs and measurement criteria]', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 1247, 4.8, ARRAY['saas', 'prd', 'product-management', 'requirements'], NOW() - INTERVAL '6 months', NOW() - INTERVAL '1 week'),
  ('t2eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'Mobile App Technical Specification', 'Technical architecture template for mobile applications including platform considerations, API design, security requirements, and performance specifications', 'spec', '# Mobile App Technical Specification

## Architecture Overview

### Platform Strategy
[iOS, Android, or Cross-platform approach]

### Technology Stack
[Frontend, Backend, Database, APIs]

## System Architecture

### Client-Server Architecture
[Communication protocols and data flow]

### Security Requirements
[Authentication, encryption, data protection]

## API Specifications

### Endpoint Documentation
[RESTful API design and documentation]

## Performance Requirements
[Load times, scalability, offline capabilities]', 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 892, 4.7, ARRAY['mobile', 'technical', 'architecture', 'specification'], NOW() - INTERVAL '4 months', NOW() - INTERVAL '3 days'),
  ('t3eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'Startup Business Model Canvas', 'Business model template tailored for startups including value propositions, customer segments, revenue streams, and key partnerships', 'business', '# Business Model Canvas

## Value Propositions
[What value do you deliver to customers?]

## Customer Segments
[Who are your most important customers?]

## Customer Relationships
[What type of relationship do you establish?]

## Channels
[How do you reach your customers?]

## Revenue Streams
[How do you make money?]

## Key Resources
[What key resources do you need?]

## Key Activities
[What key activities do you perform?]

## Key Partnerships
[Who are your key partners?]

## Cost Structure
[What are the most important costs?]', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 756, 4.6, ARRAY['startup', 'business-model', 'strategy', 'canvas'], NOW() - INTERVAL '3 months', NOW() - INTERVAL '1 week'),
  ('t4eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'AI/ML Project Specification', 'Comprehensive template for AI and machine learning projects including data requirements, model specifications, and evaluation metrics', 'spec', '# AI/ML Project Specification

## Problem Definition
[Clear definition of the ML problem to solve]

## Data Requirements

### Data Sources
[Where will training data come from?]

### Data Quality
[Data cleaning and preprocessing requirements]

## Model Specifications

### Algorithm Selection
[Recommended algorithms and approaches]

### Training Strategy
[Training methodology and validation]

## Evaluation Metrics
[How will model performance be measured?]

## Deployment Strategy
[How will the model be deployed and monitored?]', 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 634, 4.9, ARRAY['ai', 'machine-learning', 'specification', 'data-science'], NOW() - INTERVAL '2 months', NOW() - INTERVAL '5 days')
ON CONFLICT (id) DO NOTHING;

-- Insert realistic projects for target audience with PROPER UUIDs
INSERT INTO projects (id, name, description, type, status, progress, owner_id, starred, tags, collaborators, documents_count, target_audience, market_size, business_model, key_features, tech_stack, timeline, budget_range, last_updated, created_at, updated_at) VALUES 
  (
    'p1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 
    'TaskFlow Pro - AI Project Management', 
    'Next-generation project management platform with AI-powered insights, automated workflows, and intelligent resource allocation for enterprise teams',
    'saas', 
    'active', 
    75, 
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 
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
    'p2eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 
    'FinanceAI - Personal Wealth Assistant', 
    'AI-driven personal finance app that provides intelligent investment recommendations, automated budgeting, and financial goal tracking',
    'mobile', 
    'active', 
    60, 
    'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 
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
    'p3eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 
    'MedConnect - Telemedicine Platform', 
    'Comprehensive telemedicine platform connecting patients with healthcare providers, featuring AI symptom checker and integrated health records',
    'saas', 
    'active', 
    45, 
    'e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', 
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
    'p4eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 
    'EduTech Learning Hub', 
    'Adaptive learning platform for K-12 education with AI-powered personalized curriculum and real-time progress tracking for students and teachers',
    'saas', 
    'draft', 
    25, 
    'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 
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
    'p5eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', 
    'RetailOptimize - E-commerce Analytics', 
    'Advanced e-commerce analytics platform with AI-powered demand forecasting, inventory optimization, and customer behavior insights',
    'saas', 
    'active', 
    80, 
    'f5eebc99-9c0b-4ef8-bb6d-6bb9bd380a16', 
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
    'p6eebc99-9c0b-4ef8-bb6d-6bb9bd380a16', 
    'CryptoVault - DeFi Portfolio Manager', 
    'Decentralized finance portfolio management tool with automated yield farming, risk assessment, and cross-chain asset tracking',
    'mobile', 
    'draft', 
    15, 
    'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 
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
    'p7eebc99-9c0b-4ef8-bb6d-6bb9bd380a17', 
    'GreenTech Carbon Tracker', 
    'Enterprise carbon footprint tracking and ESG reporting platform with AI-powered sustainability recommendations',
    'saas', 
    'active', 
    55, 
    'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 
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
    'p8eebc99-9c0b-4ef8-bb6d-6bb9bd380a18', 
    'FoodieAI - Restaurant Discovery', 
    'AI-powered restaurant recommendation app with personalized taste profiles, social features, and integrated reservation system',
    'mobile', 
    'complete', 
    100, 
    'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 
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
INSERT INTO documents (id, project_id, title, content, type, status, author_id, template_id, ai_generated, created_at, updated_at) VALUES 
  ('d1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'p1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'TaskFlow Pro - Product Requirements Document', 'Comprehensive PRD for TaskFlow Pro including market analysis, user personas, feature specifications, and success metrics...', 'prd', 'approved', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 't1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', true, NOW() - INTERVAL '2 weeks', NOW() - INTERVAL '1 week'),
  ('d2eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'p1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'AI Integration Technical Specification', 'Technical architecture for AI-powered features including machine learning models, data pipelines, and API integrations...', 'spec', 'review', 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 't4eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', true, NOW() - INTERVAL '1 week', NOW() - INTERVAL '2 days'),
  ('d3eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'p2eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'FinanceAI User Stories', 'Complete user stories for personal finance app covering investment recommendations, budgeting, and goal tracking...', 'user-story', 'approved', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', NULL, false, NOW() - INTERVAL '3 days', NOW() - INTERVAL '1 day'),
  ('d4eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'p3eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'HIPAA Compliance Documentation', 'Healthcare compliance requirements and implementation guidelines for telemedicine platform...', 'spec', 'approved', 'e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', NULL, false, NOW() - INTERVAL '1 month', NOW() - INTERVAL '2 weeks'),
  ('d5eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', 'p4eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'Adaptive Learning Algorithm Design', 'Design document for AI-powered adaptive learning system including personalization algorithms...', 'design-doc', 'draft', 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 't4eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', true, NOW() - INTERVAL '5 days', NOW() - INTERVAL '1 day')
ON CONFLICT (id) DO NOTHING;

-- Insert realistic chat messages showing AI assistance
INSERT INTO chat_messages (id, project_id, user_id, content, role, created_at) VALUES 
  ('m1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'p1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'I need help defining the AI features for TaskFlow Pro. What machine learning capabilities should we prioritize for project management?', 'user', NOW() - INTERVAL '3 hours'),
  ('m2eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'p1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', NULL, 'For TaskFlow Pro, I recommend prioritizing these AI capabilities: 1) Intelligent task prioritization using historical data and deadlines, 2) Resource allocation optimization, 3) Risk prediction for project delays, 4) Automated time estimation based on similar tasks. Would you like me to create a detailed technical specification for any of these features?', 'assistant', NOW() - INTERVAL '3 hours'),
  ('m3eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'p2eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'Can you help me create user personas for FinanceAI? I want to target millennials who are new to investing.', 'user', NOW() - INTERVAL '1 day'),
  ('m4eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'p2eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', NULL, 'I will create detailed user personas for FinanceAI targeting millennials. Based on market research, here are three primary personas: 1) "Investment Newbie" - 25-30, $60K income, wants simple guidance, 2) "Growth Seeker" - 30-35, $80K income, seeks optimization, 3) "Goal-Oriented Saver" - 28-33, $70K income, focused on specific financial goals. Should I develop full persona profiles with pain points and motivations?', 'assistant', NOW() - INTERVAL '1 day'),
  ('m5eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', 'p3eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', 'What are the key HIPAA requirements I need to consider for the telemedicine platform?', 'user', NOW() - INTERVAL '2 days'),
  ('m6eebc99-9c0b-4ef8-bb6d-6bb9bd380a16', 'p3eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', NULL, 'For HIPAA compliance in your telemedicine platform, focus on these key requirements: 1) End-to-end encryption for all communications, 2) Access controls and user authentication, 3) Audit logs for all PHI access, 4) Business Associate Agreements with third-party services, 5) Data backup and recovery procedures. I can help you create a comprehensive HIPAA compliance checklist and implementation plan.', 'assistant', NOW() - INTERVAL '2 days')
ON CONFLICT (id) DO NOTHING;

-- Insert project sources
INSERT INTO project_sources (id, project_id, name, type, url, status, last_sync, created_at, updated_at) VALUES 
  ('s1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'p1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'TaskFlow Repository', 'github', 'https://github.com/techcorp/taskflow-pro', 'connected', NOW() - INTERVAL '2 hours', NOW() - INTERVAL '2 weeks', NOW() - INTERVAL '2 hours'),
  ('s2eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'p1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Design System', 'figma', 'https://figma.com/design/taskflow-design-system', 'connected', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 week', NOW() - INTERVAL '1 day'),
  ('s3eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'p2eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'FinanceAI Backend', 'github', 'https://github.com/innovatelab/financeai-api', 'processing', NULL, NOW() - INTERVAL '3 days', NOW() - INTERVAL '1 hour'),
  ('s4eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'p3eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'Medical Compliance Docs', 'confluence', 'https://healthtech.atlassian.net/wiki/compliance', 'connected', NOW() - INTERVAL '1 week', NOW() - INTERVAL '1 month', NOW() - INTERVAL '1 week')
ON CONFLICT (id) DO NOTHING;

-- Insert activity logs
INSERT INTO activity_logs (id, user_id, project_id, action, description, created_at) VALUES 
  ('a1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'p1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'document_generated', 'Generated AI-powered PRD for TaskFlow Pro', NOW() - INTERVAL '2 weeks'),
  ('a2eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'p2eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'project_created', 'Created FinanceAI project with target audience analysis', NOW() - INTERVAL '2 months'),
  ('a3eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', 'p3eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'compliance_review', 'Completed HIPAA compliance review for MedConnect', NOW() - INTERVAL '2 weeks'),
  ('a4eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'p8eebc99-9c0b-4ef8-bb6d-6bb9bd380a18', 'project_completed', 'Successfully launched FoodieAI to app stores', NOW() - INTERVAL '1 month'),
  ('a5eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', 'f5eebc99-9c0b-4ef8-bb6d-6bb9bd380a16', 'p5eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', 'analytics_integration', 'Connected Shopify analytics for RetailOptimize', NOW() - INTERVAL '5 hours')
ON CONFLICT (id) DO NOTHING;

-- Update projects with correct document counts
UPDATE projects SET documents_count = (
  SELECT COUNT(*) FROM documents WHERE documents.project_id = projects.id
);
