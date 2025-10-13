-- Part 1: Replace status column with isAssigned boolean
ALTER TABLE public.tasks 
  DROP COLUMN IF EXISTS status;

DROP TYPE IF EXISTS task_status;

ALTER TABLE public.tasks
  ADD COLUMN isAssigned BOOLEAN NOT NULL DEFAULT false;

-- Update indexes
DROP INDEX IF EXISTS idx_tasks_status;
DROP INDEX IF EXISTS idx_tasks_status_assigned;

CREATE INDEX idx_tasks_isAssigned ON public.tasks(isAssigned);
CREATE INDEX idx_tasks_isAssigned_user ON public.tasks(isAssigned, assigned_to);

-- Part 2: Create case_status enum and add new columns
CREATE TYPE case_status AS ENUM ('New', 'In Progress', 'Closed');

ALTER TABLE public.tasks
  ADD COLUMN application_id UUID REFERENCES public.applications(id) ON DELETE SET NULL,
  ADD COLUMN case_status case_status DEFAULT 'New' NOT NULL,
  ADD COLUMN subject TEXT,
  ADD COLUMN case_origin TEXT,
  ADD COLUMN description TEXT,
  ADD COLUMN type TEXT,
  ADD COLUMN sub_type TEXT,
  ADD COLUMN case_reason TEXT,
  ADD COLUMN sub_reason TEXT,
  ADD COLUMN additional_reasons TEXT[],
  ADD COLUMN trade_in_id TEXT;

-- Create indexes for new columns
CREATE INDEX idx_tasks_application_id ON public.tasks(application_id);
CREATE INDEX idx_tasks_case_status ON public.tasks(case_status);
CREATE INDEX idx_tasks_type ON public.tasks(type);
CREATE INDEX idx_tasks_trade_in_id ON public.tasks(trade_in_id);