import { CrudRequest } from "@/types/database";
import { environment } from "./environment";

class CrudService {
  private baseUrl: string;
  private authToken: string | null = null;
  private crudEndpoint = "/crud/crud";
  private isStaticExport: boolean;

  constructor() {
    this.baseUrl = environment.apiUrl;
    this.isStaticExport = this.detectStaticExport();
  }

  private detectStaticExport(): boolean {
    // Detect if we're in static export mode
    return (
      typeof window !== "undefined" &&
      (window.location.pathname.includes("/out/") ||
        document.querySelector('meta[name="next-export"]') !== null)
    );
  }

  private async makeRequest<T>(
    endpoint: string,
    data: any,
    operation: string = "create",
    requestIdParam?: string
  ): Promise<T> {
    // Use localStorage for static export environment
    if (this.isStaticExport) {
      return this.handleLocalStorageRequest<T>(endpoint, data, operation);
    }

    // Skip real API calls in development to avoid 404s
    if (environment.skipRealApiCalls && environment.isDevelopment) {
      console.log("Using mock data for:", endpoint, "operation:", operation);
      return this.getMockResponse(endpoint, data, operation) as T;
    }

    const requestId = requestIdParam || this.generateRequestId();
    const request: CrudRequest = {
      resource: endpoint,
      operation: operation,
      data,
      requestId,
    };

    try {
      const response = await fetch(this.baseUrl + this.crudEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(this.authToken && { Authorization: `Bearer ${this.authToken}` }),
        },
        body: JSON.stringify(request),
      });

