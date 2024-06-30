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
import { fetchCoachingRelationshipsWithUserNames } from "@/lib/api/coaching-relationships";
import { fetchCoachingSessions } from "@/lib/api/coaching-sessions";
import { fetchOrganizationsByUserId } from "@/lib/api/organizations";
import { CoachingSession } from "@/types/coaching-session";
import { CoachingRelationshipWithUserNames } from "@/types/coaching_relationship_with_user_names";
import { Organization } from "@/types/organization";
import Link from "next/link";
import { useEffect, useState } from "react";
import { DateTime } from "ts-luxon";

export interface CoachingSessionProps {
  /** The current logged in user's UUID */
  userUUID: string;
}

export function SelectCoachingSession({
  userUUID,
  ...props
}: CoachingSessionProps) {
  const [organizationUUID, setOrganizationUUID] = useState<string>("");
  const [relationshipUUID, setRelationshipUUID] = useState<string>("");
  const [coachingSessionUUID, setCoachingSessionUUID] = useState<string>("");

  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [coachingRelationships, setCoachingRelationships] = useState<
    CoachingRelationshipWithUserNames[]
  >([]);
  const [coachingSessions, setCoachingSessions] = useState<CoachingSession[]>(
    []
  );

  useEffect(() => {
    async function loadOrganizations() {
      if (!userUUID) return;

      await fetchOrganizationsByUserId(userUUID)
        .then(([orgs]) => {
          // Apparently it's normal for this to be triggered twice in modern
          // React versions in strict + development modes
          // https://stackoverflow.com/questions/60618844/react-hooks-useeffect-is-called-twice-even-if-an-empty-array-is-used-as-an-ar
          console.debug("setOrganizations: " + JSON.stringify(orgs));
          setOrganizations(orgs);
        })
        .catch(([err]) => {
          console.error("Failed to fetch Organizations: " + err);
        });
    }
    loadOrganizations();
  }, [userUUID]);

  useEffect(() => {
    async function loadCoachingRelationships() {
      if (!organizationUUID) return;

      await fetchCoachingRelationshipsWithUserNames(organizationUUID)
        .then(([relationships]) => {
          console.debug(
            "setCoachingRelationships: " + JSON.stringify(relationships)
          );
          setCoachingRelationships(relationships);
        })
        .catch(([err]) => {
          console.error("Failed to fetch coaching relationships: " + err);
        });
    }
    loadCoachingRelationships();
  }, [organizationUUID]);

  useEffect(() => {
    async function loadCoachingSessions() {
      if (!organizationUUID) return;

      await fetchCoachingSessions(relationshipUUID)
        .then(([coaching_sessions]) => {
          console.debug(
            "setCoachingSessions: " + JSON.stringify(coaching_sessions)
          );
          setCoachingSessions(coaching_sessions);
        })
        .catch(([err]) => {
          console.error("Failed to fetch coaching sessions: " + err);
        });
    }
    loadCoachingSessions();
  }, [relationshipUUID]);

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
            value={organizationUUID}
            onValueChange={setOrganizationUUID}
          >
            <SelectTrigger id="organization">
              <SelectValue placeholder="Select organization" />
            </SelectTrigger>
            <SelectContent>
              {organizations.map((organization) => (
                <SelectItem value={organization.id} key={organization.id}>
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
            disabled={!organizationUUID}
            value={relationshipUUID}
            onValueChange={setRelationshipUUID}
          >
            <SelectTrigger id="relationship">
              <SelectValue placeholder="Select coaching relationship" />
            </SelectTrigger>
            <SelectContent>
              {coachingRelationships.map((relationship) => (
                <SelectItem value={relationship.id} key={relationship.id}>
                  {relationship.coach_first_name} {relationship.coach_last_name}{" "}
                  -&gt; {relationship.coachee_first_name}{" "}
                  {relationship.coachee_last_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="session">Coaching Session</Label>
          <Select
            defaultValue="today"
            disabled={!relationshipUUID}
            value={coachingSessionUUID}
            onValueChange={setCoachingSessionUUID}
          >
            <SelectTrigger id="session">
              <SelectValue placeholder="Select coaching session" />
            </SelectTrigger>
            <SelectContent>
              {coachingSessions.some(
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
              {coachingSessions.some(
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
            </SelectContent>
          </Select>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          asChild
          variant="outline"
          className="w-full"
          disabled={!coachingSessionUUID}
        >
          <Link href={`/coaching-sessions/${coachingSessionUUID}`}>Join</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
