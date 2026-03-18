import { ReactNode } from "react"

type GridProps = {
  children: ReactNode
  className?: string
}

export default function Grid({ children, className = "" }: GridProps) {
  return (
    <div
      className={`grid grid-cols-1 gap-10 md:grid-cols-2 xl:grid-cols-4 lg:gap-12 ${className}`.trim()}
    >
      {children}
    </div>
  )
}
