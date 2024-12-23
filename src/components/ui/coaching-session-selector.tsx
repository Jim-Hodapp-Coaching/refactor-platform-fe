"use client";

import { PopoverProps } from "@radix-ui/react-popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getDateTimeFromString, Id } from "@/types/general";
import { useCoachingSessions } from "@/lib/api/coaching-sessions";
import { useEffect } from "react";
import { DateTime } from "ts-luxon";
import { useCoachingSessionStateStore } from "@/lib/providers/coaching-session-state-store-provider";

interface CoachingSessionsSelectorProps extends PopoverProps {
  /// The CoachingRelationship Id for which to get a list of associated CoachingSessions
  relationshipId: Id;
  /// Disable the component from interaction with the user
  disabled: boolean;
  /// Called when a CoachingSession is selected
  onSelect?: (coachingSessionId: Id) => void;
}

function CoachingSessionsSelectItems({
  relationshipId,
}: {
  relationshipId: Id;
}) {
  const { coachingSessions, isLoading, isError } =
    useCoachingSessions(relationshipId);
  const { setCurrentCoachingSessions } = useCoachingSessionStateStore(
    (state) => state
  );

  console.debug(`coachingSessions: ${JSON.stringify(coachingSessions)}`);

  // Be sure to cache the list of current coaching sessions in the CoachingSessionStateStore
  useEffect(() => {
    if (!coachingSessions.length) return;
    console.debug(
      `coachingSessions (useEffect): ${JSON.stringify(coachingSessions)}`
    );
    setCurrentCoachingSessions(coachingSessions);
  }, [coachingSessions]);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading coaching sessions</div>;
  if (!coachingSessions?.length) return <div>No coaching sessions found</div>;

  return (
    <>
      {coachingSessions.some(
        (session) => getDateTimeFromString(session.date) < DateTime.now()
      ) && (
        <SelectGroup>
          <SelectLabel>Previous Sessions</SelectLabel>
          {coachingSessions
            .filter(
              (session) => getDateTimeFromString(session.date) < DateTime.now()
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
        (session) => getDateTimeFromString(session.date) >= DateTime.now()
      ) && (
        <SelectGroup>
          <SelectLabel>Upcoming Sessions</SelectLabel>
          {coachingSessions
            .filter(
              (session) => getDateTimeFromString(session.date) >= DateTime.now()
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
    </>
  );
}

export default function CoachingSessionSelector({
  relationshipId,
  disabled,
  onSelect,
  ...props
}: CoachingSessionsSelectorProps) {
  const {
    currentCoachingSessionId,
    setCurrentCoachingSessionId,
    getCurrentCoachingSession,
  } = useCoachingSessionStateStore((state) => state);

  const handleSetCoachingSession = (coachingSessionId: Id) => {
    setCurrentCoachingSessionId(coachingSessionId);
    if (onSelect) {
      onSelect(relationshipId);
    }
  };

  const currentSession = currentCoachingSessionId
    ? getCurrentCoachingSession(currentCoachingSessionId)
    : null;

  const displayValue = currentSession ? (
    <>
      {getDateTimeFromString(currentSession.date).toLocaleString(
        DateTime.DATETIME_FULL
      )}
    </>
  ) : undefined;

  return (
    <Select
      disabled={disabled}
      value={currentCoachingSessionId ?? undefined}
      onValueChange={handleSetCoachingSession}
    >
      <SelectTrigger id="coaching-session-selector">
        <SelectValue placeholder="Select coaching session">
          {displayValue}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <CoachingSessionsSelectItems relationshipId={relationshipId} />
      </SelectContent>
    </Select>
  );
}
