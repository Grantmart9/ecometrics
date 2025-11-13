// Debug authentication issues
export const debugAuth = {
  // Check if token exists in localStorage
  checkLocalStorageToken: (): string | null => {
    const token = localStorage.getItem("auth_token");
    console.log(
      "DEBUG: Token from localStorage:",
      token ? `${token.substring(0, 20)}...` : "null"
    );
    return token;
  },

  // Check the current session
  checkCurrentSession: () => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("auth_token");
      console.log("DEBUG: Current auth status:");
      console.log("- Token exists:", !!token);
      console.log("- Token length:", token?.length || 0);
      console.log(
        "- Token preview:",
        token ? `${token.substring(0, 20)}...` : "N/A"
      );
      console.log(
        "- All localStorage keys:",
        Object.keys(localStorage).filter(
          (k) => k.includes("auth") || k.includes("token")
        )
      );
      return {
        hasToken: !!token,
        tokenLength: token?.length || 0,
        tokenPreview: token ? `${token.substring(0, 20)}...` : null,
        allAuthKeys: Object.keys(localStorage).filter(
          (k) => k.includes("auth") || k.includes("token")
        ),
      };
    }
    return null;
  },

  // Test the current token by making a simple request
  testTokenWithAPI: async () => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      console.log("DEBUG: No token available for API test");
      return { success: false, error: "No token" };
    }

    try {
      const testRequest = {
        resource: "test",
        operation: "read",
        data: {},
        requestId: `debug_${Date.now()}`,
      };

      const response = await fetch(
        "https://api.temo.co.za/advice/dev/crud/crud",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(testRequest),
        }
      );

      console.log("DEBUG: Test API response:");
      console.log("- Status:", response.status);
      console.log("- Status text:", response.statusText);
      console.log("- Headers:", Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.log("- Error response:", errorText);
      }

      return {
        success: response.ok,
        status: response.status,
        statusText: response.statusText,
      };
    } catch (error) {
      console.log("DEBUG: Test API error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  },
};
