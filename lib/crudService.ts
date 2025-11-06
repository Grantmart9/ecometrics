import { CrudRequest } from "@/types/database";
import { environment } from "./environment";

class CrudService {
  private baseUrl: string;
  private authToken: string | null = null;
  private crudEndpoint = "/crud/crud";

  constructor() {
    this.baseUrl = environment.apiUrl;
  }

  private async makeRequest<T>(
    endpoint: string,
    data: any,
    operation: string = "create",
    requestIdParam?: string
  ): Promise<T> {
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

  private getMockResponse(endpoint: string, data: any, operation: string): any {
    // Return appropriate mock data based on the endpoint and operation
    const mockResponses: { [key: string]: any } = {
      users: {
        Status: 200,
        Data: [
          {
            Id: "1",
            Email: data.email,
            Name: data.name,
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
            Email: data.email,
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
              email: data.email,
              name: data.email.split("@")[0],
            },
          },
        ],
      },
    };

    return mockResponses[endpoint] || { Status: 200, Data: [data] };
  }

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
