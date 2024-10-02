import { DateTime } from "ts-luxon";
import { Id } from "@/types/general";

// This must always reflect the Rust struct on the backend
// entity_api::coaching_relationship::CoachingRelationshipWithUserNames
export interface CoachingRelationshipWithUserNames {
  id: Id;
  coach_id: Id;
  coachee_id: Id;
  coach_first_name: string;
  coach_last_name: string;
  coachee_first_name: string;
  coachee_last_name: string;
  created_at: DateTime;
  updated_at: DateTime;
}

// The main purpose of having this parsing function is to be able to parse the
// returned DateTimeWithTimeZone (Rust type) string into something that ts-luxon
// will agree to work with internally.
export function parseCoachingRelationshipWithUserNames(data: any): CoachingRelationshipWithUserNames {
  if (!isCoachingRelationshipWithUserNames(data)) {
    throw new Error('Invalid CoachingRelationshipWithUserNames object data');
  }
  return {
    id: data.id,
    coach_id: data.coach_id,
    coachee_id: data.coachee_id,
    coach_first_name: data.coach_first_name,
    coach_last_name: data.coach_last_name,
    coachee_first_name: data.coachee_first_name,
    coachee_last_name: data.coachee_last_name,
    created_at: DateTime.fromISO(data.created_at.toString()),
    updated_at: DateTime.fromISO(data.updated_at.toString()),
  };
}

export function isCoachingRelationshipWithUserNames(value: unknown): value is CoachingRelationshipWithUserNames {
    if (!value || typeof value !== "object") {
    return false;
  }
  const object = value as Record<string, unknown>;

  return (
    typeof object.id === "string" &&
    typeof object.coach_id === "string" &&
    typeof object.coachee_id === "string" &&
    typeof object.coach_first_name === "string" &&
    typeof object.coach_last_name === "string" &&
    typeof object.coachee_first_name === "string" &&
    typeof object.coachee_last_name === "string" &&
    typeof object.created_at === "string" &&
    typeof object.updated_at === "string"
  );
}

export function isCoachingRelationshipWithUserNamesArray(value: unknown): value is CoachingRelationshipWithUserNames[] {
  return Array.isArray(value) && value.every(isCoachingRelationshipWithUserNames);
}

export function getCoachingRelationshipById(id: string, relationships: CoachingRelationshipWithUserNames[]): CoachingRelationshipWithUserNames {
  const relationship = relationships.find(relationship => relationship.id === id);
  return relationship ? relationship : defaultCoachingRelationshipWithUserNames();
}

export function defaultCoachingRelationshipWithUserNames(): CoachingRelationshipWithUserNames {
    var now = DateTime.now();
    return {
      id: "",
      coach_id: "",
      coachee_id: "",
      coach_first_name: "",
      coach_last_name: "",
      coachee_first_name: "",
      coachee_last_name: "",
      created_at: now,
      updated_at: now,
    };
  }
  
  export function defaultCoachingRelationshipsWithUserNames(): CoachingRelationshipWithUserNames[] {
    return [defaultCoachingRelationshipWithUserNames()];
  }
  
  export function coachingRelationshipWithUserNamesToString(relationship: CoachingRelationshipWithUserNames): string {
    return JSON.stringify(relationship);
  }
  
  export function coachingRelationshipsWithUserNamesToString(relationships: CoachingRelationshipWithUserNames[]): string {
    return JSON.stringify(relationships);
  }