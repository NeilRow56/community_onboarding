import { cn } from "@/lib/utils";
import type { Metadata } from "next";

import { ClerkProvider } from "@clerk/nextjs";
import Providers from "@/components/providers";
import { Inter, Playfair_Display } from "next/font/google";

import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { APP_DESCRIPTION, APP_NAME, SERVER_URL } from "@/lib/constants";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: {
    template: `%s | Prostore`,
    default: APP_NAME,
  },
  description: APP_DESCRIPTION,
  metadataBase: new URL(SERVER_URL),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        suppressHydrationWarning
        className="scroll-smooth antialiased"
      >
        <body
          className={cn(
            "flex min-h-screen flex-col",

            inter.variable,
            playfair.variable
          )}
        >
          <Providers>
            <Header />
            <main className="mx-auto h-full grow">{children}</main>
            <Footer />
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
