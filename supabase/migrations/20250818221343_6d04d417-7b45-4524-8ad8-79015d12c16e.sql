-- Clean up orphaned change request that has no change details
-- This request is causing the banner to persist despite being effectively empty
UPDATE public.change_requests 
SET 
  status = 'APPROVED',
  reviewed_at = NOW()
WHERE 
  id = 'c409a607-6f2a-4f15-8362-d3acb264b02c'
  AND status = 'IN_REVIEW'
  AND NOT EXISTS (
    SELECT 1 FROM public.change_details 
    WHERE request_id = 'c409a607-6f2a-4f15-8362-d3acb264b02c'
  );