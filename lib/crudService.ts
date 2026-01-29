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
    // Map resource to RecordSet and TableName
    let recordSet = endpoint;
    let tableName = endpoint;

    // Special mappings
    if (endpoint === "emissions-input") {
      // For create/update/delete use DiaryDetail, for list/read use Address/entityrelationship
      if (operation === "list" || operation === "read") {
        recordSet = "Address";
        tableName = "entityrelationship";
      } else {
        recordSet = "DiaryDetail";
        tableName = "diarydetail";
      }
    }

    // Map operation to Action
    let action = operation;
    if (operation === "list") {
      action = "readExact";
    } else if (operation === "read") {
      action = "readExact";
    }

    // For emissions-input, send data as-is for now
    let mappedData = data;
    if (endpoint === "emissions-input" && operation === "delete") {
      mappedData = { id: data.id };
    }

    // Debug logging for emissions-input
    if (endpoint === "emissions-input") {
      console.log("🔍 DEBUG emissions-input operation:", operation);
      console.log("🔍 DEBUG original data:", JSON.stringify(data, null, 2));
      console.log("🔍 DEBUG mappedData:", JSON.stringify(mappedData, null, 2));
      console.log("🔍 DEBUG recordSet:", recordSet, "tableName:", tableName, "action:", action);
    }

    // Build the data array
    const dataArray = [
      {
        RecordSet: recordSet,
        TableName: tableName,
        Action: action,
        Fields:
          operation === "list" || operation === "read"
            ? data.filters || {}
            : mappedData,
      },
    ];

    const request = {
      data: JSON.stringify(dataArray),
      PageNo: "1",
      NoOfLines: "300",
      CrudMessage: "@CrudMessage",
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
      "X-Requested-With": "flutter",
    };

    // For CRUD requests, try to get token from cookies
    let authToken =
      this.token && this.token !== "cookie-based" ? this.token : null;
    if (!authToken) {
      // Try to extract from cookies - find the non-empty _advice_dev cookie
      const cookies = document.cookie.split(";");
      for (const cookie of cookies) {
        const [name, value] = cookie.trim().split("=");
        if (name === "_advice_dev" && value && value !== "" && value !== ";") {
          authToken = value;
          break;
        }
      }
    }

    if (authToken) {
      headers["Authorization"] = `Bearer ${authToken}`;
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
      console.log("Raw response:", result);

      // Handle the new response format
      if (
        result &&
        result.Data &&
        Array.isArray(result.Data) &&
        result.Data.length > 0
      ) {
        const jsonData = result.Data[0].JsonData;
        if (jsonData) {
          try {
            const parsedData = JSON.parse(jsonData);
            console.log("Parsed JsonData:", parsedData);

            // Extract the actual data from the parsed object
            const keys = Object.keys(parsedData);
            if (keys.length > 0) {
              const firstKey = keys[0];
              const data = parsedData[firstKey];

              // For list operations, return the TableData array
              if (data && data.TableData && Array.isArray(data.TableData)) {
                // Map backend fields to frontend fields for emissions-input
                if (endpoint === "emissions-input") {
                  // For Address/entityrelationship queries, map to InputData format
                  return data.TableData.map((item: any) => ({
                    id: item.entityrelationshipid?.toString() || "",
                    userId: item.entityrelationshipCreatedBy?.toString() || "",
                    companyId: item.entityrelationshipentity?.toString() || "",
                    activityType: item.entityrelationshipname || "",
                    costCentre: "",
                    startDate: item.entityrelationshipstartdate || "",
                    endDate: item.entityrelationshipenddate || "",
                    consumptionType: "",
                    consumption: 0,
                    monetaryValue: undefined,
                    notes: item.entityrelationshipdescription || "",
                    documents: [],
                    status: item.entityrelationshipstatusName || "pending",
                    createdAt: item.entityrelationshipstartdate || "",
                    updatedAt: item.entityrelationshipstartdate || "",
                    emissions: 0,
                    unit: "",
                    costUom: "USD",
                  }));
                }
                return data.TableData;
              }

              // For single operations, return the data
              return data;
            }
          } catch (parseError) {
            console.error("Failed to parse JsonData:", parseError);
          }
        }
      }

      // Fallback to old format
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
    const headers: { [key: string]: string } = {
      "Content-Type": "application/json",
      "X-Requested-With": "flutter",
    };

    // For CRUD requests, try to get token from cookies or stored token
    let authToken =
      this.token && this.token !== "cookie-based" ? this.token : null;
    if (!authToken) {
      // Try to extract from cookies - find the non-empty _advice_dev cookie
      const cookies = document.cookie.split(";");
      for (const cookie of cookies) {
        const [name, value] = cookie.trim().split("=");
        if (name === "_advice_dev" && value && value !== "" && value !== ";") {
          authToken = value;
          break;
        }
      }
    }

    if (authToken) {
      headers["Authorization"] = `Bearer ${authToken}`;
      console.log("Including Authorization header in callCrud");
    } else {
      console.log(
        "Using cookie-based authentication in callCrud (no Authorization header)"
      );
    }

    try {
      const response = await fetch(this.baseUrl + this.crudEndpoint, {
        method: "POST",
        headers,
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
      resource,
      {
        ...data,
        id: id, // Include id for update operations
        operation: "update",
      },
      "update"
    );
  }

  async delete<T>(resource: string, id: string): Promise<T> {
    return this.makeRequest<T>(
      resource,
      { id: id, operation: "delete" },
      "delete"
    );
  }

  async list<T>(resource: string, filters?: any): Promise<T[]> {
    let defaultFilters = {};
    if (resource === "emissions-input") {
      defaultFilters = { Entity: "140634500", Relationship: "59298" }; // Filter by Owns relationship
    }

    return this.makeRequest<T[]>(
      resource,
      {
        operation: "list",
        filters: { ...defaultFilters, ...(filters || {}) },
      },
      "list"
    );
  }

  async callProcedure<T>(procedureName: string, fields: any): Promise<T> {
    // Use appropriate RecordSet based on procedure
    let recordSet = "Data";
    if (procedureName === "sp_loadcarbon") {
      recordSet = "Upload";
    } else if (procedureName === "get_entitytyperelatemember") {
      recordSet = "Address";
    }

    const dataArray = [
      {
        RecordSet: recordSet,
        TableName: procedureName,
        Action: "procedure",
        Fields: fields,
      },
    ];

    const request = {
      data: JSON.stringify(dataArray),
      PageNo: "1",
      NoOfLines: "300",
      CrudMessage: "@CrudMessage",
    };

    const fullUrl = this.baseUrl + this.crudEndpoint;
    console.log("Making procedure call to:", fullUrl);
    console.log("Procedure request payload:", JSON.stringify(request, null, 2));

    const headers: { [key: string]: string } = {
      "Content-Type": "application/json",
      "X-Requested-With": "flutter",
    };

    // For procedure calls, try to get token from cookies
    let authToken =
      this.token && this.token !== "cookie-based" ? this.token : null;
    if (!authToken) {
      const cookies = document.cookie.split(";");
      for (const cookie of cookies) {
        const [name, value] = cookie.trim().split("=");
        if (name === "_advice_dev" && value && value !== "" && value !== ";") {
          authToken = value;
          break;
        }
      }
    }

    if (authToken) {
      headers["Authorization"] = `Bearer ${authToken}`;
      console.log("Including Authorization header in procedure call");
    }

    try {
      const response = await fetch(fullUrl, {
        method: "POST",
        headers,
        credentials: "include",
        body: JSON.stringify(request),
      });

      if (response.status === 401) {
        throw new Error("Authentication required. Please login again.");
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Procedure response:", result);

      // Handle procedure response format
      if (
        result &&
        result.Data &&
        Array.isArray(result.Data) &&
        result.Data.length > 0
      ) {
        const jsonData = result.Data[0].JsonData;
        if (jsonData) {
          try {
            const parsedData = JSON.parse(jsonData);
            console.log("Parsed procedure JsonData:", parsedData);

            // Return the parsed data
            const keys = Object.keys(parsedData);
            if (keys.length > 0) {
              return parsedData[keys[0]];
            }
          } catch (parseError) {
            console.error("Failed to parse procedure JsonData:", parseError);
          }
        }
      }

      return result;
    } catch (error) {
      console.error("Procedure call failed:", error);
      throw error;
    }
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
    // Use direct fetch for signup to hit the correct endpoint
    const signupUrl = this.baseUrl + "/advice/dev/auth/signup";
    console.log("Making signup request to:", signupUrl, "with data:", data);

    try {
      const response = await fetch(signupUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "flutter",
        },
        credentials: "include",
        body: JSON.stringify(data),
      });

      console.log("Signup response status:", response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Signup response data:", result);

      return result;
    } catch (error) {
      console.error("Signup request failed:", error);
      throw error;
    }
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
          "X-Requested-With": "flutter",
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
        : xAuthToken ||
          xToken ||
          result.token ||
          result.access_token ||
          result.accessToken ||
          result.Token ||
          result.Data?.token;

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

      // Extract token from cookies if not in response
      let extractedToken = token;
      if (!extractedToken) {
        // Try to extract from cookies
        const cookies = document.cookie.split(";");
        for (const cookie of cookies) {
          const [name, value] = cookie.trim().split("=");
          if (name === "_advice_dev" && value) {
            extractedToken = value;
            break;
          }
        }
      }

      // Cookies are automatically set by the browser via Set-Cookie header
      // Also return token if available for Authorization header
      console.log(
        "Login successful - session cookie should be set automatically"
      );

      return { ...result, token: extractedToken };
    } catch (error) {
      console.error("Login request failed:", error);
      throw error;
    }
  }

  async logout(): Promise<{ Status: number; Data?: any[]; message?: string }> {
    // Use direct fetch for logout to hit the correct endpoint
    const logoutUrl = this.baseUrl + "/advice/dev/auth/logout";
    console.log("Making logout request to:", logoutUrl);

    try {
      const response = await fetch(logoutUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "flutter",
        },
        credentials: "include",
      });

      console.log("Logout response status:", response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Logout response data:", result);

      return result;
    } catch (error) {
      console.error("Logout request failed:", error);
      throw error;
    }
  }

  async getCurrentUser(): Promise<{
    Status: number;
    Data?: any[];
    token?: string;
    error?: string;
  }> {
    // Use direct fetch for getCurrentUser to hit the correct endpoint
    const meUrl = this.baseUrl + "/advice/dev/auth/me";
    console.log("Making getCurrentUser request to:", meUrl);

    try {
      const response = await fetch(meUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "flutter",
        },
        credentials: "include",
      });

      console.log("getCurrentUser response status:", response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("getCurrentUser response data:", result);

      return result;
    } catch (error) {
      console.error("getCurrentUser request failed:", error);
      throw error;
    }
  }
}

// Export singleton instance
export const crudService = new CrudService();
export default crudService;
