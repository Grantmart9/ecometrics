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
      : process.env.NEXT_PUBLIC_API_URL || "https://wecare.temo.co.za/api",
  isDevelopment: process.env.NODE_ENV === "development",
  skipRealApiCalls: false, // Always use real API calls
  isStaticExport: false, // Will be set dynamically by CRUD service
  appName: "EcoMetrics",
  version: "1.0.0",
};

export default environment;
