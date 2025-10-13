-- Add sample closed tasks for testing

-- Update 3 random tasks to closed status with assignment
UPDATE tasks 
SET 
  case_status = 'Closed',
  completed_at = NOW() - INTERVAL '2 days',
  is_assigned = true,
  assigned_to = (SELECT user_id FROM user_profiles LIMIT 1)
WHERE id IN (
  SELECT id FROM tasks 
  ORDER BY RANDOM() 
  LIMIT 3
);

-- Update 2 more random tasks to closed status without assignment
UPDATE tasks 
SET 
  case_status = 'Closed',
  completed_at = NOW() - INTERVAL '5 days'
WHERE id IN (
  SELECT id FROM tasks 
  WHERE case_status = 'New'
  ORDER BY RANDOM() 
  LIMIT 2
);