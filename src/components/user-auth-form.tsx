"use client"

import * as React from "react"

import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils"
import { Icons } from "@/components/ui/icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [email, setEmail] = React.useState<string>('')
  const [password, setPassword] = React.useState<string>('')

  async function login(event: React.SyntheticEvent) {
    event.preventDefault()
    setIsLoading(true)

    console.log("email: ", email)
    console.log("password: ", password)

    console.log("Submitting login form with a POST request")

    const credentials = new URLSearchParams();
    credentials.append('email', email);
    credentials.append('password', password);

    console.log("credentials from form URL encoded: ", credentials)

    await fetch("http://localhost:4000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      cache: "default",
      body: credentials
    })
    .then(response => {
      const isJson = response.headers.get('content-type')?.includes('application/json');
      const data = isJson ? response.json() : null;

      if (!response.ok) {
        console.error("HTTP response !ok, status: ", response.status)
        if (response.status == 401) {
          console.error("Login failed: UNAUTHORIZED");
        }
        return Promise.reject(response)
      }

      console.log("fetch response.status: ", response.status)
      console.log("fetch response.statusText: ", response.statusText)

      setTimeout(() => {
        setIsLoading(false)
      }, 3000)

      router.push("/dashboard")
    })
    .catch (error => {
      console.error("Fetch Error: failed to POST to /login on the backend.", error)
    })

    setTimeout(() => {
      setIsLoading(false)
    }, 3000)

  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={login}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              name="email"
              placeholder="name@example.com"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              required
              disabled={isLoading}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="password">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              name="password"
              autoCapitalize="none"
              autoCorrect="off"
              required
              disabled={isLoading}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button disabled={isLoading}>
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Sign In with Email
          </Button>
        </div>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <Button variant="outline" type="button" disabled={isLoading}>
        {isLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.gitHub className="mr-2 h-4 w-4" />
        )}{" "}
        GitHub
      </Button>
    </div>
  )
}
