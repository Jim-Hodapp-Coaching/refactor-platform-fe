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
import { useAppStateStore } from "@/lib/providers/app-state-store-provider";
import {
  CoachingSession,
  coachingSessionToString,
  getCoachingSessionById,
} from "@/types/coaching-session";
import {
  CoachingRelationshipWithUserNames,
  coachingRelationshipWithUserNamesToString,
  getCoachingRelationshipById,
} from "@/types/coaching_relationship_with_user_names";
import { getDateTimeFromString, Id } from "@/types/general";
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
  const { coachingRelationship, setCoachingRelationship } = useAppStateStore(
    (state) => state
  );
  const { coachingSessionId, setCoachingSessionId } = useAppStateStore(
    (state) => state
  );
  const { coachingSession, setCoachingSession } = useAppStateStore(
    (state) => state
  );

  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [coachingRelationships, setCoachingRelationships] = useState<
    CoachingRelationshipWithUserNames[]
  >([]);
  const [coachingSessions, setCoachingSessions] = useState<CoachingSession[]>(
    []
  );

  useEffect(() => {
    async function loadOrganizations() {
      if (!userId) return;

      await fetchOrganizationsByUserId(userId)
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
  }, [userId]);

  useEffect(() => {
    async function loadCoachingRelationships() {
      if (!organizationId) return;

      console.debug("organizationId: " + organizationId);

      await fetchCoachingRelationshipsWithUserNames(organizationId)
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
  }, [organizationId]);

  useEffect(() => {
    async function loadCoachingSessions() {
      if (!organizationId) return;

      await fetchCoachingSessions(relationshipId)
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
  }, [relationshipId]);

  const handleSetCoachingRelationship = (coachingRelationshipId: string) => {
    setRelationshipId(coachingRelationshipId);
    const coachingRelationship = getCoachingRelationshipById(
      coachingRelationshipId,
      coachingRelationships
    );
    console.debug(
      "coachingRelationship: " +
        coachingRelationshipWithUserNamesToString(coachingRelationship)
    );
    setCoachingRelationship(coachingRelationship);
  };

  const handleSetCoachingSession = (coachingSessionId: string) => {
    setCoachingSessionId(coachingSessionId);
    const coachingSession = getCoachingSessionById(
      coachingSessionId,
      coachingSessions
    );
    console.debug(
      "coachingSession: " + coachingSessionToString(coachingSession)
    );
    setCoachingSession(coachingSession);
  };

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
              {organizations.map((organization) => (
                <SelectItem value={organization.id} key={organization.id}>
                  {organization.name}
                </SelectItem>
              ))}
              {organizations.length == 0 && (
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
            onValueChange={handleSetCoachingRelationship}
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
              {coachingRelationships.length == 0 && (
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
            onValueChange={handleSetCoachingSession}
          >
            <SelectTrigger id="session">
              <SelectValue placeholder="Select coaching session" />
            </SelectTrigger>
            <SelectContent>
              {coachingSessions.some(
                (session) =>
                  getDateTimeFromString(session.date) < DateTime.now()
              ) && (
                <SelectGroup>
                  <SelectLabel>Previous Sessions</SelectLabel>
                  {coachingSessions
                    .filter(
                      (session) =>
                        getDateTimeFromString(session.date) < DateTime.now()
                    )
                    .map((session) => (
                      <SelectItem value={session.id} key={session.id}>
                        {getDateTimeFromString(session.date).toLocaleString(
                          DateTime.DATETIME_FULL
                        )}
                      </SelectItem>
                    ))}
                </SelectGroup>
              )}
              {coachingSessions.some(
                (session) =>
                  getDateTimeFromString(session.date) >= DateTime.now()
              ) && (
                <SelectGroup>
                  <SelectLabel>Upcoming Sessions</SelectLabel>
                  {coachingSessions
                    .filter(
                      (session) =>
                        getDateTimeFromString(session.date) >= DateTime.now()
                    )
                    .map((session) => (
                      <SelectItem value={session.id} key={session.id}>
                        {getDateTimeFromString(session.date).toLocaleString(
                          DateTime.DATETIME_FULL
                        )}
                      </SelectItem>
                    ))}
                </SelectGroup>
              )}
              {coachingSessions.length == 0 && (
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
