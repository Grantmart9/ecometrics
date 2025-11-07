import { NextRequest, NextResponse } from "next/server";
import { crudService } from "@/lib/crudService";
import { UpdateInputDataRequest } from "@/types/inputData";

// Required for static export
export const dynamic = "force-static";
export const revalidate = false;
// Required for static export with dynamic routes
export function generateStaticParams() {
  // Return empty array for dynamic parameters - the system will handle them at runtime
  return [];
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await crudService.read("emissions-input", id);

    if (!result) {
      return NextResponse.json(
        { error: "Input data not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      Status: 200,
      Data: result,
    });
  } catch (error) {
    console.error("Get input data error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data: UpdateInputDataRequest = await request.json();

    if (!data) {
      return NextResponse.json({ error: "No data provided" }, { status: 400 });
    }

    // Add update timestamp
    const updateData = {
      ...data,
      updatedAt: new Date().toISOString(),
    };

    const result = await crudService.update("emissions-input", id, updateData);

    return NextResponse.json({
      message: "Input data updated successfully",
      data: result,
    });
  } catch (error) {
    console.error("Update input data error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await crudService.delete("emissions-input", id);

    return NextResponse.json({
      message: "Input data deleted successfully",
      data: result,
    });
  } catch (error) {
    console.error("Delete input data error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
