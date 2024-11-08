import React, { useState, useEffect } from "react";
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
import { useAppState } from "@/hooks/use-app-state";
import { useSelectors } from "@/hooks/use-selectors";
import { useSelectionHandlers } from "@/hooks/use-selection-handlers";
import {
  AppStateStore,
  createAppStateStore,
} from "@/lib/stores/app-state-store";
import { useAppStateStore } from "@/lib/providers/app-state-store-provider";

export interface CoachingSessionCardProps {
  userId: Id;
}

export function JoinCoachingSession({ userId }: CoachingSessionCardProps) {
  const FROM_DATE = DateTime.now().minus({ month: 1 }).toISODate();
  const TO_DATE = DateTime.now().plus({ month: 1 }).toISODate();

  const { organizationId, relationshipId, coachingSessionId } = useAppState();

  const selectors = useSelectors();
  const {
    handleOrganizationSelection,
    handleRelationshipSelection,
    handleSessionSelection,
    isLoading,
    error,
    isClient,
  } = useSelectionHandlers();

  const orgPlaceholder = selectors.selectOrgPlaceholder(
    useAppStateStore((state) => state)
  );
  const relPlaceholder = selectors.selectRelPlaceholder(
    useAppStateStore((state) => state)
  );
  const sessionPlaceholder = selectors.selectSessionPlaceholder(
    useAppStateStore((state) => state)
  );

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
