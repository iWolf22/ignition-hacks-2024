import type { Metadata } from "next";

import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { Inter } from "next/font/google";

import "./globals.css";

import { getServerSession } from "next-auth";
import SessionProvider from "../components/SessionProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    description: "Mobility+",
    title: "Mobility+",
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await getServerSession();

    return (
        <html lang="en">
            <body className={inter.className}>
                <SessionProvider session={session}>
                    <AppRouterCacheProvider>{children}</AppRouterCacheProvider>
                </SessionProvider>
            </body>
        </html>
    );
}
