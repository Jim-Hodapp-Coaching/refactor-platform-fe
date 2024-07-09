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
  const {
    organizationId,
    setOrganizationId,
    relationshipId,
    setRelationshipId,
    coachingSessionId,
    setCoachingSessionId
  } = useAppStateStore(
    state => state
  );

  // Fetch organizations
  const {
    data: organizations = [],
    error: organizationsError,
    isLoading: organizationsLoading
  } = useRequest<Organization[]>(userId ? `organizations/${userId}` : '');

  // Fetch coaching relationships
  const { data: coachingRelationships = [], error: relationshipsError, isLoading: relationshipsLoading } = useRequest<CoachingRelationshipWithUserNames[]>(
    organizationId ? `organizations/${organizationId}/coaching_relationships` : ''
  );

  // Fetch coaching sessions
  const { data: coachingSessions = [], error: sessionsError, isLoading: sessionsLoading } = useRequest<CoachingSession[]>(
    organizationId ? 'coaching-sessions' : ''
  );

  // Consolidate error and loading checks
  const hasError = organizationsError || relationshipsError || sessionsError;

  if (hasError) {
    return <div>Error loading data</div>; // Or any other error component
  }

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
              {Array.isArray(organizations) && organizations.map((organization) => (
                <SelectItem value={organization.id} key={organization.id}>
                  {organization.name}
                </SelectItem>
              ))}
              {organizations && (
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
              {coachingRelationships?.map((relationship) => (
                <SelectItem value={relationship.id} key={relationship.id}>
                  {relationship.coach_first_name} {relationship.coach_last_name}{" "}
                  -&gt; {relationship.coachee_first_name}{" "}
                  {relationship.coachee_last_name}
                </SelectItem>
              ))}
              {coachingRelationships?.length == 0 && (
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
              {coachingSessions?.some(
                (session) => session.date < DateTime.now()
              ) && (
                  <SelectGroup>
                    <SelectLabel>Previous Sessions</SelectLabel>
                    {coachingSessions
                      .filter((session) => session.date < DateTime.now())
                      .map((session) => (
                        <SelectItem value={session.id} key={session.id}>
                          {session.date.toLocaleString(DateTime.DATETIME_FULL)}
                        </SelectItem>
                      ))}
                  </SelectGroup>
                )}
              {coachingSessions?.some(
                (session) => session.date >= DateTime.now()
              ) && (
                  <SelectGroup>
                    <SelectLabel>Upcoming Sessions</SelectLabel>
                    {coachingSessions
                      .filter((session) => session.date >= DateTime.now())
                      .map((session) => (
                        <SelectItem value={session.id} key={session.id}>
                          {session.date.toLocaleString(DateTime.DATETIME_FULL)}
                        </SelectItem>
                      ))}
                  </SelectGroup>
                )}
              {coachingSessions?.length == 0 && (
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
