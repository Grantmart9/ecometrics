import { NextRequest, NextResponse } from "next/server";
import { crudService } from "@/lib/crudService";

// Required for static export
export const dynamic = "force-static";
export const revalidate = false;

export async function POST(request: NextRequest) {
  try {
    const { email, username, password, name, company } = await request.json();

    if (!password) {
      return NextResponse.json(
        { error: "Password is required" },
        { status: 400 }
      );
    }

    // Accept either email or username, but at least one is required
    if (!email && !username) {
      return NextResponse.json(
        { error: "Either email or username is required" },
        { status: 400 }
      );
    }

    // Determine the identifier to use (email takes precedence if both provided)
    const identifier = email || username;

    // Validate the identifier format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;

    if (email && !emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address" },
        { status: 400 }
      );
    }

    if (username && !usernameRegex.test(username)) {
      return NextResponse.json(
        {
          error:
            "Username must be 3-30 characters and contain only letters, numbers, and underscores",
        },
        { status: 400 }
      );
    }

    // Use the primary identifier (email preferred) for API compatibility
    const result = await crudService.signup({
      email: identifier, // Send identifier as email field for backend compatibility
      password,
      username, // Also pass username separately for potential backend use
      name,
      company,
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
