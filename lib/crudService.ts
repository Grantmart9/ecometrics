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
    console.log(
      "CrudService constructor - baseUrl:",
      this.baseUrl,
      "NODE_ENV:",
      process.env.NODE_ENV,
      "isDevelopment:",
      environment.isDevelopment,
      "skipRealApiCalls:",
      environment.skipRealApiCalls
    );
  }

  private detectStaticExport(): boolean {
    // Static export is no longer supported - always return false
    return false;
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

    const fullUrl = this.baseUrl + this.crudEndpoint;
    console.log("Making CRUD request to:", fullUrl, "with request:", request);
    console.log("Request headers:", {
      "Content-Type": "application/json",
      ...(this.authToken && { Authorization: `Bearer ${this.authToken}` }),
    });
    console.log("Origin:", window.location.origin);
    console.log("About to call fetch...");

    try {
      const response = await fetch(fullUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(this.authToken && { Authorization: `Bearer ${this.authToken}` }),
        },
        body: JSON.stringify(request),
      });

      console.log("Response status:", response.status);
      console.log("Response ok:", response.ok);
      console.log(
        "Response headers:",
        Object.fromEntries(response.headers.entries())
      );

      // Check for CORS headers specifically
      const corsHeaders = {
        "access-control-allow-origin": response.headers.get(
          "access-control-allow-origin"
        ),
        "access-control-allow-methods": response.headers.get(
          "access-control-allow-methods"
        ),
        "access-control-allow-headers": response.headers.get(
          "access-control-allow-headers"
        ),
        "access-control-allow-credentials": response.headers.get(
          "access-control-allow-credentials"
        ),
      };
      console.log("CORS headers in response:", corsHeaders);

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
      console.error("makeRequest failed:", error);
      throw error;
    }
  }

  /**
   * CALLS THE CRUD API ENDPOINT
   * @param crud - CRUD REQUEST OBJECT
   * @param token - AUTHENTICATION TOKEN
   * @returns PROMISE WITH CRUD RESPONSE
   */
  async callCrud(crud: any, token: string): Promise<any> {
    try {
      const response = await fetch(this.baseUrl + this.crudEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(crud),
      });

      // HANDLE 401 UNAUTHORISED - TOKEN EXPIRED OR INVALID
      if (response.status === 401) {
        const newToken = await this.handleUnauthorized();

        // RETRY THE REQUEST WITH NEW TOKEN
        const retryResponse = await fetch(this.baseUrl + this.crudEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${newToken}`,
          },
          body: JSON.stringify(crud),
        });

        if (!retryResponse.ok) {
          // Parse error response if possible
          let errorMessage = `HTTP ERROR. STATUS: ${retryResponse.status}`;
          try {
            const errorData = await retryResponse.json();
            if (errorData.Message) {
              errorMessage = errorData.Message;
            }
          } catch (parseError) {
            console.warn("Could not parse error response:", parseError);
          }

          throw new Error(errorMessage);
        }

        const retryData = await retryResponse.json();
        return retryData;
      }

      if (!response.ok) {
        // Parse error response if possible
        let errorMessage = `HTTP ERROR. STATUS: ${response.status}`;
        try {
          const errorData = await response.json();
          if (errorData.Message) {
            errorMessage = errorData.Message;
          }
        } catch (parseError) {
          console.warn("Could not parse error response:", parseError);
        }

        throw new Error(errorMessage);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("CRUD API CALL FAILED: ", error);

      // Re-throw with more user-friendly message for 500 errors
      if (error instanceof Error) {
        if (
          error.message.includes("500") ||
          error.message.includes("Object reference not set")
        ) {
          throw new Error(
            "Server is currently unavailable. Please try again later."
          );
        }
        throw error;
      }

      throw new Error(
        "Network connection failed. Please check your internet connection."
      );
    }
  }

  private async handleUnauthorized(): Promise<string> {
    // Simple token refresh - in real implementation, this would call the refresh endpoint
    const storedToken = localStorage.getItem("auth_token");
    if (storedToken) {
      this.authToken = storedToken;
      return storedToken;
    }
    throw new Error("No token available for refresh");
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
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
    // Use direct fetch for login to hit the correct endpoint
    const loginUrl = this.baseUrl + "/advice/dev/auth/sign-in";
    console.log("Making login request to:", loginUrl, "with data:", data);

    try {
      const response = await fetch(loginUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      console.log("Login response status:", response.status);
      console.log("Login response ok:", response.ok);

      const result = await response.json();
      console.log("Login response data:", result);

      // Check if the server returned a 500 error with null reference exception
      if (
        result &&
        result.Status === 500 &&
        result.Message &&
        result.Message.includes("Object reference not set")
      ) {
        console.error(
          "Server-side null reference exception detected. The login data structure may be incorrect."
        );
        console.log("Sent data structure:", data);
        throw new Error(
          "Server error: Object reference not set. Please check the login data format."
        );
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return result;
    } catch (error) {
      console.error("Login request failed:", error);
      throw error;
    }
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
