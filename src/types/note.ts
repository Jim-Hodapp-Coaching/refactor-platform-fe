import { DateTime } from "ts-luxon";
import { Id, SortOrder } from "@/types/general";

// This must always reflect the Rust struct on the backend
// entity::notes::Model
export interface Note {
  id: Id;
  coaching_session_id: Id,
  body: String,
  user_id: Id,
  created_at: DateTime;
  updated_at: DateTime;
}

// The main purpose of having this parsing function is to be able to parse the
// returned DateTimeWithTimeZone (Rust type) string into something that ts-luxon
// will agree to work with internally.
export function parseNote(data: any): Note {
  if (!isNote(data)) {
    throw new Error('Invalid Note data');
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

export function isNote(value: unknown): value is Note {
    if (!value || typeof value !== "object") {
      return false;
    }
    const object = value as Record<string, unknown>;
  
    return (
      typeof object.id === "string" &&
      typeof object.coaching_session_id === "string" &&
      typeof object.body === "string" &&
      typeof object.user_id === "string" &&
      typeof object.created_at === "string" &&
      typeof object.updated_at === "string"
    );
  }

export function isNoteArray(value: unknown): value is Note[] {
  return Array.isArray(value) && value.every(isNote);
}

export function sortNoteArray(notes: Note[], order: SortOrder): Note[] {
  if (order == SortOrder.Ascending) {
    notes.sort((a, b) => 
      new Date(a.updated_at.toString()).getTime() - new Date(b.updated_at.toString()).getTime());
  } else if (order == SortOrder.Descending) {
    notes.sort((a, b) => 
      new Date(b.updated_at.toString()).getTime() - new Date(a.updated_at.toString()).getTime());
  }
  return notes;
}

export function defaultNote(): Note {
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
  
  export function defaultNotes(): Note[] {
    return [defaultNote()];
  }
  
  export function noteToString(note: Note): string {
    return JSON.stringify(note);
  }
  
  export function notesToString(notes: Note[]): string {
    return JSON.stringify(notes);
  }