import { NextRequest, NextResponse } from "next/server";
import { callProvider } from "@/lib/ai-client";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    if (req.method !== "POST") {
      console.error("NOT A POST MY GUY");
      return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
    }

    // TODO: TYPE SAFETY & Stuff
    const reqBody = await req.json();
    const result = await callProvider(reqBody);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
