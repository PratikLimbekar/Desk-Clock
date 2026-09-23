//going to /api/auth/google will send to google for permission to crud tasks
import {google} from "googleapis";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const SCOPES = [
    "https://www.googleapis.com/auth/tasks"
];

export async function GET(request: Request) {
    const supabase = await createClient();

    const {
        data: {user},
    } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI
    );

    const authUrl = oauth2Client.generateAuthUrl({
        access_type: "offline",
        scope: SCOPES,
        prompt: "consent",
    });

    return NextResponse.redirect(authUrl);
}