"use client";

import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
    const handleLogin = async () => {
        const supabase = createClient();

        const { error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        });

        if (error) {
            console.error("Google login failed:", error);
        }
    };

    return (
        <main className="h-screen w-screen bg-black text-white flex items-center justify-center">
            <button
                onClick={handleLogin}
                className="px-6 py-3 bg-white text-black rounded-lg"
            >
                Continue with Google
            </button>
        </main>
    );
}