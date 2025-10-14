-- Step 1: Alter the column type from text to uuid
ALTER TABLE tasks 
ALTER COLUMN trade_in_id TYPE uuid USING trade_in_id::uuid;

-- Step 2: Add foreign key constraint
ALTER TABLE tasks
ADD CONSTRAINT tasks_trade_in_id_fkey 
FOREIGN KEY (trade_in_id) 
REFERENCES trade_ins(id) 
ON DELETE SET NULL;

-- Step 3: Randomly link 10 tasks to trade-ins
UPDATE tasks 
SET trade_in_id = (
  SELECT id 
  FROM trade_ins 
  ORDER BY RANDOM() 
  LIMIT 1
)
WHERE task_number IN (
  SELECT task_number 
  FROM tasks 
  WHERE trade_in_id IS NULL 
  ORDER BY RANDOM() 
  LIMIT 10
);