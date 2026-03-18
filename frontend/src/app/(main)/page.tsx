import { Metadata } from "next"

import Hero from "@modules/ui/components/hero"

export const metadata: Metadata = {
  title: "LABOCA",
  description: "A modern Latin hangout serving empanadas, wine, and good vibes.",
}

export default function Home() {
  return (
    <>
      <Hero />
    </>
  )
}
