import { NextResponse } from "next/server";

export async function GET(request : Request) {
    const url = new URL(request.url);
    const searchParams = url.searchParams;
    const apiKey = process.env.WEATHER_API;

    const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&${searchParams}`);
    const data = await response.json();

    return NextResponse.json(data);
}