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
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRequest } from "@/hooks/use-request";
import { fetchCoachingRelationshipsWithUserNames } from "@/lib/api/coaching-relationships";
import { fetchCoachingSessions } from "@/lib/api/coaching-sessions";
import { fetchOrganizationsByUserId } from "@/lib/api/organizations";
import { useAppStateStore } from "@/lib/providers/app-state-store-provider";
import { CoachingSession } from "@/types/coaching-session";
import { CoachingRelationshipWithUserNames } from "@/types/coaching_relationship_with_user_names";
import { Id } from "@/types/general";
import { Organization } from "@/types/organization";
import Link from "next/link";
import { useEffect, useState } from "react";
import { DateTime } from "ts-luxon";

export interface CoachingSessionProps {
  /** The current logged in user's Id */
  userId: Id;
}

export function SelectCoachingSession({
  userId: userId,
  ...props
}: CoachingSessionProps) {
  const { organizationId, setOrganizationId } = useAppStateStore(
    (state) => state
  );
  const { relationshipId, setRelationshipId } = useAppStateStore(
    (state) => state
  );
  const { coachingSessionId, setCoachingSessionId } = useAppStateStore(
    (state) => state
  );

  const endpoints = [
    `/organizations/${userId}`,
    `/coaching-relationships/${organizationId}`,
    `/coaching-sessions/${relationshipId}`,
  ];

  const { data: [organizations, coachingRelationships, coachingSessions] = [[], [], []], error, isLoading, mutate } = useRequest<
    [Organization[], CoachingRelationshipWithUserNames[], CoachingSession[]]
  >(endpoints);

  const coachingSessionsArray = coachingSessions as CoachingSession[];

  const coachingRelationshipsArray = coachingRelationships as CoachingRelationshipWithUserNames[];

  const organizationsArray = organizations as Organization[];

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
            value={organizationId}
            onValueChange={setOrganizationId}
          >
            <SelectTrigger id="organization">
              <SelectValue placeholder="Select organization" />
            </SelectTrigger>
            <SelectContent>
              {organizationsArray.map((organization) => (
                <SelectItem value={organization.id} key={organization.id}>
                  {organization.name}
                </SelectItem>
              ))}
              {organizationsArray && (
                <SelectItem disabled={true} value="none">
                  None found
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="relationship">Relationship</Label>
          <Select
            defaultValue="caleb"
            disabled={!organizationId}
            value={relationshipId}
            onValueChange={setRelationshipId}
          >
            <SelectTrigger id="relationship">
              <SelectValue placeholder="Select coaching relationship" />
            </SelectTrigger>
            <SelectContent>
              {coachingRelationshipsArray.map((relationship) => (
                <SelectItem value={relationship.id} key={relationship.id}>
                  {relationship.coach_first_name} {relationship.coach_last_name}{" "}
                  -&gt; {relationship.coachee_first_name}{" "}
                  {relationship.coachee_last_name}
                </SelectItem>
              ))}
              {coachingRelationshipsArray.length == 0 && (
                <SelectItem disabled={true} value="none">
                  None found
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="session">Coaching Session</Label>
          <Select
            defaultValue="today"
            disabled={!relationshipId}
            value={coachingSessionId}
            onValueChange={setCoachingSessionId}
          >
            <SelectTrigger id="session">
              <SelectValue placeholder="Select coaching session" />
            </SelectTrigger>
            <SelectContent>
              {coachingSessionsArray.some(
                (session) => session.date < DateTime.now()
              ) && (
                  <SelectGroup>
                    <SelectLabel>Previous Sessions</SelectLabel>
                    {coachingSessionsArray
                      .filter((session) => session.date < DateTime.now())
                      .map((session) => (
                        <SelectItem value={session.id} key={session.id}>
                          {session.date.toLocaleString(DateTime.DATETIME_FULL)}
                        </SelectItem>
                      ))}
                  </SelectGroup>
                )}
              {coachingSessionsArray.some(
                (session) => session.date >= DateTime.now()
              ) && (
                  <SelectGroup>
                    <SelectLabel>Upcoming Sessions</SelectLabel>
                    {coachingSessionsArray
                      .filter((session) => session.date >= DateTime.now())
                      .map((session) => (
                        <SelectItem value={session.id} key={session.id}>
                          {session.date.toLocaleString(DateTime.DATETIME_FULL)}
                        </SelectItem>
                      ))}
                  </SelectGroup>
                )}
              {coachingSessionsArray.length == 0 && (
                <SelectItem disabled={true} value="none">
                  None found
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          variant="outline"
          className="w-full"
          disabled={!coachingSessionId}
        >
          <Link href={`/coaching-sessions/${coachingSessionId}`}>Join</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
