import { DateTime } from "ts-luxon";
import { ActionStatus, Id, SortOrder } from "@/types/general";

// This must always reflect the Rust struct on the backend
// entity::actions::Model
export interface Action {
  id: Id;
  coaching_session_id: Id,
  body?: string,
  user_id: Id,
  status: ActionStatus,
  status_changed_at: DateTime,
  due_by: DateTime;
  created_at: DateTime;
  updated_at: DateTime;
}

// The main purpose of having this parsing function is to be able to parse the
// returned DateTimeWithTimeZone (Rust type) string into something that ts-luxon
// will agree to work with internally.
export function parseAction(data: any): Action {
  if (!isAction(data)) {
    throw new Error('Invalid Action object data');
  }
  return {
    id: data.id,
    coaching_session_id: data.coaching_session_id,
    body: data.body,
    user_id: data.user_id,
    status: data.status,
    status_changed_at: DateTime.fromISO(data.status_changed_at.toString()),
    due_by: DateTime.fromISO(data.due_by.toString()),
    created_at: DateTime.fromISO(data.created_at.toString()),
    updated_at: DateTime.fromISO(data.updated_at.toString()),
  };
}

export function isAction(value: unknown): value is Action {
    if (!value || typeof value !== "object") {
      return false;
    }
    const object = value as Record<string, unknown>;

    return (
      (typeof object.id === "string" &&
      typeof object.coaching_session_id === "string" &&
      typeof object.user_id === "string" &&
      typeof object.status === "string" &&
      typeof object.status_changed_at === "string" &&
      typeof object.due_by === "string" &&
      typeof object.created_at === "string" &&
      typeof object.updated_at === "string") || 
      typeof object.body === "string"            // body is optional
    );
  }

export function isActionArray(value: unknown): value is Action[] {
  return Array.isArray(value) && value.every(isAction);
}

export function sortActionArray(actions: Action[], order: SortOrder): Action[] {
  if (order == SortOrder.Ascending) {
    actions.sort((a, b) => 
      new Date(a.updated_at.toString()).getTime() - new Date(b.updated_at.toString()).getTime());
  } else if (order == SortOrder.Descending) {
    actions.sort((a, b) => 
      new Date(b.updated_at.toString()).getTime() - new Date(a.updated_at.toString()).getTime());
  }
  return actions;
}

export function defaultAction(): Action {
    const now = DateTime.now();
    return {
      id: "",
      coaching_session_id: "",
      body: "",
      user_id: "",
      status: ActionStatus.NotStarted,
      status_changed_at: now,
      due_by: now,
      created_at: now,
      updated_at: now,
    };
  }
  
  export function defaultActions(): Action[] {
    return [defaultAction()];
  }
  
  export function actionToString(action: Action): string {
    return JSON.stringify(action);
  }
  
  export function actionsToString(actions: Action[]): string {
    return JSON.stringify(actions);
  }