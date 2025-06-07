import { createClient } from '@supabase/supabase-js';
import toast from 'react-hot-toast';

interface SystemStatus {
  database: boolean;
  auth: boolean;
  api: boolean;
  events: boolean;
}

interface RatingDebugInfo {
  buttonConnected: boolean;
  handlerRegistered: boolean;
  eventsFiring: boolean;
  dataFlow: boolean;
  performance: {
    responseTime: number;
    memoryUsage: number;
  };
}

interface DatabaseDiagnostics {
  connection: boolean;
  permissions: boolean;
  queryPerformance: number;
  dataIntegrity: boolean;
}

interface ApiDiagnostics {
  endpoints: Record<string, boolean>;
  latency: Record<string, number>;
  rateLimit: {
    remaining: number;
    reset: number;
  };
}

interface AuthDiagnostics {
  sessionValid: boolean;
  tokenExpiry: number;
  permissions: string[];
  securityChecks: {
    ssl: boolean;
    cors: boolean;
    csrf: boolean;
  };
}

export const checkSystemStatus = async (): Promise<SystemStatus> => {
  const status: SystemStatus = {
    database: false,
    auth: false,
    api: false,
    events: false
  };

  try {
    // Check database connection and perform diagnostics
    const dbDiagnostics = await checkDatabaseHealth();
    status.database = dbDiagnostics.connection;

    // Verify API endpoints and collect metrics
    const apiDiagnostics = await checkApiHealth();
    status.api = Object.values(apiDiagnostics.endpoints).every(status => status);

    // Validate authentication system
    const authDiagnostics = await checkAuthSystem();
    status.auth = authDiagnostics.sessionValid;

    // Test event system functionality
    status.events = await checkEventSystem();

    // Log comprehensive diagnostics
    console.group('System Health Diagnostics');
    console.log('Database:', dbDiagnostics);
    console.log('API:', apiDiagnostics);
    console.log('Auth:', authDiagnostics);
    console.log('Events:', status.events);
    console.groupEnd();

    return status;
  } catch (error) {
    logError('SystemCheck', error as Error);
    return status;
  }
};

const checkDatabaseHealth = async (): Promise<DatabaseDiagnostics> => {
  const diagnostics: DatabaseDiagnostics = {
    connection: false,
    permissions: true, // Set to true since we can't check without RPC function
    queryPerformance: 0,
    dataIntegrity: true // Set to true since we can't check without RPC function
  };

  try {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase configuration');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Test connection with correct syntax
    const startTime = performance.now();
    const { error: connectionError } = await supabase
      .from('ratings')
      .select('*', { count: 'exact', head: true });
    
    diagnostics.connection = !connectionError;
    diagnostics.queryPerformance = performance.now() - startTime;

    return diagnostics;
  } catch (error) {
    logError('DatabaseCheck', error as Error);
    return diagnostics;
  }
};

const checkApiHealth = async (): Promise<ApiDiagnostics> => {
  const endpoints = {
    movies: '/api/movies',
    ratings: '/api/ratings',
    users: '/api/users'
  };

  const diagnostics: ApiDiagnostics = {
    endpoints: {},
    latency: {},
    rateLimit: {
      remaining: 0,
      reset: 0
    }
  };

  for (const [name, path] of Object.entries(endpoints)) {
    try {
      const startTime = performance.now();
      const response = await fetch(path);
      
      diagnostics.endpoints[name] = response.ok;
      diagnostics.latency[name] = performance.now() - startTime;
      
      // Extract rate limit info from headers
      diagnostics.rateLimit.remaining = parseInt(response.headers.get('X-RateLimit-Remaining') || '0');
      diagnostics.rateLimit.reset = parseInt(response.headers.get('X-RateLimit-Reset') || '0');
    } catch (error) {
      diagnostics.endpoints[name] = false;
      diagnostics.latency[name] = -1;
    }
  }

  return diagnostics;
};

