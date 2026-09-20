import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
    try {
        const { data, error } = await supabase
            .from("users")
            .select("google_refresh_token")
            .limit(1)
            .single();
        if (error || !data?.google_refresh_token) {
            return NextResponse.json(
                { error: "Google account not found in Supabase" },
                { status: 401 }
            );
        }

        const oauth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            process.env.GOOGLE_REDIRECT_URI
        );

        oauth2Client.setCredentials({
            refresh_token: data.google_refresh_token,
        });

        const tasks = google.tasks({
            version: "v1",
            auth: oauth2Client,
        });

        const response = await tasks.tasks.list({
            tasklist: "@default",
            showCompleted: false,
            showHidden: false,
        });

        return NextResponse.json(response.data.items ?? []);

    } catch (error) {
        console.error("Google Tasks error:", error);

        return NextResponse.json(
            { error: "Failed to fetch Google Tasks" },
            { status: 500 }
        );
    }
}

export async function POST(request : NextRequest) {
  try {
        const {title, notes, due} = await request.json();
        const { data, error } = await supabase
            .from("users")
            .select("google_refresh_token")
            .limit(1)
            .single();
        if (error || !data?.google_refresh_token) {
            return NextResponse.json(
                { error: "Google account not found in Supabase" },
                { status: 401 }
            );
        }

        const oauth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            process.env.GOOGLE_REDIRECT_URI
        );

        oauth2Client.setCredentials({
            refresh_token: data.google_refresh_token,
        });

        const tasks = google.tasks({
            version: "v1",
            auth: oauth2Client,
        });

        const response = await tasks.tasks.insert({
            tasklist: "@default",
            requestBody: {
              title, notes, due
            }
        });

        return NextResponse.json(response.data);

    } catch (error) {
        console.error("Google Tasks error:", error);

        return NextResponse.json(
            { error: "Failed to add Google Tasks" },
            { status: 500 }
        );
    }
}