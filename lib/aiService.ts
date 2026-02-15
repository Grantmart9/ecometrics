// AI Service for calling Ollama API on EC2
// Uses HTTPS URL to avoid Mixed Content issues

const AI_API_URL = "https://ollama.13-48-35-34.nip.io";

export interface AIRequest {
  model?: string;
  prompt: string;
  stream?: boolean;
}

export interface AIResponse {
  response: string;
  done?: boolean;
}

export const aiService = {
  /**
   * Call Ollama API directly via HTTPS
   * CORS must be enabled on the Ollama server
   * On EC2, start Ollama with: OLLAMA_ORIGINS="*" ollama serve
   */
  async generate(request: AIRequest): Promise<AIResponse> {
    const model = request.model || "llama3.1:latest";
    
    console.log("AI Service: Calling Ollama API at", `${AI_API_URL}/api/generate`);
    console.log("AI Service: Model:", model);

    try {
      const response = await fetch(`${AI_API_URL}/api/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          prompt: request.prompt,
          stream: false,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
        console.error("AI Service: Error response:", errorData);
        throw new Error(`AI API error: ${response.status} - ${errorData.error || response.statusText}`);
      }

      const data = await response.json();
      return {
        response: data.response,
        done: data.done,
      };
    } catch (error: any) {
      console.error("AI Service error:", error.message);
      throw error;
    }
  },

  /**
   * Generate a prompt for emissions data assistance
   */
  generateEmissionsPrompt(
    activityGroup: string,
    activity: string,
    context: string
  ): string {
    return `You are an expert in carbon emissions tracking and environmental sustainability.
    
Activity Group: ${activityGroup}
Activity: ${activity}

Context: ${context}

Please provide helpful information about:
1. Common emission factors for this type of activity
2. Typical consumption ranges for similar operations
3. Best practices for accurate data capture
4. Any relevant compliance considerations

Keep your response concise and practical.`;
  },

  /**
   * Auto-fill form data based on activity and historical data
   */
  async suggestEmissionsData(
    activityGroup: string,
    activity: string,
    additionalInfo?: string
  ): Promise<{
    suggestion: string;
    confidence: number;
  }> {
    const prompt = `As an environmental data expert, suggest appropriate values for capturing ${activity} emissions under ${activityGroup}.

${additionalInfo ? `Additional context: ${additionalInfo}` : ""}

Please provide a brief, practical suggestion in JSON format:
{
  "suggested_value": "provide a typical value",
  "unit": "kg CO2e per unit",
  "rationale": "brief explanation"
}`;

    try {
      const result = await this.generate({
        model: "llama3.1:latest",
        prompt,
      });
      return {
        suggestion: result.response,
        confidence: 0.8,
      };
    } catch (error) {
      return {
        suggestion: "Unable to generate suggestion at this time. Please check that the Ollama server is running and accessible.",
        confidence: 0,
      };
    }
  },

  /**
   * Test connection to AI server
   */
  async testConnection(): Promise<{ success: boolean; error?: string; models?: any[] }> {
    try {
      const response = await fetch(`${AI_API_URL}/api/tags`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log("AI Service: Connection successful. Models:", data.models);
        return { success: true, models: data.models };
      } else {
        return { success: false, error: `HTTP ${response.status}` };
      }
    } catch (error: any) {
      console.error("AI Service: Connection test failed:", error.message);
      return { success: false, error: error.message };
    }
  },
};
