import React from "react";
import { useAppStateStore } from "@/lib/providers/app-state-store-provider";
import { Id } from "@/types/general";
import { DynamicApiSelect } from "./dynamic-api-select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Organization } from "@/types/organization";
import { CoachingRelationshipWithUserNames } from "@/types/coaching_relationship_with_user_names";
import {
  CoachingSession,
} from "@/types/coaching-session";
import { DateTime } from "ts-luxon";
import { Label } from "@/components/ui/label";
import { Button } from "../button";
import Link from "next/link";

export interface CoachingSessionCardProps {
  userId: Id;
}

export function JoinCoachingSession({
  userId: userId,
}: CoachingSessionCardProps) {

  const FROM_DATE = DateTime.now().minus({ month: 1 }).toISODate();
  const TO_DATE = DateTime.now().plus({ month: 1 }).toISODate();

  const {
    organization,
    organizationId,
    relationship,
    relationshipId,
    coachingSession,
    coachingSessionId,
    setOrganizationId,
    setRelationshipId,
    setCoachingSessionId
  } = useAppStateStore(state => ({
    organization: state.setOrganization,
    organizationId: state.organizationId,
    relationship: state.setCoachingRelationship,
    relationshipId: state.relationshipId,
    coachingSession: state.setCoachingSession,
    coachingSessionId: state.coachingSessionId,
    setOrganizationId: state.setOrganizationId,
    setRelationshipId: state.setRelationshipId,
    setCoachingSessionId: state.setCoachingSessionId
  }));

  const handleOrganizationSelection = (value: string) => {
    setOrganizationId(value);
    setRelationshipId;
    setCoachingSessionId;
  }

  const handleRelationshipSelection = (value: string) => {
    setRelationshipId(value);
    setCoachingSessionId;
  }

  const handleSessionSelection = (value: string) => {
    setCoachingSessionId(value);
  }

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
            getOptionValue={(org) => org.id} // FIXME: this doesn't seem to display the currently selected organization when the page loads and the org.id is set
            elementId="organization-selector"
          />
        </div>
        {organizationId.length > 0 && (
          <div className="grid gap-2">
            <Label htmlFor="relationship-selector">Relationship</Label>

            <DynamicApiSelect<CoachingRelationshipWithUserNames>
              url={`/organizations/${organizationId}/coaching_relationships`}
              params={{ organizationId: organizationId }}
              onChange={handleRelationshipSelection}
              placeholder="Select coaching relationship"
              getOptionLabel={(relationship) =>
                `${relationship.coach_first_name} ${relationship.coach_last_name} -> ${relationship.coachee_first_name} ${relationship.coach_last_name}`
              }
              getOptionValue={(relationship) => relationship.id}
              elementId="relationship-selector"
            />
          </div>
        )}
        {relationshipId.length > 0 && (
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
              getOptionLabel={(session) => session.date}
              getOptionValue={(session) => session.id}
              elementId="session-selector"
              groupByDate={true}
            />
          </div>
        )}
        {coachingSessionId.length > 0 && (
          <div className="grid gap-2">
            <Button variant="outline" className="w-full">
              <Link href={`/coaching-sessions/${coachingSessionId}`}>
                Join Session
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