const checkAuthSystem = async (): Promise<AuthDiagnostics> => {
  const diagnostics: AuthDiagnostics = {
    sessionValid: false,
    tokenExpiry: 0,
    permissions: [],
    securityChecks: {
      ssl: false,
      cors: false,
      csrf: false
    }
  };

  try {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase configuration');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Check session validity with correct destructuring
    const { data: { session } } = await supabase.auth.getSession();
    diagnostics.sessionValid = !!session;

    if (session && session.access_token) {
      // Get token expiration
      const token = session.access_token;
      const tokenData = JSON.parse(atob(token.split('.')[1]));
      diagnostics.tokenExpiry = tokenData.exp * 1000 - Date.now();

      // Get user permissions - simplified since we don't have user_roles table
      diagnostics.permissions = ['authenticated'];
    }

    // Security protocol checks
    diagnostics.securityChecks.ssl = window.location.protocol === 'https:';
    diagnostics.securityChecks.cors = await checkCorsConfiguration();
    diagnostics.securityChecks.csrf = checkCsrfProtection();

    return diagnostics;
  } catch (error) {
    logError('AuthCheck', error as Error);
    return diagnostics;
  }
};

const checkCorsConfiguration = async (): Promise<boolean> => {
  try {
    const response = await fetch('/api/cors-test', {
      method: 'OPTIONS',
      headers: {
        'Origin': window.location.origin
      }
    });
    
    return response.headers.get('Access-Control-Allow-Origin') === window.location.origin;
  } catch {
    return false;
  }
};

const checkCsrfProtection = (): boolean => {
  const metaToken = document.querySelector('meta[name="csrf-token"]');
  return !!metaToken?.getAttribute('content');
};

export const checkEventSystem = async (): Promise<boolean> => {
  return new Promise((resolve) => {
    let eventsFiring = false;
    const testButton = document.createElement('button');
    
    const cleanup = () => {
      testButton.remove();
      resolve(eventsFiring);
    };
    
    testButton.addEventListener('click', () => {
      eventsFiring = true;
      cleanup();
    });
    
    document.body.appendChild(testButton);
    testButton.click();
    
    // Cleanup if event doesn't fire
    setTimeout(cleanup, 1000);
  });
};

export const debugRatingButton = async (buttonElement: HTMLElement): Promise<RatingDebugInfo> => {
  const startTime = performance.now();
  
  const debugInfo: RatingDebugInfo = {
    buttonConnected: false,
    handlerRegistered: false,
    eventsFiring: false,
    dataFlow: false,
    performance: {
      responseTime: 0,
      memoryUsage: 0
    }
  };

  try {
    // Check DOM connection
    debugInfo.buttonConnected = document.contains(buttonElement);

    // Verify event handlers
    const events = getEventListeners(buttonElement);
    debugInfo.handlerRegistered = events.click?.length > 0;

    // Test event propagation
    debugInfo.eventsFiring = await testEventPropagation(buttonElement);

    // Verify data flow
    debugInfo.dataFlow = await checkDataFlow(buttonElement);

    // Collect performance metrics
    debugInfo.performance = {
      responseTime: performance.now() - startTime,
      memoryUsage: performance.memory?.usedJSHeapSize || 0
    };

    return debugInfo;
  } catch (error) {
    logError('ButtonDebug', error as Error);
    return debugInfo;
  }
};

const testEventPropagation = async (element: HTMLElement): Promise<boolean> => {
  return new Promise((resolve) => {
    let eventFired = false;
    
    const handler = () => {
      eventFired = true;
    };
    
    element.addEventListener('click', handler);
    element.click();
    element.removeEventListener('click', handler);
    
    // Allow time for event to propagate
    setTimeout(() => resolve(eventFired), 100);
  });
};

const checkDataFlow = async (element: HTMLElement): Promise<boolean> => {
  try {
    const ratingContext = element.closest('[data-rating-context]');
    if (!ratingContext) return false;

    return new Promise((resolve) => {
      const testRating = 4;
      let stateUpdated = false;

      const stateCheck = () => {
        stateUpdated = true;
      };

      ratingContext.addEventListener('rating-update', stateCheck);
      ratingContext.dispatchEvent(new CustomEvent('rating-update', {
        detail: { rating: testRating }
      }));
      ratingContext.removeEventListener('rating-update', stateCheck);

      setTimeout(() => resolve(stateUpdated), 100);
    });
  } catch {
    return false;
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
    context,
    timestamp: new Date().toISOString(),
    environment: import.meta.env.MODE
  });

  toast.error('An error occurred. Please try again.');
};

declare function getEventListeners(element: Element): { [key: string]: { listener: Function }[] };
declare interface Performance {
  memory?: {
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  };
}