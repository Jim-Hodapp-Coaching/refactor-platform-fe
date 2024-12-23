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

// import * as React from "react";
// import { PopoverProps } from "@radix-ui/react-popover";

// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectLabel,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// import "@/styles/code-block.scss";
// import {
//   CoachingSession,
//   coachingSessionToString,
//   getCoachingSessionById,
// } from "@/types/coaching-session";
// import { getDateTimeFromString, Id } from "@/types/general";
// import { DateTime } from "ts-luxon";
// import { useAppStateStore } from "@/lib/providers/app-state-store-provider";

// interface CoachingSessionSelectorProps extends PopoverProps {
//   sessions: CoachingSession[];
//   placeholder: string;
//   onSelect: (session: Id) => void;
// }

// export function CoachingSessionSelector({
//   sessions,
//   placeholder,
//   onSelect,
//   ...props
// }: CoachingSessionSelectorProps) {
//   const { coachingSessionId, setCoachingSessionId } = useAppStateStore(
//     (state) => state
//   );
//   const { setCoachingSession } = useAppStateStore((state) => state);

//   const handleSetCoachingSession = (coachingSessionId: string) => {
//     setCoachingSessionId(coachingSessionId);
//     const coachingSession = getCoachingSessionById(coachingSessionId, sessions);
//     console.debug(
//       "coachingSession: " + coachingSessionToString(coachingSession)
//     );
//     setCoachingSession(coachingSession);
//     onSelect(coachingSessionId);
//   };

//   return (
//     <Select
//       defaultValue="today"
//       value={coachingSessionId}
//       onValueChange={handleSetCoachingSession}
//     >
//       <SelectTrigger id="session">
//         <SelectValue placeholder={placeholder} />
//       </SelectTrigger>
//       <SelectContent>
//         {sessions.some(
//           (session) => getDateTimeFromString(session.date) < DateTime.now()
//         ) && (
//           <SelectGroup>
//             <SelectLabel>Previous Sessions</SelectLabel>
//             {sessions
//               .filter(
//                 (session) =>
//                   getDateTimeFromString(session.date) < DateTime.now()
//               )
//               .map((session) => (
//                 <SelectItem value={session.id} key={session.id}>
//                   {getDateTimeFromString(session.date).toLocaleString(
//                     DateTime.DATETIME_FULL
//                   )}
//                 </SelectItem>
//               ))}
//           </SelectGroup>
//         )}
//         {sessions.some(
//           (session) => getDateTimeFromString(session.date) >= DateTime.now()
//         ) && (
//           <SelectGroup>
//             <SelectLabel>Upcoming Sessions</SelectLabel>
//             {sessions
//               .filter(
//                 (session) =>
//                   getDateTimeFromString(session.date) >= DateTime.now()
//               )
//               .map((session) => (
//                 <SelectItem value={session.id} key={session.id}>
//                   {getDateTimeFromString(session.date).toLocaleString(
//                     DateTime.DATETIME_FULL
//                   )}
//                 </SelectItem>
//               ))}
//           </SelectGroup>
//         )}
//         {sessions.length == 0 && (
//           <SelectItem disabled={true} value="none">
//             None found
//           </SelectItem>
//         )}
//       </SelectContent>
//     </Select>
//   );
// }
