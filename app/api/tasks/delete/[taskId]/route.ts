import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function DELETE(request: NextRequest, {params} : { params: Promise<{taskId: string}>}) {
    try {
        const { taskId} = await params;
        const {data, error} = await supabaseAdmin.from("users").select("google_refresh_token").limit(1).single();
        if (error || !data?.google_refresh_token) {
            return NextResponse.json({error: "Google account not found in Supa"}, {status: 401});
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

        const response = await tasks.tasks.delete({
            tasklist: "@default",
            task: taskId,
        });

        return NextResponse.json(response.data);
    } catch (error) {
        console.error(error);
        return NextResponse.json({error: "Failed to delete task."}, {status: 500});
    }
}