// app/api/naver-search/route.ts
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query");

    if (!query) {
        return NextResponse.json({ error: "Missing query parameter" }, { status: 400 });
    }

    const apiUrl = `${process.env.NEXT_PUBLIC_NAVER_SEARCH_URL}?query=${query}`;

    const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
            "X-Naver-Client-Id": process.env.NEXT_PUBLIC_NAVER_SEARCH_CLIENT_ID || "",
            "X-Naver-Client-Secret": process.env.NEXT_PUBLIC_NAVER_SEARCH_CLIENT_SECRET || "",
        },
        cache: "no-store",
    });

    if (!response.ok) {
        return NextResponse.json({ error: "Failed to fetch data" }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
}
