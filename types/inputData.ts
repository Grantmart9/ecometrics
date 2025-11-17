// Input data types for emissions data entry
export interface InputData {
  id: string;
  userId: string;
  companyId: string;
  activityType: string; // Step 1: Select Activity Type
  costCentre: string; // Step 3: Cost Centre
  startDate: string; // Step 2: Start Date
  endDate: string; // End Date
  consumptionType: string; // Step 4: Consumption Type
  consumption: number; // Step 5: Consumption
  monetaryValue?: number; // Step 6: Monetary Value
  notes?: string; // Step 7: Notes
  documents?: string[]; // Step 8: Documents (file names/URLs)
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  updatedAt: string;
  // Calculated fields
  emissions?: number; // Calculated CO2e
  unit?: string; // Unit of measurement
  costUom?: string; // Cost unit of measure
}

export interface CreateInputDataRequest {
  activityType: string;
  costCentre: string;
  startDate: string;
  endDate: string;
  consumptionType: string;
  consumption: string;
  monetaryValue?: string;
  notes?: string;
  documents?: string[];
}

export interface UpdateInputDataRequest
  extends Partial<CreateInputDataRequest> {
  id: string;
  status?: "pending" | "approved" | "rejected";
  consumption?: string;
  monetaryValue?: string;
}

export interface InputDataListResponse {
  Status: number;
  Data: InputData[];
  total: number;
  page: number;
  limit: number;
}

export interface InputDataFilters {
  activityType?: string;
  status?: "pending" | "approved" | "rejected";
  startDate?: string;
  endDate?: string;
  costCentre?: string;
  userId?: string;
  companyId?: string;
}

// For file uploads
export interface FileUploadResponse {
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
}

export interface UploadFileRequest {
  file: File;
  inputDataId?: string;
}
