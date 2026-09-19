"use client";

import { useEffect, useState } from "react";

export default function InstallButton() {
  const [installPrompt, setInstallPrompt] = useState<any>(null);

  useEffect(() => {
    const handler = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const installApp = async () => {
    if (!installPrompt) return;

    installPrompt.prompt();

    const { outcome } = await installPrompt.userChoice;

    console.log(`Install prompt: ${outcome}`);
    setInstallPrompt(null);
  };

  if (!installPrompt) return null;

  return (
    <button onClick={installApp}>
      Install Desk Clock
    </button>
  );
}