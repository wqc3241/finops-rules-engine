import { toast } from 'sonner';

export class ApiError extends Error {
  constructor(
    message: string,
    public code: string,
    public retryable: boolean = false
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function retryOperation<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 1000
): Promise<T> {
  let lastError: Error;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt < maxRetries) {
        console.log(`Retry attempt ${attempt}/${maxRetries}...`);
        await new Promise(resolve => setTimeout(resolve, delayMs * attempt));
      }
    }
  }

  throw lastError!;
}

export function handleSupabaseError(error: any, context: string): void {
  console.error(`${context} error:`, error);

  if (error.code === 'PGRST116') {
    toast.error('No data found');
  } else if (error.code === '23505') {
    toast.error('Duplicate entry detected');
  } else if (error.message?.includes('JWT')) {
    toast.error('Session expired. Please log in again.');
  } else if (error.message?.includes('network')) {
    toast.error('Network error. Please check your connection.');
  } else {
    toast.error(`${context} failed. Please try again.`);
  }
}
