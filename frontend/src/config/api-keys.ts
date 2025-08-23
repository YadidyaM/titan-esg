// API Configuration
// Store your API keys and endpoints here

export const API_KEYS = {
  // EPC (Energy Performance Certificate) API Key
  EPC_KEY: '32c3c4979f4bf02ea00be456a3b840ec272dca44',
  
  // Property Data API Key
  PROPERTY_DATA_API_KEY: 'RPEMJFQNOR',
  
  // Land Property API Key (if needed)
  USE_LAND_PROPERTY_API_KEY: 'a84446ee-20b8-49e2-b618-d7a67075897'
};

export const API_ENDPOINTS = {
  // EPC API Base URL - Public API, no authentication required
  EPC_BASE_URL: 'https://epc.opendatacommunities.org/api/v1',
  
  // Property Data API Base URL
  PROPERTY_DATA_BASE_URL: 'https://api.propertydata.co.uk/v1'
};

// Environment-based configuration
export const getApiConfig = () => {
  if (process.env.NODE_ENV === 'production') {
    return {
      // Production API keys (should be set via environment variables)
      EPC_KEY: process.env.EPC_KEY || API_KEYS.EPC_KEY,
      PROPERTY_DATA_API_KEY: process.env.PROPERTY_DATA_API_KEY || API_KEYS.PROPERTY_DATA_API_KEY,
      USE_LAND_PROPERTY_API_KEY: process.env.USE_LAND_PROPERTY_API_KEY || API_KEYS.USE_LAND_PROPERTY_API_KEY
    };
  }
  
  // Development/fallback keys
  return API_KEYS;
};

// API Rate limiting and configuration
export const API_CONFIG = {
  // Rate limiting
  RATE_LIMIT: {
    EPC: { requests: 100, window: 60000 }, // 100 requests per minute
    PROPERTY_DATA: { requests: 50, window: 60000 } // 50 requests per minute
  },
  
  // Timeout settings
  TIMEOUT: {
    EPC: 10000, // 10 seconds
    PROPERTY_DATA: 10000 // 10 seconds
  },
  
  // Retry settings
  RETRY: {
    attempts: 3,
    delay: 1000 // 1 second
  }
};
