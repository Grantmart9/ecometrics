interface EnvironmentConfig {
  apiUrl: string;
  isDevelopment: boolean;
  skipRealApiCalls: boolean;
  isStaticExport: boolean;
  appName: string;
  version: string;
}

export const environment: EnvironmentConfig = {
  // Determine API URL based on environment
  apiUrl:
    process.env.NODE_ENV === "production"
      ? process.env.NEXT_PUBLIC_API_URL || "/api"
      : "http://localhost:3003/api",
  isDevelopment: process.env.NODE_ENV === "development",
  skipRealApiCalls: true, // Skip real API calls for development to avoid 404s
  isStaticExport: false, // Will be set dynamically by CRUD service
  appName: "EcoMetrics",
  version: "1.0.0",
};

export default environment;
