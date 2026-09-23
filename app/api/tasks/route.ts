import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

async function getGoogleTasksClient() {
    const supabase = await createClient();

    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
        throw new Error("Not authenticated");
    }

    const { data, error } = await supabase
        .from("users")
        .select("google_refresh_token")
        .eq("id", user.id)
        .single();

    if (error || !data?.google_refresh_token) {
        throw new Error("Google account not connected");
    }

    const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI
    );

    oauth2Client.setCredentials({
        refresh_token: data.google_refresh_token,
    });

    return google.tasks({
        version: "v1",
        auth: oauth2Client,
    });
}

export async function GET() {
    try {
        const tasks = await getGoogleTasksClient();

        const response = await tasks.tasks.list({
            tasklist: "@default",
            showCompleted: false,
            showHidden: false,
        });

        return NextResponse.json(response.data.items ?? []);

    } catch (error) {
        console.error("Google Tasks error:", error);

        if (
            error instanceof Error &&
            (error.message === "Not authenticated" ||
                error.message === "Google account not connected")
        ) {
            return NextResponse.json(
                { error: error.message },
                { status: 401 }
            );
        }

        return NextResponse.json(
            { error: "Failed to fetch Google Tasks" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const { title, notes, due } = await request.json();

        const tasks = await getGoogleTasksClient();

        const response = await tasks.tasks.insert({
            tasklist: "@default",
            requestBody: {
                title,
                notes,
                due,
            },
        });

        return NextResponse.json(response.data);

    } catch (error) {
        console.error("Google Tasks error:", error);

        if (
            error instanceof Error &&
            (error.message === "Not authenticated" ||
                error.message === "Google account not connected")
        ) {
            return NextResponse.json(
                { error: error.message },
                { status: 401 }
            );
        }

        return NextResponse.json(
            { error: "Failed to add Google Task" },
            { status: 500 }
        );
    }
}