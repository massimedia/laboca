import { HTMLAttributes, ReactNode } from "react"

type ContainerProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode
}

export default function Container({
  children,
  className = "",
  ...props
}: ContainerProps) {
  return (
    <div
      className={`max-w-[1600px] mx-auto px-8 lg:px-12 ${className}`.trim()}
      {...props}
    >
      {children}
    </div>
  )
}
