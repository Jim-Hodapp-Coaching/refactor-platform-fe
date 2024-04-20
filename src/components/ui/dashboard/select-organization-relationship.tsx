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

export function SelectOrganizationRelationship() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Organization Relationship</CardTitle>
        <CardDescription>Select current organization & coachee</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="organization">Organization</Label>
          <Select defaultValue="jim_hodapp_coaching">
            <SelectTrigger id="organization">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="jim_hodapp_coaching">
                Jim Hodapp Coaching
              </SelectItem>
              <SelectItem value="jims_other_organization">
                Jim's Other Organization
              </SelectItem>
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
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          Apply
        </Button>
      </CardFooter>
    </Card>
  );
}
