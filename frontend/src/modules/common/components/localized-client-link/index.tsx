"use client"

import Link from "next/link"
import React from "react"

export default function LocalizedClientLink({
  href,
  children,
  ...props
}: {
  children?: React.ReactNode
  href: string
  className?: string
  onClick?: () => void
  passHref?: true
  [x: string]: any
}) {
  return (
    <Link href={href} {...props}>
      {children}
    </Link>
  )
}
