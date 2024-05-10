"use client";

import { CommandMenu } from "@/components/ui/command-menu"
import { MainNav } from "@/components/ui/main-nav"
import { MobileNav } from "@/components/ui/mobile-nav"
import { ModeToggle } from "@/components/ui/mode-toggle"
import { UserNav } from "@/components/ui/user-nav"

import { redirect } from 'next/navigation'
import { useAuthStore } from "@/lib/providers/auth-store-provider";

export function SiteHeader() {
  // This must have "use client" at the top, hooks don't work on server components
  // or you'll get a very strange runtime error about useAuthStore() not being a function.
  const { isLoggedIn, userUUID } = useAuthStore(
    (state) => state,
  )

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <MainNav />
        <MobileNav />
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <CommandMenu />
          </div>
          <nav className="flex items-center">
            <ModeToggle />
            {isLoggedIn ? (
              <UserNav />
            ) : (
              <>
                {console.error("User is not logged in, redirecting to login route.")}
                {redirect("/login")}
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}