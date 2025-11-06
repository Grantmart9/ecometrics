interface EnvironmentConfig {
  apiUrl: string;
  isDevelopment: boolean;
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
  appName: "EcoMetrics",
  version: "1.0.0",
};

export default environment;
