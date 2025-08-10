"use client";

import "../globals.css";
import { Inter } from "next/font/google";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { useAuth } from "@/context/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import VerifySession from "@/components/ui/VerifySession";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { accessToken, signout } = useAuth();
  const router = useRouter();
  const [checking, setChecking] = useState(true);

const pathname = usePathname();

useEffect(() => {
  if (!accessToken) {
    window.location.href = "/auth/signin";
    return;
  }

  const verifyPromise = fetch("/api/auth/verify-token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then((res) => res.json())
    .catch(() => ({ valid: false }));

  const minDisplayTimePromise = new Promise((resolve) =>
    setTimeout(resolve, 2000)
  );

  Promise.all([verifyPromise, minDisplayTimePromise])
    .then(([data]) => {
      if (!data.valid) {
        signout();
      }
    })
    .finally(() => setChecking(false));
}, [accessToken, pathname, router, signout]);

  if (checking) {
    return (
      <VerifySession/>
    );
  }

  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex h-screen bg-gray-50">
          <Sidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Header />
            <main className="flex-1 overflow-y-auto">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
