"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { fetchOrganizationsByUserId } from "@/lib/api/organizations";
import { useAuthStore } from "@/lib/providers/auth-store-provider";
import { Organization, defaultOrganizations } from "@/types/organization";
import { useEffect, useState } from "react";

export interface CoachingSessionProps {
  /** The current logged in user's UUID */
  userUUID: string;
}

export function SelectCoachingSession() {
  const [organizations, setOrganizations] = useState<Organization[]>(
    defaultOrganizations()
  );
  const { userUUID } = useAuthStore((state) => state);

  useEffect(() => {
    if (userUUID) {
      fetchOrganizationsByUserId(userUUID)
        .then(([orgs]) => {
          setOrganizations(orgs);
        })
        .catch(([err]) => {
          console.error("Failed to fetch Organizations: " + err);
        });
    }
  }, [userUUID]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Organization Relationship</CardTitle>
        <CardDescription>Select current organization & coachee</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="organization">Organization</Label>
          <Select defaultValue="0">
            <SelectTrigger id="organization">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {organizations.map((organization, index) => (
                <SelectItem value={index.toString()} key={organization.id}>
                  {organization.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="relationship">Relationship</Label>
          <Select defaultValue="caleb">
            <SelectTrigger id="relationship">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="caleb">
                Jim Hodapp -&gt; Caleb Bourg
              </SelectItem>
              <SelectItem value="other_coachee">
                Jim Hodapp -&gt; Other Coachee
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="session">Coaching Session</Label>
          <Select defaultValue="today">
            <SelectTrigger id="session">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today @ 5 pm</SelectItem>
              <SelectItem value="tomorrow">Tomorrow @ 5 pm</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          Apply
        </Button>
      </CardFooter>
    </Card>
  );
}
