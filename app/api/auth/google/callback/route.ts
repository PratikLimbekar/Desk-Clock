//handles google cha callback
import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
    const code = request.nextUrl.searchParams.get("code");

    if (!code) {
        return NextResponse.json(
            { error: "No auth code" },
            { status: 400 }
        );
    }

    const oauth2client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, process.env.GOOGLE_REDIRECT_URI
    );
    const { tokens } = await oauth2client.getToken(code);
    const refreshToken = tokens.refresh_token;

    if (!refreshToken) {
        return NextResponse.json(
            { error: "No refresh token received" },
            { status: 400 }
        );
    }

    const { error } = await supabase
        .from("users")
        .insert({
            google_refresh_token: refreshToken
        });

    if (error) {
        console.error(error);

        return NextResponse.json(
            { error: "Failed to save Google token" },
            { status: 500 }
        );
    }

    return NextResponse.redirect(new URL("/", request.url));
}