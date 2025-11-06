// Database types for CRUD operations
export interface CrudRequest {
  resource: string;
  operation: "create" | "read" | "update" | "delete" | "list" | string;
  data?: any;
  filters?: any;
  requestId: string;
}

export interface CrudResponse<T = any> {
  result: T;
  success: boolean;
  message?: string;
  requestId?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  company?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Session {
  access_token: string;
  user: User;
}

export interface Company {
  id: string;
  name: string;
  email: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Emission {
  id: string;
  userId: string;
  companyId: string;
  year: number;
  totalEmissions: number;
  scope1: number;
  scope2: number;
  scope3: number;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  Status: number;
  Data?: any[];
  success?: boolean;
  token?: string;
  user?: User;
  message?: string;
  error?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  name: string;
}
