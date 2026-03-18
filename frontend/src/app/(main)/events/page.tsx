import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Events",
  description: "Upcoming LABOCA events and specials.",
}

export default function EventsPage() {
  return (
    <div className="content-container py-16">
      <h1 className="mb-4 font-display text-3xl tracking-[0.2em] text-brand-red">
        EVENTS
      </h1>
      <p className="max-w-xl text-sm text-brand-charcoal/80">
        Our events page is coming soon. Check back later for tastings,
        pop-ups, and special LABOCA experiences.
      </p>
    </div>
  )
}

