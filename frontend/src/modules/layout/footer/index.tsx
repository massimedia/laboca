import Link from "next/link"

import Container from "@modules/ui/components/container"

export default function Footer() {
  return (
    <footer className="mt-16 bg-brand-charcoal text-brand-cream">
      <Container className="grid gap-10 py-12 md:grid-cols-3">
        <div>
          <h3 className="mb-3 text-xl">Address</h3>
          <p className="text-sm leading-6 text-brand-cream/80">
            LABOCA
            <br />
            123 Calle Central
            <br />
            Copenhagen, DK
          </p>
        </div>
        <div>
          <h3 className="mb-3 text-xl">Opening Hours</h3>
          <p className="text-sm leading-6 text-brand-cream/80">
            Mon-Thu: 11:00-23:00
            <br />
            Fri-Sat: 11:00-01:00
            <br />
            Sun: 12:00-22:00
          </p>
        </div>
        <div>
          <h3 className="mb-3 text-xl">Social Links</h3>
          <div className="flex gap-4 text-sm uppercase tracking-[0.18em]">
            <Link href="/" className="transition-colors hover:text-brand-orange">
              Instagram
            </Link>
            <Link href="/" className="transition-colors hover:text-brand-orange">
              Facebook
            </Link>
            <Link href="/" className="transition-colors hover:text-brand-orange">
              TikTok
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  )
}
