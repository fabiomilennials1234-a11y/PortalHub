import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import { Providers } from "@/components/shared/Providers"
import "./globals.css"

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
})

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
})

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: "PortalHub — Comunidades + Cursos all-in-one",
    template: "%s | PortalHub",
  },
  description:
    "Plataforma all-in-one para criadores construírem comunidades pagas, publicarem cursos online e engajarem membros com gamificação nativa.",
  keywords: [
    "comunidade online",
    "cursos online",
    "creator economy",
    "membership",
    "gamificação",
    "Skool alternativa",
  ],
  openGraph: {
    title: "PortalHub — Comunidades + Cursos all-in-one",
    description:
      "Construa comunidades pagas, publique cursos e engaje membros com gamificação nativa.",
    url: APP_URL,
    siteName: "PortalHub",
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PortalHub",
    description:
      "Plataforma all-in-one de comunidades e cursos online.",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-dvh bg-background font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
