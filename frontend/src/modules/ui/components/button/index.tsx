import { ButtonHTMLAttributes, ReactNode } from "react"

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
  variant?: "primary" | "secondary"
}

const variants = {
  primary:
    "bg-brand-red text-white hover:bg-brand-orange transition rounded-lg px-6 py-3",
  secondary:
    "border border-brand-charcoal text-brand-charcoal rounded-lg px-6 py-3",
}

export default function Button({
  children,
  className = "",
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`${variants[variant]} ${className}`.trim()}
      type="button"
      {...props}
    >
      {children}
    </button>
  )
}
