"use client";

import LogoutButton from "./logOutButton";

export default function Settings() {
    return (
        <div className="h-full w-full bg-black text-white p-6">
            <h1 className="text-2xl font-semibold mb-8">
                Settings
            </h1>

            <section>
                <h2 className="text-lg mb-3">
                    Account
                </h2>

                <LogoutButton />
            </section>
        </div>
    );
}