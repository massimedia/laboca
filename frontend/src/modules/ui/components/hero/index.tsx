import Button from "@modules/ui/components/button"
import Container from "@modules/ui/components/container"
import Grid from "@modules/ui/components/grid"
import Section from "@modules/ui/components/section"

export default function Hero() {
  return (
    <Section className="overflow-hidden bg-brand-cream">
      <Container>
        <Grid>
          <div className="space-y-8 lg:col-span-3">
            <div className="space-y-6">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-teal">
                LABOCA Storefront
              </p>
              <h1 className="max-w-4xl text-5xl font-bold leading-[0.95] lg:text-7xl">
                Empanadas • Wine • Friends
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-brand-charcoal/70">
                A modern Latin hangout serving handcrafted empanadas, natural
                wine and good vibes in a warm editorial setting.
              </p>
            </div>
            <div>
              <Button>Explore the Menu</Button>
            </div>
          </div>
          <div className="flex items-end lg:justify-end">
            <div className="w-full rounded-[2rem] bg-brand-charcoal p-8 text-brand-cream">
              <p className="text-sm uppercase tracking-[0.25em] text-brand-orange">
                House Notes
              </p>
              <p className="mt-4 text-2xl leading-tight">
                Shared plates, late pours, and a room built for long evenings.
              </p>
            </div>
          </div>
        </Grid>
      </Container>
    </Section>
  )
}
