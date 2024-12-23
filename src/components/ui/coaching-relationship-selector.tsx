"use client";

import { PopoverProps } from "@radix-ui/react-popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Id } from "@/types/general";
import { useCoachingRelationships } from "@/lib/api/coaching-relationships";
import { useEffect } from "react";
import { useCoachingRelationshipStateStore } from "@/lib/providers/coaching-relationship-state-store-provider";
import { useCoachingSessionStateStore } from "@/lib/providers/coaching-session-state-store-provider";

interface CoachingRelationshipsSelectorProps extends PopoverProps {
  /// The Organization's Id for which to get a list of associated CoachingRelationships
  organizationId: Id;
  /// Disable the component from interaction with the user
  disabled: boolean;
  /// Called when a CoachingRelationship is selected
  onSelect?: (relationshipId: Id) => void;
}

function CoachingRelationshipsSelectItems({
  organizationId,
}: {
  organizationId: Id;
}) {
  const { relationships, isLoading, isError } =
    useCoachingRelationships(organizationId);
  const { setCurrentCoachingRelationships } = useCoachingRelationshipStateStore(
    (state) => state
  );

  // Be sure to cache the list of current coaching relationships in the CoachingRelationshipStateStore
  useEffect(() => {
    if (!relationships.length) return;
    console.debug(
      `relationships (useEffect): ${JSON.stringify(relationships)}`
    );
    setCurrentCoachingRelationships(relationships);
  }, [relationships]);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading coaching relationships</div>;
  if (!relationships?.length) return <div>No coaching relationships found</div>;

  console.debug(`relationships: ${JSON.stringify(relationships)}`);

  return (
    <>
      {relationships.map((rel) => (
        <SelectItem value={rel.id} key={rel.id}>
          {rel.coach_first_name} {rel.coach_last_name} -&gt;{" "}
          {rel.coachee_first_name} {rel.coachee_last_name}
        </SelectItem>
      ))}
    </>
  );
}

export default function CoachingRelationshipSelector({
  organizationId,
  disabled,
  onSelect,
  ...props
}: CoachingRelationshipsSelectorProps) {
  const {
    currentCoachingRelationshipId,
    setCurrentCoachingRelationshipId,
    getCurrentCoachingRelationship,
  } = useCoachingRelationshipStateStore((state) => state);
  const { resetCoachingSessionState } = useCoachingSessionStateStore(
    (action) => action
  );

  const handleSetCoachingRelationship = (relationshipId: Id) => {
    setCurrentCoachingRelationshipId(relationshipId);
    // Ensure that the user doesn't see the previous (stale) list of CoachingSessions
    resetCoachingSessionState();
    if (onSelect) {
      onSelect(relationshipId);
    }
  };

  const currentRelationship = currentCoachingRelationshipId
    ? getCurrentCoachingRelationship(currentCoachingRelationshipId)
    : null;

  const displayValue = currentRelationship ? (
    <>
      {currentRelationship.coach_first_name}{" "}
      {currentRelationship.coach_last_name} -&gt;{" "}
      {currentRelationship.coachee_first_name}{" "}
      {currentRelationship.coachee_last_name}
    </>
  ) : undefined;

  return (
    <Select
      disabled={disabled}
      value={currentCoachingRelationshipId ?? undefined}
      onValueChange={handleSetCoachingRelationship}
    >
      <SelectTrigger id="coaching-relationship-selector">
        <SelectValue placeholder="Select coaching relationship">
          {displayValue}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <CoachingRelationshipsSelectItems organizationId={organizationId} />
      </SelectContent>
    </Select>
  );
}
