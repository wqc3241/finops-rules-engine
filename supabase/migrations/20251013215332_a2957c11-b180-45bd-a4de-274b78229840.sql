-- Create task status enum
CREATE TYPE task_status AS ENUM ('unassigned', 'assigned', 'completed');

-- Create task priority enum  
CREATE TYPE task_priority AS ENUM ('P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7');

-- Create task category enum
CREATE TYPE task_category AS ENUM (
  'pending_application',
  'contract_redraft', 
  'ofac_review',
  'credit_notice',
  'review_copy'
);

-- Create tasks table
CREATE TABLE public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT NOT NULL,
  priority task_priority NOT NULL,
  delivery_date DATE NOT NULL,
  status task_status NOT NULL DEFAULT 'unassigned',
  category task_category NOT NULL,
  assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  assigned_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT tasks_order_number_key UNIQUE (order_number)
);

-- Create indexes for performance
CREATE INDEX idx_tasks_status ON public.tasks(status);
CREATE INDEX idx_tasks_assigned_to ON public.tasks(assigned_to);
CREATE INDEX idx_tasks_delivery_date ON public.tasks(delivery_date);
CREATE INDEX idx_tasks_category ON public.tasks(category);
CREATE INDEX idx_tasks_status_assigned ON public.tasks(status, assigned_to);

-- Enable RLS
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "FS_OPS can view all tasks"
  ON public.tasks FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_id = auth.uid()
      AND role IN ('FS_OPS', 'FS_ADMIN', 'admin')
    )
  );

CREATE POLICY "FS_OPS can create tasks"
  ON public.tasks FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_id = auth.uid()
      AND role IN ('FS_OPS', 'FS_ADMIN', 'admin')
    )
  );

CREATE POLICY "FS_OPS can update tasks"
  ON public.tasks FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_id = auth.uid()
      AND role IN ('FS_OPS', 'FS_ADMIN', 'admin')
    )
  );

CREATE POLICY "FS_ADMIN can delete tasks"
  ON public.tasks FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_id = auth.uid()
      AND role IN ('FS_ADMIN', 'admin')
    )
  );

-- Create trigger for updated_at
CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON public.tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Seed initial mock data
INSERT INTO public.tasks (order_number, priority, delivery_date, status, category) VALUES
  ('ORD-2024-001', 'P1', '2025-01-15', 'unassigned', 'pending_application'),
  ('ORD-2024-002', 'P3', '2025-01-16', 'unassigned', 'contract_redraft'),
  ('ORD-2024-003', 'P2', '2025-01-17', 'unassigned', 'ofac_review'),
  ('ORD-2024-004', 'P5', '2025-01-18', 'unassigned', 'credit_notice'),
  ('ORD-2024-005', 'P1', '2025-01-19', 'unassigned', 'review_copy'),
  ('ORD-2024-006', 'P2', '2025-01-15', 'unassigned', 'pending_application'),
  ('ORD-2024-007', 'P4', '2025-01-16', 'unassigned', 'ofac_review'),
  ('ORD-2024-008', 'P1', '2025-01-17', 'unassigned', 'contract_redraft'),
  ('ORD-2024-009', 'P3', '2025-01-18', 'assigned', 'review_copy'),
  ('ORD-2024-010', 'P2', '2025-01-19', 'assigned', 'pending_application'),
  ('ORD-2024-011', 'P5', '2025-01-15', 'assigned', 'credit_notice'),
  ('ORD-2024-012', 'P1', '2025-01-16', 'completed', 'contract_redraft'),
  ('ORD-2024-013', 'P3', '2025-01-14', 'completed', 'ofac_review'),
  ('ORD-2024-014', 'P2', '2025-01-13', 'completed', 'pending_application');