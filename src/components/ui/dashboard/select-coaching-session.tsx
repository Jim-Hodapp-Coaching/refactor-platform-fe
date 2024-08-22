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
import useRequest from "@/hooks/use-request";
import { useAppStateStore } from "@/lib/providers/app-state-store-provider";
import { CoachingSession } from "@/types/coaching-session";
import { CoachingRelationshipWithUserNames } from "@/types/coaching_relationship_with_user_names";
import { Id } from "@/types/general";
import { Organization } from "@/types/organization";
import { AxiosError } from "axios";
import { set } from "date-fns";
import Link from "next/link";
import { use, useEffect, useState } from "react";
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
    setCoachingSessionId,
  } = useAppStateStore((state) => state);


  const [organizationsData, setOrgData] = useState<null | { organization: Organization[] } | { organization: Organization[]; } | { organization: Organization[]; } | { organization: Organization[]; } | CoachingRelationshipWithUserNames[] | CoachingSession[] | Organization[]>(null);
  const [relationshipsData, setRelationshipsData] = useState<CoachingRelationshipWithUserNames[] | null>(null);
  const [sessionsData, setSessionsData] = useState<CoachingSession[] | null>(null);
  const [isLoading, setIsLoading] = useState(false); // Track loading state
  const [error, setError] = useState<AxiosError<unknown, any> | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true); // Set loading state to true
      setError(null); // Clear previous errors

      try {
        const [
          organizationsResponse,
          coachingRelationshipsResponse,
          coachingSessionsResponse] = await Promise.all([
            useRequest(
              userId ? { url: 'organizations/', params: { userId } } : null
            ),
            useRequest(
              organizationId ? { url: `organizations/${organizationId}/coaching_relationships` } : null
            ),
            useRequest(
              relationshipId ? {
                url: 'coaching-sessions',
                params: {
                  coaching_relationship_id: relationshipId,
                  from_date: DateTime.now().minus({ months: 1 }).toISODate(),
                  to_date: DateTime.now().plus({ months: 1 }).toISODate(),
                },
              } : null
            )
          ]);
        setOrgData(organizationsResponse?.data || null);
        setRelationshipsData(coachingRelationshipsResponse.data as CoachingRelationshipWithUserNames[] || null);
        setSessionsData(coachingSessionsResponse.data as CoachingSession[] || null);
      } catch (error) {
        setError(error as AxiosError || null); // Store error for handling
      } finally {
        setIsLoading(false); // Set loading state to false regardless of success or failure
      }
    };

    fetchData();
  }, [userId]); // Update effect only when userId changes

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
              {isLoading ? (
                <p>Loading</p>
              ) : error ? (
                <p>Error: {error.message}</p>
              ) : (
                (organizationsData as { organization: Organization[] })?.organization.map((organization) => (
                  <SelectItem value={organization.id} key={organization.id}>
                    {organization.name}
                  </SelectItem>
                ))
              )}
              {organizationsData && (
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
              {relationshipsData?.map((relationship) => (
                <SelectItem value={relationship.id} key={relationship.id}>
                  {relationship.coach_first_name} {relationship.coach_last_name} -&gt;{" "}
                  {relationship.coachee_first_name} {relationship.coachee_last_name}
                </SelectItem>
              ))}
              {relationshipsData?.length == 0 && (
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
              {sessionsData?.some((session) => session.date < DateTime.now()) && (
                <SelectGroup>
                  <SelectLabel>Previous Sessions</SelectLabel>
                  {sessionsData
                    .filter((session) => session.date < DateTime.now())
                    .map((session) => (
                      <SelectItem value={session.id} key={session.id}>
                        {session.date.toLocaleString(DateTime.DATETIME_FULL)}
                      </SelectItem>
                    ))}
                </SelectGroup>
              )}
              {sessionsData?.some((session) => session.date >= DateTime.now()) && (
                <SelectGroup>
                  <SelectLabel>Upcoming Sessions</SelectLabel>
                  {sessionsData
                    .filter((session) => session.date >= DateTime.now())
                    .map((session) => (
                      <SelectItem value={session.id} key={session.id}>
                        {session.date.toLocaleString(DateTime.DATETIME_FULL)}
                      </SelectItem>
                    ))}
                </SelectGroup>
              )}
              {sessionsData?.length == 0 && (
                <SelectItem disabled={true} value="none">
                  None found
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
      {/* <CardFooter>
        <Button variant="outline" className="w-full" disabled={!coachingSessionId}>
          <Link href={`/coaching-sessions/${coachingSessionId}`}>Join</Link>
        </Button>
      </CardFooter> */}
    </Card>
  );
}
