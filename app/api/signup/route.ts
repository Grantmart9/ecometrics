import { NextRequest, NextResponse } from "next/server";
import { crudService } from "@/lib/crudService";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const result = await crudService.signup({
      email,
      password,
    });

    if (!result || result.Status !== 200) {
      return NextResponse.json(
        { error: result?.error || "Registration failed" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        message: "User created successfully",
        user: result.Data?.[0],
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
