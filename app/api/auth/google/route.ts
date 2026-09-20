//going to /api/auth/google will send to google for permission to crud tasks
import {google} from "googleapis";
import { NextResponse } from "next/server";

const SCOPES = [
    "https://www.googleapis.com/auth/tasks"
];

export async function GET() {
    const oauth2client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, process.env.GOOGLE_REDIRECT_URI
    );

    const authUrl = oauth2client.generateAuthUrl({
        access_type: "offline",
        scope: SCOPES,
        prompt: "consent"
    });

    return NextResponse.redirect(authUrl);
}