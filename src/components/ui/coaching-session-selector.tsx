"use client";

import * as React from "react";
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

import "@/styles/code-block.scss";
import {
  CoachingSession,
  coachingSessionToString,
  getCoachingSessionById,
} from "@/types/coaching-session";
import { getDateTimeFromString, Id } from "@/types/general";
import { DateTime } from "ts-luxon";
import { useAppStateStore } from "@/lib/providers/app-state-store-provider";

interface CoachingSessionSelectorProps extends PopoverProps {
  sessions: CoachingSession[];
  placeholder: string;
  onSelect: (session: Id) => void;
}

export function CoachingSessionSelector({
  sessions,
  placeholder,
  onSelect,
  ...props
}: CoachingSessionSelectorProps) {
  const { coachingSessionId, setCoachingSessionId } = useAppStateStore(
    (state) => state
  );
  const { setCoachingSession } = useAppStateStore((state) => state);

  const handleSetCoachingSession = (coachingSessionId: string) => {
    setCoachingSessionId(coachingSessionId);
    const coachingSession = getCoachingSessionById(coachingSessionId, sessions);
    console.debug(
      "coachingSession: " + coachingSessionToString(coachingSession)
    );
    setCoachingSession(coachingSession);
    onSelect(coachingSessionId);
  };

  return (
    <Select
      defaultValue="today"
      value={coachingSessionId}
      onValueChange={handleSetCoachingSession}
    >
      <SelectTrigger id="session">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {sessions.some(
          (session) => getDateTimeFromString(session.date) < DateTime.now()
        ) && (
          <SelectGroup>
            <SelectLabel>Previous Sessions</SelectLabel>
            {sessions
              .filter(
                (session) =>
                  getDateTimeFromString(session.date) < DateTime.now()
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
        {sessions.some(
          (session) => getDateTimeFromString(session.date) >= DateTime.now()
        ) && (
          <SelectGroup>
            <SelectLabel>Upcoming Sessions</SelectLabel>
            {sessions
              .filter(
                (session) =>
                  getDateTimeFromString(session.date) >= DateTime.now()
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
        {sessions.length == 0 && (
          <SelectItem disabled={true} value="none">
            None found
          </SelectItem>
        )}
      </SelectContent>
    </Select>
  );
}
