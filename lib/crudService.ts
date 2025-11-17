import { CrudRequest } from "@/types/database";
import { environment } from "./environment";

class CrudService {
  private baseUrl: string;
  private crudEndpoint = "/advice/dev/crud/crud";
  private isStaticExport: boolean;
  private token: string | null = null;

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
    console.log("Making CRUD request to:", fullUrl);
    console.log("Full request payload:", JSON.stringify(request, null, 2));
    console.log(
      "Request headers: Content-Type: application/json, Credentials: include"
    );
    console.log("Origin:", window.location.origin);
    console.log("About to call fetch...");

    // Log cookies being sent
    console.log("🍪 ALL COOKIES:", document.cookie);
    console.log(
      "🍪 Cookies for .temo.co.za:",
      document.cookie
        .split(";")
        .filter((c) => c.includes("_advice") || c.includes("XSRF"))
        .map((c) => c.trim())
    );

    const headers: { [key: string]: string } = {
      "Content-Type": "application/json",
    };

    if (this.token && this.token !== "cookie-based") {
      headers["Authorization"] = `Bearer ${this.token}`;
      console.log("Including Authorization header in request");
    } else {
      console.log(
        "Using cookie-based authentication (no Authorization header)"
      );
    }

    try {
      const response = await fetch(fullUrl, {
        method: "POST",
        headers,
        credentials: "include", // Include cookies for authentication as fallback
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

      // Handle unauthorized - redirect to login
      if (response.status === 401) {
        console.error("Unauthorized - user may need to login");
        throw new Error("Authentication required. Please login again.");
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
   * @returns PROMISE WITH CRUD RESPONSE
   */
  async callCrud(crud: any): Promise<any> {
    try {
      const response = await fetch(this.baseUrl + this.crudEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include cookies for authentication
        body: JSON.stringify(crud),
      });

      // HANDLE 401 UNAUTHORISED - TOKEN EXPIRED OR INVALID
      if (response.status === 401) {
        console.error("Unauthorized in callCrud - user may need to login");
        throw new Error("Authentication required. Please login again.");
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

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
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
    this.token = token;
    console.log(
      "Auth token set for Authorization header:",
      token ? "present" : "null"
    );
  }

  clearAuthToken(): void {
    console.warn(
      "clearAuthToken is deprecated - cookies are managed automatically"
    );
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
        credentials: "include", // Include credentials to receive cookies
        body: JSON.stringify(data),
      });

      console.log("Login response status:", response.status);
      console.log("Login response ok:", response.ok);

      // Log response headers to see Set-Cookie
      console.log(
        "Login response headers:",
        Object.fromEntries(response.headers.entries())
      );

      // Log Set-Cookie headers specifically (may not be visible in browser)
      const setCookieHeaders = response.headers.get("set-cookie");
      console.log("🍪 SET-COOKIE HEADER:", setCookieHeaders);

      // Check cookies immediately after response
      console.log("🍪 COOKIES BEFORE LOGIN RESPONSE PARSE:", document.cookie);

      const result = await response.json();
      console.log("Login response data:", result);

      // Extract token from response headers or body
      const authHeader = response.headers.get("Authorization");
      const xAuthToken = response.headers.get("X-Auth-Token");
      const xToken = response.headers.get("X-Token");

      console.log("Response headers for token extraction:");
      console.log("- Authorization:", authHeader);
      console.log("- X-Auth-Token:", xAuthToken);
      console.log("- X-Token:", xToken);

      const token = authHeader
        ? authHeader.replace("Bearer ", "")
        : xAuthToken || xToken || result.token || result.access_token;

      console.log(
        "Extracted token:",
        token ? `present (${token.substring(0, 10)}...)` : "not found"
      );

      // Check cookies after response is parsed
      console.log("🍪 COOKIES AFTER LOGIN RESPONSE PARSE:", document.cookie);

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

      // Cookies are automatically set by the browser via Set-Cookie header
      // Also return token if available for Authorization header
      console.log(
        "Login successful - session cookie should be set automatically"
      );

      return { ...result, token };
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
