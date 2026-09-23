'use client';

import { createClient } from "@/lib/supabase/client";
import { redirect } from "next/dist/server/api-utils";

export default function LoginButton() {
    const handleLogin = async () => {
        const supabase = createClient();

        const {error} = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        });

        if (error) {
            console.error("Google login failed: ", error);
        }
    };

    return(
        <button onClick={handleLogin}>Continue With Google </button>
    )
}