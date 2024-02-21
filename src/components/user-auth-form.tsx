"use client"

import * as React from "react"

import { useRouter } from "next/navigation";

import {AxiosError, AxiosResponse} from 'axios';

import { cn } from "@/lib/utils"
import { Icons } from "@/components/ui/icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const router = useRouter()
  const axios = require('axios');

  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [email, setEmail] = React.useState<string>('')
  const [password, setPassword] = React.useState<string>('')
  const [error, setError] = React.useState<string>('')

  async function login(event: React.SyntheticEvent) {
    event.preventDefault()
    setIsLoading(true)

    console.log("email: ", email)
    console.log("password: ", password)

    console.log("Submitting login form with a POST request")

    const data = await axios.post('http://localhost:4000/login', {
      email: email,
      password: password,
    }, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      setTimeout: 5000, // 5 seconds before timing out trying to log in with the backend
    })
    .then(function (response: AxiosResponse) {
      // handle success
      console.log(response);

      router.push("/coaching-sessions")
    })
    .catch(function (error: AxiosError) {
      // handle error
      console.log(error.response?.status);
      if (error.response?.status == 401) {
        setError('Login failed: unauthorized');
      }
      else{
        console.log(error);
        setError(`Login failed: ${error.message.toLocaleLowerCase}`);
      }
    })
    .finally(function () {
      // always executed
      setTimeout(() => {
        setIsLoading(false)
      }, 3000)
    });
  }

  const updateEmail = (value: string) => {
    setEmail(value)
    setError('');
  };

  const updatePassword = (value: string) => {
    setPassword(value)
    setError('');
  };

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
              onChange={(e) => updateEmail(e.target.value)}
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
              onChange={(e) => updatePassword(e.target.value)}
            />
          </div>
          <Button disabled={isLoading}>
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Sign In with Email
          </Button>
          <p className="text-center text-sm font-semibold text-red-500 text-muted-foreground">
            {error}
          </p>
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
