import { HTMLAttributes, ReactNode } from "react"

type SectionProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode
}

export default function Section({
  children,
  className = "",
  ...props
}: SectionProps) {
  return (
    <section className={`py-24 lg:py-32 ${className}`.trim()} {...props}>
      {children}
    </section>
  )
}
