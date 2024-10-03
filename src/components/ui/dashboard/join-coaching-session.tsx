import React, { MouseEventHandler, useState } from 'react';
import { Id } from "@/types/general";
import Link from 'next/link';
import { DynamicApiSelect } from './dynamic-api-select';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Organization } from '@/types/organization';
import { CoachingRelationshipWithUserNames } from '@/types/coaching_relationship_with_user_names';
import { CoachingSession } from '@/types/coaching-session';
import { DateTime } from 'ts-luxon';
import { Label } from "@/components/ui/label";
import { Button } from '../button';


export interface CoachingSessionCardProps {
  userId: Id;
}

export function JoinCoachingSession({ userId: userId }: CoachingSessionCardProps) {
  const [organizationId, setOrganizationId] = useState<string | null>(null);
  const [relationshipId, setRelationshipId] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);

  return (
    <Card className="w-[300px]">
      <CardHeader>
        <CardTitle>Join a Coaching Session</CardTitle>
      </CardHeader>
      <CardContent className='grid gap-6'>
        <div className="grid gap-2">
          <Label htmlFor='organization-selector'>Organization</Label>

          <DynamicApiSelect<Organization>
            url="/organizations"
            params={{ userId }}
            onChange={setOrganizationId}
            placeholder="Select an organization"
            getOptionLabel={(org) => org.name}
            getOptionValue={(org) => org.id.toString()}
            elementId='organization-selector'
          />
        </div>
        {organizationId && (
          <div className="grid gap-2">
            <Label htmlFor='relationship-selector'>Relationship</Label>

            <DynamicApiSelect<CoachingRelationshipWithUserNames>
              url={`/organizations/${organizationId}/coaching_relationships`}
              params={{ organizationId }}
              onChange={setRelationshipId}
              placeholder="Select coaching relationship"
              getOptionLabel={
                (relationship) =>
                  `${relationship.coach_first_name} ${relationship.coach_last_name} -> ${relationship.coachee_first_name} ${relationship.coach_last_name}`
              }
              getOptionValue={(relationship) => relationship.id.toString()}
              elementId='relationship-selector'
            />
          </div>
        )}
        {relationshipId && (
          <div className="grid gap-2">
            <Label htmlFor='session-selector'>Coaching Session</Label>

            <DynamicApiSelect<CoachingSession>
              url="/coaching_sessions"
              params={{
                coaching_relationship_id: relationshipId,
                from_date: DateTime.now().minus({ month: 1 }).toISODate(),
                to_Date: DateTime.now().plus({ month: 1 }).toISODate()
              }}
              onChange={setSessionId}
              placeholder="Select coaching session"
              getOptionLabel={(session) => session.date.toString()}
              getOptionValue={(session) => session.id.toString()}
              elementId='session-selector'
              groupByDate={true}
            />
          </div>
        )}
        {sessionId && (
          <div className='grid gap-2'>
            <Button variant='outline' className='w-full'>
              <Link href={`/coaching-sessions/${sessionId}`}>
                Join Session
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// godot
//asesprint
