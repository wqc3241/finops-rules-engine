-- Add task_number column and auto-generation function
ALTER TABLE public.tasks ADD COLUMN task_number TEXT;

-- Create function to generate unique 8-digit task numbers
CREATE OR REPLACE FUNCTION generate_task_number()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  next_number INTEGER;
  task_number_str TEXT;
BEGIN
  -- Get the highest existing task number and increment
  SELECT COALESCE(MAX(CAST(task_number AS INTEGER)), 9999999) + 1
  INTO next_number
  FROM tasks
  WHERE task_number ~ '^[0-9]{8}$';
  
  -- Format as 8-digit string with leading zeros
  task_number_str := LPAD(next_number::TEXT, 8, '0');
  
  RETURN task_number_str;
END;
$$;

-- Set default and add unique constraint
ALTER TABLE public.tasks 
  ALTER COLUMN task_number SET DEFAULT generate_task_number(),
  ADD CONSTRAINT tasks_task_number_key UNIQUE (task_number);

-- Create index for performance
CREATE INDEX idx_tasks_task_number ON public.tasks(task_number);

-- Backfill existing records with unique task numbers
DO $$
DECLARE
  task_record RECORD;
  counter INTEGER := 10000000;
BEGIN
  FOR task_record IN SELECT id FROM tasks WHERE task_number IS NULL ORDER BY created_at
  LOOP
    UPDATE tasks SET task_number = LPAD(counter::TEXT, 8, '0') WHERE id = task_record.id;
    counter := counter + 1;
  END LOOP;
END $$;

-- Make column NOT NULL after backfill
ALTER TABLE public.tasks ALTER COLUMN task_number SET NOT NULL;