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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchOrganizationsByUserId } from "@/lib/api/organizations";
import { Organization, defaultOrganizations } from "@/types/organization";
import { useEffect, useState } from "react";

export interface CoachingSessionProps {
  /** The current logged in user's UUID */
  userUUID: string;
}

export function SelectCoachingSession({
  userUUID,
  ...props
}: CoachingSessionProps) {
  const [organizationSelection, setOrganizationSelection] =
    useState<string>("");
  const [relationshipSelection, setRelationshipSelection] =
    useState<string>("");
  const [coachSessionSelection, setCoachingSessionSelection] =
    useState<string>("");

  const handleOrganizationSelectionChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setOrganizationSelection(event.target.value);
  };

  const handleRelationshipSelectionChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setRelationshipSelection(event.target.value);
  };

  const handleCoachingSessionChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setCoachingSessionSelection(event.target.value);
  };

  const [organizations, setOrganizations] = useState<Organization[]>(
    defaultOrganizations()
  );
  useEffect(() => {
    async function loadOrganizations() {
      if (!userUUID) return;

      await fetchOrganizationsByUserId(userUUID)
        .then(([orgs]) => {
          setOrganizations(orgs);
        })
        .catch(([err]) => {
          console.error("Failed to fetch Organizations: " + err);
        });
    }
    loadOrganizations();
  }, [userUUID]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Join a Coaching Session</CardTitle>
        <CardDescription>
          Select current organization, relationship and session
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="organization">Organization</Label>
          <Select
            defaultValue="0"
            value={organizationSelection}
            onValueChange={setOrganizationSelection}
          >
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
          <Select
            defaultValue="caleb"
            disabled={!organizationSelection}
            value={relationshipSelection}
            onValueChange={setRelationshipSelection}
          >
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
          <Select
            defaultValue="today"
            disabled={!relationshipSelection}
            value={coachSessionSelection}
            onValueChange={setCoachingSessionSelection}
          >
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
        <Button
          variant="outline"
          className="w-full"
          disabled={!coachSessionSelection}
        >
          Join
        </Button>
      </CardFooter>
    </Card>
  );
}
