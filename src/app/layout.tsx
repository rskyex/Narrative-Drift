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
    url: "/",
    type: "website",
    siteName: "Narrative Drift",
    images: [
      {
        url: "/narrative-drift-hp.png",
        width: 1372,
        height: 768,
        type: "image/png",
        alt: "Narrative Drift — An interactive exploration of algorithmic influence",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Narrative Drift",
    description:
      "An interactive exploration of how ordinary AI-mediated choices gradually alter the self.",
    images: [
      {
        url: "/narrative-drift-hp.png",
        width: 1372,
        height: 768,
        alt: "Narrative Drift — An interactive exploration of algorithmic influence",
      },
    ],
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
        {/* Persistent title */}
        <header className="fixed top-0 left-0 right-0 z-[60] pointer-events-none">
          <div className="flex justify-center pt-4">
            <span className="text-[9px] uppercase tracking-[0.4em] text-drift-muted/30 font-sans">
              Narrative Drift
            </span>
          </div>
        </header>

        {children}

        {/* Persistent copyright */}
        <footer className="fixed bottom-0 left-0 right-0 z-[60] pointer-events-none">
          <div className="flex justify-center pb-4">
            <span className="text-[9px] uppercase tracking-[0.3em] text-drift-muted/30 font-sans">
              &copy; Risa Koyanagi
            </span>
          </div>
        </footer>
      </body>
    </html>
  );
}
