import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://narrative-drift.vercel.app"
  ),
  title: "Narrative Drift",
  description:
    "An interactive exploration of how ordinary AI-mediated choices gradually alter the self.",
  openGraph: {
    title: "Narrative Drift",
    description:
      "An interactive exploration of how ordinary AI-mediated choices gradually alter the self.",
    type: "website",
    siteName: "Narrative Drift",
    images: [
      {
        url: "/narrative drift-hp.png",
        width: 1200,
        height: 630,
        alt: "Narrative Drift",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Narrative Drift",
    description:
      "An interactive exploration of how ordinary AI-mediated choices gradually alter the self.",
    images: ["/narrative drift-hp.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-drift-bg text-drift-text font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
