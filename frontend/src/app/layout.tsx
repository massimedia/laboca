import { getBaseURL } from "@lib/util/env"
import Footer from "@modules/layout/footer"
import Header from "@modules/layout/header"
import { Metadata } from "next"
import { Inter, Signika } from "next/font/google"
import "styles/globals.css"

const bodyFont = Inter({
  subsets: ["latin"],
  variable: "--font-body",
})

const signika = Signika({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-headline",
})

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" className={signika.variable} data-mode="light">
      <body className={bodyFont.variable}>
        <Header />
        <main className="relative min-h-screen">{props.children}</main>
        <Footer />
      </body>
    </html>
  )
}
