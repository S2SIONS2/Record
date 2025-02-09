// app/api/naver/map/route.ts
import { NextResponse } from "next/server";

// 네이버 검색 api
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query");

    if (!query) {
        return NextResponse.json({ error: "Missing query parameter" }, { status: 400 });
    }

    const apiUrl = `https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode?query=${encodeURIComponent(query)}`;

    const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
            "x-ncp-apigw-api-key-id": process.env.NEXT_PUBLIC_NAVER_CLIENT_ID || "",
            "x-ncp-apigw-api-key": process.env.NEXT_PUBLIC_NAVER_CLIENT_SECRET || "",
        },
        cache: "force-cache",
    });

    if (!response.ok) {
        return NextResponse.json({ error: "Failed to fetch data" }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
}