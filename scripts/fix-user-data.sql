-- Update existing projects to use the mock user ID
UPDATE projects 
SET owner_id = '550e8400-e29b-41d4-a716-446655440000'
WHERE owner_id = 'user-1' OR owner_id = 'user-2' OR owner_id = 'user-3';

-- Update chat messages to use the mock user ID
UPDATE chat_messages 
SET user_id = '550e8400-e29b-41d4-a716-446655440000'
WHERE user_id = 'user-1' OR user_id = 'user-2' OR user_id = 'user-3';

-- Update activity logs to use the mock user ID
UPDATE activity_logs 
SET user_id = '550e8400-e29b-41d4-a716-446655440000'
WHERE user_id = 'user-1' OR user_id = 'user-2' OR user_id = 'user-3';

-- Update documents to use the mock user ID
UPDATE documents 
SET created_by = '550e8400-e29b-41d4-a716-446655440000'
WHERE created_by = 'user-1' OR created_by = 'user-2' OR created_by = 'user-3';

-- Update project sources to use the mock user ID
UPDATE project_sources 
SET added_by = '550e8400-e29b-41d4-a716-446655440000'
WHERE added_by = 'user-1' OR added_by = 'user-2' OR added_by = 'user-3';

-- Ensure we have a user record with the mock user ID
INSERT INTO users (id, email, full_name, avatar_url, created_at, updated_at)
VALUES (
  '550e8400-e29b-41d4-a716-446655440000',
  'demo@provibe.com',
  'Demo User',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=demo',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  updated_at = NOW();
