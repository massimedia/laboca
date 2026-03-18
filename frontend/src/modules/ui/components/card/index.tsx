import { ReactNode } from "react"

type CardProps = {
  children: ReactNode
  title: string
}

export default function Card({ title, children }: CardProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">{title}</h3>
      <div>{children}</div>
    </div>
  )
}
