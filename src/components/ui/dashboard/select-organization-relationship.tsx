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
import { fetchRelationshipsByOrganizationId } from "@/lib/api/coaching-relationships";
import { fetchOrganizationsByUserId } from "@/lib/api/organizations";
import { Id } from "@/types/general";
import { Organization, defaultOrganizations } from "@/types/organization";
import { useEffect, useState } from "react";

const SelectOrganizationRelationship = ({
  userUUID,
  ...props
}: OrganizationRelationshipProps) => {
  const [organizations, setOrganizations] = useState<Organization[]>(
    defaultOrganizations()
  );
  const [selectedOrganization, setSelectedOrganization] = useState<string>("");

  /** Asynchronously load up all organizations associated with the currently
   * logged in user by userUUID */
  useEffect(() => {
    async function loadOrganizations() {
      await fetchOrganizationsByUserId(userUUID)
        .then(function ([orgs]) {
          // console.debug("Organizations: " + JSON.stringify(orgs));
          setOrganizations(orgs);
        })
        .catch(function ([err]) {
          console.error("Failed to fetch Organizations: " + err);
        });
    }
    loadOrganizations();
  }, []);

  function handleOrganizationSelectionChange(organizationId: Id) {
    console.log("organizationId: " + organizationId);
    setSelectedOrganization(organizationId);
    fetchRelationshipsByOrganizationId(organizationId);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Organization Relationship</CardTitle>
        <CardDescription>Select current organization & coachee</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="organization">Organization</Label>
          <Select
            defaultValue="0"
            value={selectedOrganization}
            onValueChange={handleOrganizationSelectionChange}
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
          <Label htmlFor="relationship">Coachee</Label>
          <Select defaultValue="caleb">
            <SelectTrigger id="relationship">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="caleb">Caleb Bourg</SelectItem>
              <SelectItem value="other_coachee">Other Coachee</SelectItem>
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
};

export interface OrganizationRelationshipProps {
  /** The current logged in user's UUID */
  userUUID: string;
}

export { SelectOrganizationRelationship };
