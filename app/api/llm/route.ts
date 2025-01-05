import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log(body)
    const { provider, apiKey, model, messages, parameters } = body || {};

    if (!provider || !apiKey || !model || !messages) {
      return NextResponse.json(
        {
          error: "Missing required fields (proivder, apiKey, model, messages)",
        },
        { status: 400 }
      );
    }

    // Based on proivder pick the correct endpoint & ˙eaders:
    let apiUrl = "";
    let fetchHeaders: Record<string, string> = {};
    let fetchBody: any = {};

    if (provider === "openai") {
      apiUrl = "https://api.openai.com/v1/chat/completions";
      fetchHeaders = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      };
      fetchBody = {
        model,
        messages: messages.map((m: any) => ({
          role: m.role,
          content: m.content,
        })),
        ...parameters,
      };
    } else {
      return NextResponse.json(
        { error: `unsupported proivder: ${provider}"` },
        { status: 400 }
      );
    }

    console.log("fetchHeaders", fetchHeaders)
    console.log("fetchBody", fetchBody)

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: fetchHeaders,
      body: JSON.stringify(fetchBody),
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          error: `LLM API Error: ${response.statusText}`,
          status: response.status,
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    console.log(`Usage Completion Tokens: ${data.usage.completion_tokens}`)

    console.log(data)
    return NextResponse.json({
      content: data.choices[0].message.content,
      usage: data.usage.completion_tokens,
      created: data.created
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Unknown error occurred" },
      { status: 500 }
    );
  }
}
