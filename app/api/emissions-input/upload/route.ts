import { NextRequest, NextResponse } from "next/server";
import { FileUploadResponse } from "@/types/inputData";

// Required for static export
export const dynamic = "force-static";
export const revalidate = false;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const inputDataId = formData.get("inputDataId") as string;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "text/csv",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/json",
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          error:
            "Invalid file type. Please upload PDF, CSV, Excel, or JSON files.",
        },
        { status: 400 }
      );
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 10MB." },
        { status: 400 }
      );
    }

    // In a real implementation, you would upload to cloud storage (S3, etc.)
    // For now, we'll return a mock response
    const fileName = `${Date.now()}_${file.name}`;
    const fileUrl = `/uploads/${fileName}`; // This would be the actual cloud storage URL

    const uploadResponse: FileUploadResponse = {
      fileName: fileName,
      fileUrl: fileUrl,
      fileSize: file.size,
      mimeType: file.type,
    };

    return NextResponse.json(
      {
        message: "File uploaded successfully",
        data: uploadResponse,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("File upload error:", error);
    return NextResponse.json({ error: "File upload failed" }, { status: 500 });
  }
}
