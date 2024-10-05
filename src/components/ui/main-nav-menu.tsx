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

import { ChevronDownIcon } from "@radix-ui/react-icons";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAppStateStore } from "@/lib/providers/app-state-store-provider";

export function MainNavMenu() {
  const [open, setIsOpen] = React.useState(false);
  const { organization } = useAppStateStore((state) => state);

  return (
    <>
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>
              <span className="hidden font-bold sm:inline-block">
                {/* FIXME: Replace "Refactor" with something from siteConfig or something else */}
                {organization.name.length > 0 ? organization.name : "Refactor"}
              </span>
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-3 p-6 md:w-[500px] lg:w-[600px] lg:grid-cols-[.75fr_1fr]">
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
                        Professional software engineer coaching.
                      </p>
                    </a>
                  </NavigationMenuLink>
                </li>

                <Card>
                  <CardHeader>
                    <CardTitle>Organization & Relationship</CardTitle>
                    <CardDescription>
                      Set your current organization and coaching relationship.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-6">
                    <div className="flex items-center justify-between space-x-4">
                      <div className="flex items-center space-x-4">
                        <div>
                          <p className="text-sm font-medium leading-none">
                            Organization
                          </p>
                        </div>
                      </div>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="ml-auto">
                            Owner{" "}
                            <ChevronDownIcon className="ml-2 h-4 w-4 text-muted-foreground" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="p-0" align="end">
                          <Command>
                            <CommandInput placeholder="Select new role..." />
                            <CommandList>
                              <CommandEmpty>No roles found.</CommandEmpty>
                              <CommandGroup>
                                <CommandItem className="teamaspace-y-1 flex flex-col items-start px-4 py-2">
                                  <p>Viewer</p>
                                  <p className="text-sm text-muted-foreground">
                                    Can view and comment.
                                  </p>
                                </CommandItem>
                                <CommandItem className="teamaspace-y-1 flex flex-col items-start px-4 py-2">
                                  <p>Developer</p>
                                  <p className="text-sm text-muted-foreground">
                                    Can view, comment and edit.
                                  </p>
                                </CommandItem>
                                <CommandItem className="teamaspace-y-1 flex flex-col items-start px-4 py-2">
                                  <p>Billing</p>
                                  <p className="text-sm text-muted-foreground">
                                    Can view, comment and manage billing.
                                  </p>
                                </CommandItem>
                                <CommandItem className="teamaspace-y-1 flex flex-col items-start px-4 py-2">
                                  <p>Owner</p>
                                  <p className="text-sm text-muted-foreground">
                                    Admin-level access to all resources.
                                  </p>
                                </CommandItem>
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="flex items-center justify-between space-x-4">
                      <div className="flex items-center space-x-4">
                        <div>
                          <p className="text-sm font-medium leading-none">
                            Relationship
                          </p>
                        </div>
                      </div>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="ml-auto">
                            Member{" "}
                            <ChevronDownIcon className="ml-2 h-4 w-4 text-muted-foreground" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="p-0" align="end">
                          <Command>
                            <CommandInput placeholder="Select new role..." />
                            <CommandList>
                              <CommandEmpty>No roles found.</CommandEmpty>
                              <CommandGroup className="p-1.5">
                                <CommandItem className="teamaspace-y-1 flex flex-col items-start px-4 py-2">
                                  <p>Viewer</p>
                                  <p className="text-sm text-muted-foreground">
                                    Can view and comment.
                                  </p>
                                </CommandItem>
                                <CommandItem className="teamaspace-y-1 flex flex-col items-start px-4 py-2">
                                  <p>Developer</p>
                                  <p className="text-sm text-muted-foreground">
                                    Can view, comment and edit.
                                  </p>
                                </CommandItem>
                                <CommandItem className="teamaspace-y-1 flex flex-col items-start px-4 py-2">
                                  <p>Billing</p>
                                  <p className="text-sm text-muted-foreground">
                                    Can view, comment and manage billing.
                                  </p>
                                </CommandItem>
                                <CommandItem className="teamaspace-y-1 flex flex-col items-start px-4 py-2">
                                  <p>Owner</p>
                                  <p className="text-sm text-muted-foreground">
                                    Admin-level access to all resources.
                                  </p>
                                </CommandItem>
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </CardContent>
                </Card>

                {/* <ListItem
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
                </ListItem> */}
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
