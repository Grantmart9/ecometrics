import { NextRequest, NextResponse } from "next/server";
import { crudService } from "@/lib/crudService";
import { CreateInputDataRequest, InputData } from "@/types/inputData";

// Required for static export
export const dynamic = "force-static";
export const revalidate = false;

export async function POST(request: NextRequest) {
  try {
    const data: CreateInputDataRequest = await request.json();

    // Validate required fields
    if (
      !data.activityType ||
      !data.costCentre ||
      !data.startDate ||
      !data.endDate ||
      !data.consumptionType ||
      !data.consumption
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get user ID from auth (in a real app, this would come from JWT token)
    // For now, we'll use a default user ID - in production, extract from auth token
    const userId = "user_1"; // TODO: Extract from auth context
    const companyId = "company_1"; // TODO: Extract from auth context

    // Calculate emissions (simplified calculation)
    const emissions = await calculateEmissions(
      data.activityType,
      data.consumption,
      data.consumptionType
    );

    const inputData = {
      userId,
      companyId,
      ...data,
      emissions,
      status: "pending" as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const result = await crudService.create("emissions-input", inputData);

    return NextResponse.json(
      {
        message: "Input data created successfully",
        data: result,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create input data error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const activityType = searchParams.get("activityType");
    const status = searchParams.get("status");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const costCentre = searchParams.get("costCentre");

    const filters: any = {};
    if (activityType) filters.activityType = activityType;
    if (status) filters.status = status;
    if (startDate) filters.startDate = startDate;
    if (endDate) filters.endDate = endDate;
    if (costCentre) filters.costCentre = costCentre;

    const result = await crudService.list("emissions-input", {
      ...filters,
      page,
      limit,
    });

    return NextResponse.json({
      Status: 200,
      Data: Array.isArray(result) ? result : [result],
      total: Array.isArray(result) ? result.length : 1,
      page,
      limit,
    });
  } catch (error) {
    console.error("List input data error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function calculateEmissions(
  activityType: string,
  consumption: number,
  consumptionType: string
): Promise<number> {
  // Simplified emission calculations based on activity type
  // In a real app, this would use proper emission factors from your database
  const emissionFactors: { [key: string]: number } = {
    "Stationary Fuels": 2.31, // kg CO2e per unit
    "Mobile Fuels": 2.68,
    "Fugitive Gas": 0.25,
    Process: 1.85,
    "Waste Water": 0.45,
    "Renewable Electricity": 0.02,
  };

  const factor = emissionFactors[activityType] || 1.0;
  return Math.round(consumption * factor * 100) / 100;
}
