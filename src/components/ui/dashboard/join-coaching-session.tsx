import React, { useState } from 'react';
import { Id } from "@/types/general";
import { DynamicApiSelect } from './dynamic-api-select';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Organization } from '@/types/organization';
import { CoachingRelationshipWithUserNames } from '@/types/coaching_relationship_with_user_names';
import { CoachingSession } from '@/types/coaching-session';
import { DateTime } from 'ts-luxon';

export interface CoachingSessionCardProps {
  userId: Id;
}

export function JoinCoachingSession({ userId: userId }: CoachingSessionCardProps) {
  const [organization, setOrganizations] = useState<string | null>(null);
  const [relationship, setRelationships] = useState<string | null>(null);
  const [sessions, setSessions] = useState<string | null>(null);

  const handleOrganizationSelection = (value: string) => {
    setOrganizations(value)
    setRelationships(null) // Reset second selection when first changes
  }

  const handleRelationshipSelection = (value: string) => {
    setRelationships(value);
    setSessions(null);
  }

  const handleSessionSelection = (value: string) => {
    setSessions(value);
  }

  return (
    <Card className="w-[300px]">
      <CardHeader>
        <CardTitle>Make Your Selection</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <DynamicApiSelect<Organization>
            url="/organizations"
            params={{ userId }}
            onChange={handleOrganizationSelection}
            placeholder="Select an organization"
            getOptionLabel={(org) => org.name}
            getOptionValue={(org) => org.id.toString()}
          />
          {organization && (
            <DynamicApiSelect<CoachingRelationshipWithUserNames>
              url={`/organizations/${organization}/coaching_relationships`}
              params={{ organization }}
              onChange={handleRelationshipSelection}
              placeholder="Select coaching relationship"
              getOptionLabel={(relationship) => relationship.coach_first_name}
              getOptionValue={(relationship) => relationship.id.toString()}
            />
          )}
          {relationship && (
            <DynamicApiSelect<CoachingSession>
              url="/coaching_sessions"
              params={{
                coaching_relationship_id: relationship,
                from_date: DateTime.now().minus({ month: 1 }).toISODate(),
                to_Date: DateTime.now().plus({ month: 1 }).toISODate()
              }}
              onChange={handleRelationshipSelection}
              placeholder="Select coaching session"
              getOptionLabel={(session) => session.date.toString()}
              getOptionValue={(session) => session.id.toString()}
            />
          )}
        </div>
      </CardContent>
    </Card>
  )
}