      // Handle unauthorized - try to refresh token
      if (response.status === 401 && this.authToken) {
        await this.handleUnauthorized();
        // Retry the request with new token
        return this.makeRequest(endpoint, data, operation, requestId);
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      // Handle different response formats
      if (result && result.result) {
        return result.result;
      }

      if (Array.isArray(result)) {
        return result[0]?.Data || result;
      }

      if (result && result.Data) {
        return result.Data;
      }

      return result;
    } catch (error) {
      // Mock response for development
      if (environment.isDevelopment) {
        console.warn("CRUD API call failed, returning mock data:", error);
        return this.getMockResponse(endpoint, data, operation) as T;
      }
      throw error;
    }
  }

  // Mock responses for development environment
  private getMockResponse(endpoint: string, data: any, operation: string): any {
    // Handle emissions-input specific mock data
    if (endpoint === "emissions-input") {
      return this.getEmissionsInputMockResponse(data, operation);
    }

    // Handle other endpoint mock responses
    return this.getGenericMockResponse(endpoint, data, operation);
  }

  private getEmissionsInputMockResponse(data: any, operation: string): any {
    const mockData = [
      {
        id: "1",
        userId: "1",
        companyId: "1",
        activityType: data.activityType || "Stationary Fuels",
        costCentre: data.costCentre || "FIN",
        startDate: data.startDate || "2025-05-01",
        endDate: data.endDate || "2025-05-31",
        consumptionType: data.consumptionType || "Coal Industrial",
        consumption: data.consumption || 100,
        monetaryValue: data.monetaryValue || 500,
        notes: data.notes || "Sample entry",
        documents: data.documents || [],
        status: data.status || "pending",
        emissions: data.emissions || 231,
        unit: "kg",
        costUom: "USD",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "2",
        userId: "1",
        companyId: "1",
        activityType: "Mobile Fuels",
        costCentre: "OPS",
        startDate: "2025-05-20",
        endDate: "2025-05-20",
        consumptionType: "Diesel",
        consumption: 200,
        monetaryValue: 800,
        notes: "Vehicle fleet data",
        documents: [],
        status: "approved",
        emissions: 536,
        unit: "kg",
        costUom: "USD",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "3",
        userId: "1",
        companyId: "1",
        activityType: "Process",
        costCentre: "PROD",
        startDate: "2025-05-25",
        endDate: "2025-05-25",
        consumptionType: "Manufacturing",
        consumption: 150,
        monetaryValue: 300,
        notes: "Industrial process data",
        documents: [],
        status: "rejected",
        emissions: 277.5,
        unit: "kg",
        costUom: "USD",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    return {
      Status: 200,
      Data: mockData,
    };
  }

  private getGenericMockResponse(
    endpoint: string,
    data: any,
    operation: string
  ): any {
    const identifier = data.email || data.username || "user@example.com";
    const isEmail = data.email && data.email.includes("@");
    const displayName =
      data.name ||
      (isEmail ? data.email.split("@")[0] : data.username || "User");

    const mockResponses: { [key: string]: any } = {
      users: {
        Status: 200,
        Data: [
          {
            Id: "1",
            Email: identifier,
            Name: displayName,
            Surname: "Mock",
            Identity: "USER",
            Status: 0,
          },
        ],
      },
      companies: {
        Status: 200,
        Data: [
          {
            Id: "1",
            Name: data.name,
            Email: identifier,
            Surname: "Mock",
            Identity: "COMPANY",
            Status: 0,
          },
        ],
      },
      emissions: {
        Status: 200,
        Data: [
          {
            Id: "1",
            UserId: "1",
            Year: new Date().getFullYear(),
            TotalEmissions: 1000,
            Scope1: 300,
            Scope2: 400,
            Scope3: 300,
            CreatedAt: new Date().toISOString(),
          },
        ],
      },
      "auth/login": {
        Status: 200,
        Data: [
          {
            success: true,
            token: "mock_jwt_token",
            user: {
              id: "1",
              email: identifier,
              name: displayName,
            },
          },
        ],
      },
      "auth/signup": {
        Status: 200,
        Data: [
          {
            success: true,
            token: "mock_jwt_token",
            user: {
              id: "1",
              email: identifier,
              name: displayName,
            },
          },
        ],
      },
    };

    return mockResponses[endpoint] || { Status: 200, Data: [data] };
  }

  private async handleUnauthorized(): Promise<void> {
    // Simple token refresh - in real implementation, this would call the refresh endpoint
    const storedToken = localStorage.getItem("auth_token");
    if (storedToken) {
      this.authToken = storedToken;
    }
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async handleLocalStorageRequest<T>(
    endpoint: string,
    data: any,
    operation: string
  ): Promise<T> {
    // Handle CRUD operations using localStorage for static export
    const storageKey = `ecometrics_${endpoint}`;

    switch (operation) {
      case "create":
        return this.handleLocalStorageCreate<T>(storageKey, data);
      case "read":
        return this.handleLocalStorageRead<T>(storageKey, data);
      case "update":
        return this.handleLocalStorageUpdate<T>(storageKey, data);
      case "delete":
        return this.handleLocalStorageDelete<T>(storageKey, data);
      case "list":
        return this.handleLocalStorageList<T>(storageKey, data);
      default:
        return this.getMockResponse(endpoint, data, operation) as T;
    }
  }

  private async handleLocalStorageCreate<T>(
    storageKey: string,
    data: any
  ): Promise<T> {
    const existingData = this.getLocalStorageData(storageKey);
    const newItem = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    existingData.push(newItem);
    this.setLocalStorageData(storageKey, existingData);

    return {
      Status: 200,
      Data: [newItem],
    } as T;
  }

  private async handleLocalStorageRead<T>(
    storageKey: string,
    data: any
  ): Promise<T> {
    const existingData = this.getLocalStorageData(storageKey);
    if (data.id) {
      const item = existingData.find((item: any) => item.id === data.id);
      return {
        Status: 200,
        Data: item ? [item] : [],
      } as T;
    }
    return {
      Status: 200,
      Data: existingData,
    } as T;
  }

  private async handleLocalStorageUpdate<T>(
    storageKey: string,
    data: any
  ): Promise<T> {
    const existingData = this.getLocalStorageData(storageKey);
    const updatedData = existingData.map((item: any) =>
      item.id === data.id
        ? { ...item, ...data, updatedAt: new Date().toISOString() }
        : item
    );
    this.setLocalStorageData(storageKey, updatedData);

    return {
      Status: 200,
      Data: updatedData,
    } as T;
  }

  private async handleLocalStorageDelete<T>(
    storageKey: string,
    data: any
  ): Promise<T> {
    const existingData = this.getLocalStorageData(storageKey);
    const filteredData = existingData.filter(
      (item: any) => item.id !== data.id
    );
    this.setLocalStorageData(storageKey, filteredData);

    return {
      Status: 200,
      Data: filteredData,
    } as T;
  }

  private async handleLocalStorageList<T>(
    storageKey: string,
    data: any
  ): Promise<T> {
    const existingData = this.getLocalStorageData(storageKey);
    return {
      Status: 200,
      Data: existingData,
      total: existingData.length,
    } as T;
  }

  private getLocalStorageData(storageKey: string): any[] {
    try {
      const data = localStorage.getItem(storageKey);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      return [];
    }
  }

  private setLocalStorageData(storageKey: string, data: any[]): void {
    try {
      localStorage.setItem(storageKey, JSON.stringify(data));
    } catch (error) {
      console.error("Error writing to localStorage:", error);
    }
  }

  // Import method exists above

  // CRUD operations
  async create<T>(resource: string, data: any): Promise<T> {
    return this.makeRequest<T>(resource, data, "create");
  }

  async read<T>(resource: string, id?: string): Promise<T> {
    const endpoint = id ? `${resource}/${id}` : resource;
    return this.makeRequest<T>(endpoint, { operation: "read" }, "read");
  }

  async update<T>(resource: string, id: string, data: any): Promise<T> {
    return this.makeRequest<T>(
      `${resource}/${id}`,
      {
        ...data,
        operation: "update",
      },
      "update"
    );
  }

  async delete<T>(resource: string, id: string): Promise<T> {
    return this.makeRequest<T>(
      `${resource}/${id}`,
      { operation: "delete" },
      "delete"
    );
  }

  async list<T>(resource: string, filters?: any): Promise<T[]> {
    return this.makeRequest<T[]>(
      resource,
      {
        operation: "list",
        filters: filters || {},
      },
      "list"
    );
  }

  // Authentication methods
  setAuthToken(token: string): void {
    this.authToken = token;
  }

  clearAuthToken(): void {
    this.authToken = null;
  }

  // Environment-specific API calls
  async signup(
    data: any
  ): Promise<{ Status: number; Data?: any[]; token?: string; error?: string }> {
    return this.makeRequest("auth/signup", data, "create");
  }

  async login(
    data: any
  ): Promise<{ Status: number; Data?: any[]; token?: string; error?: string }> {
    return this.makeRequest("auth/login", data, "create");
  }

  async logout(): Promise<{ Status: number; Data?: any[]; message?: string }> {
    return this.makeRequest("auth/logout", {}, "create");
  }

  async getCurrentUser(): Promise<{
    Status: number;
    Data?: any[];
    token?: string;
    error?: string;
  }> {
    return this.makeRequest("auth/me", {}, "read");
  }
}

// Export singleton instance
export const crudService = new CrudService();
export default crudService;
