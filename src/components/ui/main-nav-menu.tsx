"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

import { Dialog } from "@radix-ui/react-dialog";

import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Icons } from "@/components/ui/icons";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { PresetSelector } from "@/components/ui/preset-selector";

import { current, future, past } from "../../data/presets";

export function MainNavMenu() {
  const [open, setIsOpen] = React.useState(false);

  return (
    <>
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>
              <span className="hidden font-bold sm:inline-block">
                {/* TODO: Replace this with currently selected organization's name */}
                Refactor Coaching
              </span>
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                <li className="row-span-3">
                  <NavigationMenuLink asChild>
                    <a
                      className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                      href="/"
                    >
                      <Icons.logo className="h-6 w-6" />
                      <div className="mb-2 mt-4 text-lg font-medium">
                        Refactor Coaching
                      </div>
                      <p className="text-sm leading-tight text-muted-foreground">
                        Beautifully designed components that you can copy and
                        paste into your apps. Accessible. Customizable. Open
                        Source.
                      </p>
                    </a>
                  </NavigationMenuLink>
                </li>
                <ListItem
                  onClick={() => setIsOpen(true)}
                  title="Select Organization"
                >
                  Set your current organization and coaching relationship.
                </ListItem>
                <ListItem href="/docs/installation" title="Installation">
                  How to install dependencies and structure your app.
                </ListItem>
                <ListItem href="/docs/primitives/typography" title="Typography">
                  Styles for headings, paragraphs, lists...etc
                </ListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <Dialog open={open} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Current Organization & Coaching Relationship
            </DialogTitle>
            <DialogDescription>
              Select your current organization and coaching relationship to
              access specific coaching sessions across multiple organizations
              and coaches/coachees.
            </DialogDescription>
          </DialogHeader>
          <div className="py-6 w-full">
            <h4 className="text-sm text-muted-foreground">
              Select Your Organization
            </h4>
            <div className="flex pt-3">
              <PresetSelector current={current} future={future} past={past} />
            </div>
            <h4 className="text-sm text-muted-foreground pt-6">
              Select Your Coaching Relationship
            </h4>
            <div className="flex pt-3">
              <PresetSelector current={current} future={future} past={past} />
            </div>
          </div>
          <DialogFooter>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button variant="secondary" onClick={() => setIsOpen(true)}>
                Set Default
              </Button>
              <Button variant="secondary" onClick={() => setIsOpen(false)}>
                Close
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
