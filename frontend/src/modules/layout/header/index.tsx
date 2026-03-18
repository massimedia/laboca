import Link from "next/link"

import Container from "@modules/ui/components/container"

const navItems = [
  { href: "/menu", label: "Menu" },
  { href: "/catering", label: "Catering" },
  { href: "/events", label: "Events" },
  { href: "/cart", label: "Cart" },
]

export default function Header() {
  return (
    <header className="border-b border-brand-charcoal/10 bg-brand-cream/95 backdrop-blur">
      <Container className="flex items-center justify-between gap-6 py-5">
        <Link
          href="/"
          className="font-display text-3xl tracking-[0.2em] text-brand-red"
        >
          LABOCA
        </Link>
        <nav aria-label="Primary navigation">
          <ul className="flex flex-wrap items-center gap-6 text-sm uppercase tracking-[0.18em]">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="transition-colors hover:text-brand-orange"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </header>
  )
}
