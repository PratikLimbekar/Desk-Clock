"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
    const router = useRouter();

    const handleLogout = async () => {
        const supabase = createClient();

        const { error } = await supabase.auth.signOut();

        if (error) {
            console.error("Logout failed:", error);
            return;
        }

        router.replace("/auth/login");
        router.refresh();
    };

    return (
        <button
            onClick={handleLogout}
            className="px-4 py-2 bg-white text-black rounded-lg"
        >
            Log out
        </button>
    );
}