import React, { useState, useEffect } from "react";
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

export function JoinCoachingSession({ userId }: CoachingSessionCardProps) {
  const {
    setOrganization,
    setOrganizationId,
    setCoachingRelationship,
    setRelationshipId,
    setCoachingSession,
    setCoachingSessionId,
    organization,
    coachingRelationship,
    coachingSession,
  } = useAppStateStore((state) => ({
    setOrganization: state.setOrganization,
    setOrganizationId: state.setOrganizationId,
    setCoachingRelationship: state.setCoachingRelationship,
    setRelationshipId: state.setRelationshipId,
    setCoachingSession: state.setCoachingSession,
    setCoachingSessionId: state.setCoachingSessionId,
    organization: state.organization,
    coachingRelationship: state.coachingRelationship,
    coachingSession: state.coachingSession,
  }));

  let organizationId = useAppStateStore((state) => state.organizationId);
  let relationshipId = useAppStateStore((state) => state.relationshipId);
  let coachingSessionId = useAppStateStore((state) => state.coachingSessionId);

  const [orgPlaceholder, setOrgPlaceholder] = useState(
    "Select an organization"
  );
  const [relPlaceholder, setRelPlaceholder] = useState(
    "Select coaching relationship"
  );
  const [sessionPlaceholder, setSessionPlaceholder] =
    useState("Select a session");

  useEffect(() => {
    if (organization && organizationId) {
      setOrgPlaceholder(organization.name);
    } else {
      setOrgPlaceholder("Select an organization");
    }
  }, [organization, organizationId]);

  useEffect(() => {
    if (coachingRelationship && relationshipId) {
      setRelPlaceholder(
        `${coachingRelationship.coach_first_name} ${coachingRelationship.coach_last_name} -> ${coachingRelationship.coachee_first_name} ${coachingRelationship.coachee_last_name}`
      );
    } else {
      setRelPlaceholder("Select coaching relationship");
    }
  }, [coachingRelationship, relationshipId]);

  useEffect(() => {
    if (coachingSession && coachingSessionId) {
      setSessionPlaceholder(coachingSession.date);
    } else {
      setSessionPlaceholder("Select a session");
    }
  }, [coachingSession, coachingSessionId]);

  const FROM_DATE = DateTime.now().minus({ month: 1 }).toISODate();
  const TO_DATE = DateTime.now().plus({ month: 1 }).toISODate();

  const handleOrganizationSelection = (value: Id) => {
    setOrganizationId(value);
    if (value) {
      fetchOrganization(value).then(([organization]) => {
        setOrganization(organization);
      });
    }
  };

  const handleRelationshipSelection = (selectedRelationship: Id) => {
    setRelationshipId(selectedRelationship);
    if (selectedRelationship && organizationId) {
      fetchCoachingRelationshipWithUserNames(
        organizationId,
        selectedRelationship
      ).then((relationship) => {
        setCoachingRelationship(relationship);
      });
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
          setCoachingSessionId(theSession.id);
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
            placeholder={orgPlaceholder}
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
              placeholder={relPlaceholder}
              getOptionLabel={(relationship) =>
                `${relationship.coach_first_name} ${relationship.coach_last_name} -> ${relationship.coachee_first_name} ${relationship.coachee_last_name}`
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
              placeholder={sessionPlaceholder}
              getOptionLabel={(session) => session.date.toString()}
              getOptionValue={(session) => session.id.toString()}
              elementId="session-selector"
              groupByDate={true}
            />
          </div>
        )}
        {coachingSessionId && (
          <div className="grid gap-2">
            <Link href={`/coaching-sessions/${coachingSessionId}`}>
              <Button variant="outline" className="w-full">
                Join Session
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
