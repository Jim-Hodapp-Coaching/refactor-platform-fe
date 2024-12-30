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
import { useEffect, useState } from "react";
import { DateTime } from "ts-luxon";
import { useCoachingSessionStateStore } from "@/lib/providers/coaching-session-state-store-provider";
import { fetchOverarchingGoalsByCoachingSessionId } from "@/lib/api/overarching-goals";
import { OverarchingGoal } from "@/types/overarching-goal";

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
  const {
    coachingSessions,
    isLoading: isLoadingSessions,
    isError: isErrorSessions,
  } = useCoachingSessions(relationshipId);

  const { setCurrentCoachingSessions } = useCoachingSessionStateStore(
    (state) => state
  );
  const [goals, setGoals] = useState<(OverarchingGoal[] | undefined)[]>([]);
  const [isLoadingGoals, setIsLoadingGoals] = useState(false);

  useEffect(() => {
    if (!coachingSessions.length) return;
    setCurrentCoachingSessions(coachingSessions);
  }, [coachingSessions]);

  useEffect(() => {
    const fetchGoals = async () => {
      setIsLoadingGoals(true);
      try {
        const sessionIds = coachingSessions?.map((session) => session.id) || [];
        const goalsPromises = sessionIds.map((id) =>
          fetchOverarchingGoalsByCoachingSessionId(id)
        );
        const fetchedGoals = await Promise.all(goalsPromises);
        setGoals(fetchedGoals);
      } catch (error) {
        console.error("Error fetching goals:", error);
      } finally {
        setIsLoadingGoals(false);
      }
    };

    if (coachingSessions?.length) {
      fetchGoals();
    }
  }, [coachingSessions]);

  if (isLoadingSessions || isLoadingGoals) return <div>Loading...</div>;
  if (isErrorSessions) return <div>Error loading coaching sessions</div>;
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
            .map((session) => {
              const sessionIndex = coachingSessions.findIndex(
                (s) => s.id === session.id
              );
              return (
                <SelectItem value={session.id} key={session.id}>
                  <div className="flex flex-col w-full">
                    <span className="text-left truncate overflow-hidden">
                      {goals[sessionIndex]?.[0]?.title || "No goal set"}
                    </span>
                    <span className="text-sm text-gray-400">
                      {getDateTimeFromString(session.date).toLocaleString(
                        DateTime.DATETIME_FULL
                      )}
                    </span>
                  </div>
                </SelectItem>
              );
            })}
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
            .map((session) => {
              const sessionIndex = coachingSessions.findIndex(
                (s) => s.id === session.id
              );
              return (
                <SelectItem value={session.id} key={session.id}>
                  <div className="flex flex-col w-full">
                    <span className="text-left truncate overflow-hidden">
                      {goals[sessionIndex]?.[0]?.title || "No goal set"}
                    </span>
                    <span className="text-sm text-gray-400">
                      {getDateTimeFromString(session.date).toLocaleString(
                        DateTime.DATETIME_FULL
                      )}
                    </span>
                  </div>
                </SelectItem>
              );
            })}
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

  const [currentGoal, setCurrentGoal] = useState<OverarchingGoal | undefined>();
  const [isLoadingGoal, setIsLoadingGoal] = useState(false);

  const currentSession = currentCoachingSessionId
    ? getCurrentCoachingSession(currentCoachingSessionId)
    : null;

  useEffect(() => {
    const fetchGoal = async () => {
      if (!currentCoachingSessionId) return;

      setIsLoadingGoal(true);
      try {
        const goals = await fetchOverarchingGoalsByCoachingSessionId(
          currentCoachingSessionId
        );
        setCurrentGoal(goals[0]);
      } catch (error) {
        console.error("Error fetching goal:", error);
      } finally {
        setIsLoadingGoal(false);
      }
    };

    fetchGoal();
  }, [currentCoachingSessionId]);

  const handleSetCoachingSession = (coachingSessionId: Id) => {
    setCurrentCoachingSessionId(coachingSessionId);
    if (onSelect) {
      onSelect(coachingSessionId);
    }
  };

  const displayValue = currentSession ? (
    <div className="flex flex-col w-[28rem]">
      <span className="truncate overflow-hidden text-left">
        {currentGoal?.title || "No goal set"}
      </span>
      <span className="text-sm text-gray-500 text-left">
        {getDateTimeFromString(currentSession.date).toLocaleString(
          DateTime.DATETIME_FULL
        )}
      </span>
    </div>
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
