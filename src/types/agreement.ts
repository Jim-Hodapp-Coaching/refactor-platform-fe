import { DateTime } from "ts-luxon";
import { CompletionStatus, Id, SortOrder } from "@/types/general";

// This must always reflect the Rust struct on the backend
// entity::agreements::Model
export interface Agreement {
  id: Id;
  coaching_session_id: Id,
  body?: string,
  user_id: Id,
  created_at: DateTime;
  updated_at: DateTime;
}

// The main purpose of having this parsing function is to be able to parse the
// returned DateTimeWithTimeZone (Rust type) string into something that ts-luxon
// will agree to work with internally.
export function parseAgreement(data: any): Agreement {
  if (!isAgreement(data)) {
    throw new Error('Invalid Agreement object data');
  }
  return {
    id: data.id,
    coaching_session_id: data.coaching_session_id,
    body: data.body,
    user_id: data.user_id,
    created_at: DateTime.fromISO(data.created_at.toString()),
    updated_at: DateTime.fromISO(data.updated_at.toString()),
  };
}

export function isAgreement(value: unknown): value is Agreement {
    if (!value || typeof value !== "object") {
      return false;
    }
    const object = value as Record<string, unknown>;

    return (
      (typeof object.id === "string" &&
      typeof object.coaching_session_id === "string" &&
      typeof object.user_id === "string" &&
      typeof object.created_at === "string" &&
      typeof object.updated_at === "string") || 
      typeof object.body === "string"            // body is optional
    );
  }

export function isAgreementArray(value: unknown): value is Agreement[] {
  return Array.isArray(value) && value.every(isAgreement);
}

export function sortAgreementArray(agreements: Agreement[], order: SortOrder): Agreement[] {
  if (order == SortOrder.Ascending) {
    agreements.sort((a, b) => 
      new Date(a.updated_at.toString()).getTime() - new Date(b.updated_at.toString()).getTime());
  } else if (order == SortOrder.Descending) {
    agreements.sort((a, b) => 
      new Date(b.updated_at.toString()).getTime() - new Date(a.updated_at.toString()).getTime());
  }
  return agreements;
}

export function defaultAgreement(): Agreement {
    var now = DateTime.now();
    return {
      id: "",
      coaching_session_id: "",
      body: "",
      user_id: "",
      created_at: now,
      updated_at: now,
    };
  }
  
  export function defaultAgreements(): Agreement[] {
    return [defaultAgreement()];
  }
  
  export function agreementToString(agreement: Agreement): string {
    return JSON.stringify(agreement);
  }
  
  export function agreementsToString(agreements: Agreement[]): string {
    return JSON.stringify(agreements);
  }