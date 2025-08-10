import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    // You can add any server-side logic here.
    // For this example, we'll just return a simple object.

    const data = {
      message: "Hello from the Next.js API!",
      timestamp: new Date().toISOString(),
    };

    // Return the data as a JSON response.
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error in API route:", error);

    // Return an error response if something goes wrong.
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
