-- Rename isassigned column to is_assigned for PostgreSQL best practices
ALTER TABLE public.tasks RENAME COLUMN isassigned TO is_assigned;

-- Update indexes to use new column name
DROP INDEX IF EXISTS public.idx_tasks_isAssigned;
DROP INDEX IF EXISTS public.idx_tasks_isAssigned_user;

CREATE INDEX idx_tasks_is_assigned ON public.tasks(is_assigned);
CREATE INDEX idx_tasks_is_assigned_user ON public.tasks(is_assigned, assigned_to) WHERE assigned_to IS NOT NULL;