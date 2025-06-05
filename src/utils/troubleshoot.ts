import { createClient } from '@supabase/supabase-js';
import toast from 'react-hot-toast';

interface SystemStatus {
  database: boolean;
  auth: boolean;
  api: boolean;
}

export const checkSystemStatus = async (): Promise<SystemStatus> => {
  const status: SystemStatus = {
    database: false,
    auth: false,
    api: false
  };

  try {
    // Check if Supabase environment variables are configured
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey);

      // Check database connection
      const { error: dbError } = await supabase
        .from('ratings')
        .select('id')
        .limit(1);
      
      status.database = !dbError;

      // Check authentication service
      const { error: authError } = await supabase.auth.getSession();
      status.auth = !authError;
    } else {
      // If Supabase is not configured, assume services are mocked
      status.database = true;
      status.auth = true;
    }

    // Check API endpoints
    try {
      const apiResponse = await fetch('https://api.themoviedb.org/3/movie/popular');
      status.api = apiResponse.ok;
    } catch {
      status.api = false;
    }

    return status;
  } catch (error) {
    console.error('System status check failed:', error);
    return status;
  }
};

export const validateRating = (rating: number): boolean => {
  return rating >= 1 && rating <= 5;
};

export const validateReview = (content: string): boolean => {
  return content.length >= 10 && content.length <= 1000;
};

export const logError = (
  component: string,
  error: Error,
  context?: Record<string, unknown>
) => {
  console.error(`[${component}] Error:`, {
    message: error.message,
    stack: error.stack,
    context
  });

  toast.error('An error occurred. Please try again.');
};

export const debugRatingSystem = async () => {
  const status = await checkSystemStatus();
  
  console.group('Rating System Debug Info');
  console.log('System Status:', status);
  console.log('Environment:', {
    nodeEnv: import.meta.env.MODE,
    supabaseUrl: import.meta.env.VITE_SUPABASE_URL ? '✓' : '✗',
    supabaseKey: import.meta.env.VITE_SUPABASE_ANON_KEY ? '✓' : '✗'
  });
  console.groupEnd();

  return status;
};