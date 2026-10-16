import type { Metadata, Viewport } from "next";
import { Sora, Manrope, Michroma } from "next/font/google";
import "./globals.css";
import { LenisProvider } from "@/lib/LenisProvider";
import { StoryCanvas } from "@/components/story/StoryCanvas";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { RouteTravelSync } from "@/components/layout/RouteTravelSync";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const michroma = Michroma({
  subsets: ["latin"],
  variable: "--font-michroma",
  display: "swap",
  weight: ["400"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://cyrolabz.com"),
  title: {
    default: "Cyrolabz — Transformation, engineered",
    template: "%s | Cyrolabz",
  },
  description:
    "Cyrolabz engineers high-impact software, 3D interactive design, applied AI systems, consulting, technical audits, and search, answer and generative engine optimisation (SEO, AEO, GEO).",
  openGraph: {
    title: "Cyrolabz — Transformation, engineered",
    description:
      "Website Development, 3D Interactive Design, AI Enablement & Implementation, Custom Software, Consulting, Audits, and Search, Answer & Generative Engine Optimisation.",
    images: [
      {
        url: "/assets/hero-orbital.png",
        width: 1200,
        height: 630,
        alt: "Cyrolabz — Transformation, engineered",
      },
    ],
    type: "website",
    siteName: "Cyrolabz",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cyrolabz — Transformation, engineered",
    description:
      "AI Consulting, Software Development, Technical Audits, and Search, Answer & Generative Engine Optimisation.",
    images: ["/assets/hero-orbital.png"],
  },
  icons: {
    icon: "/assets/logo-mark.png",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F4F5F7" },
    { media: "(prefers-color-scheme: dark)", color: "#0A0B0D" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${sora.variable} ${manrope.variable} ${michroma.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Anti-FOUC Theme Script: applies theme choice before first paint */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function() {
              try {
                var stored = localStorage.getItem('cyrolabz-theme');
                if (stored === 'dark') {
                  document.documentElement.setAttribute('data-theme', 'dark');
                } else if (stored === 'light') {
                  document.documentElement.setAttribute('data-theme', 'light');
                } else {
                  document.documentElement.removeAttribute('data-theme');
                }
              } catch(e) {}
            })();`,
          }}
        />
      </head>
      <body
        suppressHydrationWarning
        className="min-h-screen bg-bg text-ink antialiased relative selection:bg-accent selection:text-on-accent"
      >
        <LenisProvider>
          {/* Synchronizes route navigation to story chapter travel */}
          <RouteTravelSync />

          {/* Persistent single fixed canvas that sits behind every page and never unmounts */}
          <StoryCanvas />

          {/* Persistent fixed Header */}
          <Header />

          {/* Page contents in front of canvas */}
          <main className="relative z-10 min-h-screen">{children}</main>

          {/* Footer */}
          <Footer />
        </LenisProvider>
      </body>
    </html>
  );
}
