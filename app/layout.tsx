import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/lib/auth-context";
import { EmissionsProvider } from "@/lib/emissionsContext";
import { Nav } from "@/components/nav";
import { ChatWidget } from "@/components/chat-widget";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ecometrics",
  description:
    "EcoMetrics empowers businesses to track and reduce their carbon footprint with intelligent analytics.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <EmissionsProvider>
            <Nav />
            <div>{children}</div>
            <ChatWidget />
          </EmissionsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
