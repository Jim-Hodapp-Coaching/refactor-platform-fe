import React, { useState } from "react";
import { useAppStateStore } from "@/lib/providers/app-state-store-provider";
import { Id } from "@/types/general";
import { DynamicApiSelect } from "./dynamic-api-select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Organization } from "@/types/organization";
import { CoachingRelationshipWithUserNames } from "@/types/coaching_relationship_with_user_names";
import { CoachingSession } from "@/types/coaching-session";
import { DateTime } from "ts-luxon";
import { Label } from "@/components/ui/label";
import { Button } from "../button";
import Link from "next/link";
import { fetchCoachingRelationshipWithUserNames } from "@/lib/api/coaching-relationships";

export interface CoachingSessionCardProps {
  userId: Id;
}

export function JoinCoachingSession({
  userId: userId,
}: CoachingSessionCardProps) {
  const setOrganizationId = useAppStateStore(
    (state) => state.setOrganizationId
  );
  const setRelationshipId = useAppStateStore(
    (state) => state.setRelationshipId
  );
  const setCoachingSessionId = useAppStateStore(
    (state) => state.setCoachingSessionId
  );

  const setCoachingRelationship = useAppStateStore(
    (state) => state.setCoachingRelationship
  );
  const [organizationId, setOrganization] = useState<string | null>(null);
  const [relationshipId, setRelationship] = useState<string | null>(null);
  const [sessionId, setSessions] = useState<string | null>(null);
  const FROM_DATE = DateTime.now().minus({ month: 1 }).toISODate();
  const TO_DATE = DateTime.now().plus({ month: 1 }).toISODate();

  const handleOrganizationSelection = (value: string) => {
    setOrganization(value);
    setRelationship(null);
    setSessions(null);
    setOrganizationId(value);
  };

  const handleRelationshipSelection = (value: Id) => {
    setRelationship(value);
    setSessions(null);
    setRelationshipId(value);
    if (organizationId) {
      fetchCoachingRelationshipWithUserNames(organizationId, value).then(
        (relationship) => {
          setRelationshipId(relationship.id);
          setCoachingRelationship(relationship);
        }
      );
    }
  };

  const handleSessionSelection = (value: string) => {
    setSessions(value);
    setCoachingSessionId(value);
  };

  return (
    <Card className="w-[300px]">
      <CardHeader>
        <CardTitle>Join a Coaching Session</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="organization-selector">Organization</Label>

          <DynamicApiSelect<Organization>
            url="/organizations"
            params={{ userId }}
            onChange={handleOrganizationSelection}
            placeholder="Select an organization"
            getOptionLabel={(org) => org.name}
            getOptionValue={(org) => org.id.toString()}
            elementId="organization-selector"
          />
        </div>
        {organizationId && (
          <div className="grid gap-2">
            <Label htmlFor="relationship-selector">Relationship</Label>

            <DynamicApiSelect<CoachingRelationshipWithUserNames>
              url={`/organizations/${organizationId}/coaching_relationships`}
              params={{ organizationId }}
              onChange={handleRelationshipSelection}
              placeholder="Select coaching relationship"
              getOptionLabel={(relationship) =>
                `${relationship.coach_first_name} ${relationship.coach_last_name} -> ${relationship.coachee_first_name} ${relationship.coach_last_name}`
              }
              getOptionValue={(relationship) => relationship.id.toString()}
              elementId="relationship-selector"
            />
          </div>
        )}
        {relationshipId && (
          <div className="grid gap-2">
            <Label htmlFor="session-selector">Coaching Session</Label>

            <DynamicApiSelect<CoachingSession>
              url="/coaching_sessions"
              params={{
                coaching_relationship_id: relationshipId,
                from_date: FROM_DATE,
                to_Date: TO_DATE,
              }}
              onChange={handleSessionSelection}
              placeholder="Select coaching session"
              getOptionLabel={(session) => session.date.toString()}
              getOptionValue={(session) => session.id.toString()}
              elementId="session-selector"
              groupByDate={true}
            />
          </div>
        )}
        {sessionId && (
          <div className="grid gap-2">
            <Button variant="outline" className="w-full">
              <Link href={`/coaching-sessions/${sessionId}`}>Join Session</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
