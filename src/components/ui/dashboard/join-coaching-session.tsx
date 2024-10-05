import React from "react";
import { useAppStateStore } from "@/lib/providers/app-state-store-provider";
import { Id } from "@/types/general";
import { DynamicApiSelect } from "./dynamic-api-select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Organization } from "@/types/organization";
import { CoachingRelationshipWithUserNames } from "@/types/coaching_relationship_with_user_names";
import {
  CoachingSession,
  getCoachingSessionById,
} from "@/types/coaching-session";
import { DateTime } from "ts-luxon";
import { Label } from "@/components/ui/label";
import { Button } from "../button";
import Link from "next/link";
import { fetchOrganization } from "@/lib/api/organizations";
import { fetchCoachingRelationshipWithUserNames } from "@/lib/api/coaching-relationships";
import { fetchCoachingSessions } from "@/lib/api/coaching-sessions";

export interface CoachingSessionCardProps {
  userId: Id;
}

export function JoinCoachingSession({
  userId: userId,
}: CoachingSessionCardProps) {
  const { setOrganizationId } = useAppStateStore((state) => ({
    setOrganizationId: state.setOrganizationId,
  }));
  const { setRelationshipId } = useAppStateStore((state) => ({
    setRelationshipId: state.setRelationshipId,
  }));
  const { setCoachingSessionId } = useAppStateStore((state) => ({
    setCoachingSessionId: state.setCoachingSessionId,
  }));
  const { organization, setOrganization } = useAppStateStore((state) => ({
    organization: state.organization,
    setOrganization: state.setOrganization,
  }));
  const { relationship, setRelationship } = useAppStateStore((state) => ({
    relationship: state.coachingRelationship,
    setRelationship: state.setCoachingRelationship,
  }));
  const { coachingSession, setCoachingSession } = useAppStateStore((state) => ({
    coachingSession: state.coachingSession,
    setCoachingSession: state.setCoachingSession,
  }));
  const FROM_DATE = DateTime.now().minus({ month: 1 }).toISODate();
  const TO_DATE = DateTime.now().plus({ month: 1 }).toISODate();

  const handleOrganizationSelection = (id: Id) => {
    fetchOrganization(id)
      .then((organization) => {
        setOrganizationId(organization.id);
        setOrganization(organization);
      })
      .catch((err) => {
        console.error("Failed to retrieve and set organization: " + err);
      });
  };

  const handleRelationshipSelection = (id: Id) => {
    fetchCoachingRelationshipWithUserNames(organization.id, id)
      .then((relationship) => {
        setRelationshipId(relationship.id);
        setRelationship(relationship);
      })
      .catch((err) => {
        console.error("Failed to retrieve and set relationship: " + err);
      });
  };

  const handleSessionSelection = (id: Id) => {
    fetchCoachingSessions(relationship.id)
      .then((sessions) => {
        const session = getCoachingSessionById(id, sessions);
        setCoachingSessionId(session.id);
        setCoachingSession(session);
      })
      .catch((err) => {
        console.error("Failed to retrieve and set relationship: " + err);
      });
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
            getOptionValue={(org) => org.id} // FIXME: this doesn't seem to display the currently selected organization when the page loads and the org.id is set
            elementId="organization-selector"
          />
        </div>
        {organization.id.length > 0 && (
          <div className="grid gap-2">
            <Label htmlFor="relationship-selector">Relationship</Label>

            <DynamicApiSelect<CoachingRelationshipWithUserNames>
              url={`/organizations/${organization.id}/coaching_relationships`}
              params={{ organizationId: organization.id }}
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
        {relationship.id.length > 0 && (
          <div className="grid gap-2">
            <Label htmlFor="session-selector">Coaching Session</Label>

            <DynamicApiSelect<CoachingSession>
              url="/coaching_sessions"
              params={{
                coaching_relationship_id: relationship.id,
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
        {coachingSession.id.length > 0 && (
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
