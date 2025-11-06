interface EnvironmentConfig {
  apiUrl: string;
  isDevelopment: boolean;
  appName: string;
  version: string;
}

export const environment: EnvironmentConfig = {
  // Use the CRUD API from the reference app
  apiUrl: "http://localhost:3003/api",
  isDevelopment: process.env.NODE_ENV === "development",
  appName: "EcoMetrics",
  version: "1.0.0",
};

export default environment;
