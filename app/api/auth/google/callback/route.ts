import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET(request: NextRequest) {
    try {
        const supabaseAuth = await createClient();

        const {
            data: { user },
            error: userError,
        } = await supabaseAuth.auth.getUser();

        if (userError || !user) {
            return NextResponse.json(
                { error: "Not authenticated" },
                { status: 401 }
            );
        }

        const code = request.nextUrl.searchParams.get("code");

        if (!code) {
            return NextResponse.json(
                { error: "No auth code" },
                { status: 400 }
            );
        }

        const oauth2client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            process.env.GOOGLE_REDIRECT_URI
        );

        const { tokens } = await oauth2client.getToken(code);

        const refreshToken = tokens.refresh_token;

        if (!refreshToken) {
            return NextResponse.json(
                { error: "No refresh token received" },
                { status: 400 }
            );
        }

        const { error } = await supabaseAdmin
            .from("users")
            .update({
                google_refresh_token: refreshToken,
            })
            .eq("id", user.id);

        if (error) {
            console.error(error);

            return NextResponse.json(
                { error: "Failed to save Google token" },
                { status: 500 }
            );
        }

        return NextResponse.redirect(
            new URL("/", request.url)
        );

    } catch (error) {
        console.error("Google OAuth callback error:", error);

        return NextResponse.json(
            { error: "Google authorization failed" },
            { status: 500 }
        );
    }
}