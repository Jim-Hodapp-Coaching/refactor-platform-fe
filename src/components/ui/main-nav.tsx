"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { siteConfig } from "@/site.config.ts"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/ui/icons"
import { buttonVariants } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function MainNav() {
  const pathname = usePathname()

  return (
    <div className="mr-4 hidden md:flex">
      <Link href="/" className="mr-6 flex items-center space-x-2">
        <div
          className={cn(
            buttonVariants({
              variant: "ghost",
            }),
            "w-9 px-0"
          )}
        >
          <Icons.refactor_logo className="h-4 w-4" />
          <span className="sr-only">Refactor</span>
        </div>
        <span className="hidden font-bold sm:inline-block">
          {siteConfig.name}
        </span>
      </Link>
    </div>
  )
}
