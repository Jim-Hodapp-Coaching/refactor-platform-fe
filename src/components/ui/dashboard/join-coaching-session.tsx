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
import { fetchOrganization } from "@/lib/api/organizations";
import { fetchCoachingSessions } from "@/lib/api/coaching-sessions";

export interface CoachingSessionCardProps {
  userId: Id;
}

export function JoinCoachingSession({
  userId: userId,
}: CoachingSessionCardProps) {
  const setOrganization = useAppStateStore((state) => state.setOrganization);
  const setOrganizationId = useAppStateStore(
    (state) => state.setOrganizationId
  );
  let organizationId = useAppStateStore((state) => state.organizationId);

  const setCoachingRelationship = useAppStateStore(
    (state) => state.setCoachingRelationship
  );
  const setRelationshipId = useAppStateStore(
    (state) => state.setRelationshipId
  );
  let relationshipId = useAppStateStore((state) => state.relationshipId);

  const { coachingSession, setCoachingSession } = useAppStateStore((state) => ({
    coachingSession: state.coachingSession,
    setCoachingSession: state.setCoachingSession,
  }));
  const setSessionId = useAppStateStore((state) => state.setCoachingSessionId);

  //@TODO: abstract to state or utility function (apply to preset component)
  const FROM_DATE = DateTime.now().minus({ month: 1 }).toISODate();
  const TO_DATE = DateTime.now().plus({ month: 1 }).toISODate();

  //@TODO: pass selected organization from organization array
  const handleOrganizationSelection = (value: Id) => {
    setOrganizationId(value);
    if (value) {
      fetchOrganization(value).then(([organization]) => {
        organizationId = setOrganization(organization);
      });
    }
  };

  //@TODO: pass selected relationship from relationship array
  const handleRelationshipSelection = (value: Id) => {
    setRelationshipId(value);
    if (value && organizationId) {
      fetchCoachingRelationshipWithUserNames(organizationId, value).then(
        (relationship) => {
          setRelationshipId(relationship.id);
          setCoachingRelationship(relationship);
        }
      );
    }
  };

  const handleSessionSelection = (selectedSession: Id) => {
    if (selectedSession && relationshipId) {
      fetchCoachingSessions(relationshipId).then(([sessions]) => {
        const theSession = sessions.find(
          (session) => session.id === selectedSession
        );
        if (theSession) {
          setCoachingSession(theSession);
          setSessionId(theSession.id);
        }
      });
    }
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
        {coachingSession.id && (
          <div className="grid gap-2">
            <Button variant="outline" className="w-full">
              <Link href={`/coaching-sessions/${coachingSession.id}`}>
                Join Session
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
