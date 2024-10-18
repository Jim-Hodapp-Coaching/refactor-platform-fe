import { DateTime } from "ts-luxon";

// A type alias for each entity's Id field
export type Id = string;

// A sorting type that can be used by any of our custom types when stored
// as arrays
export enum SortOrder {
  Ascending = "ascending",
  Descending = "descending",
}

export enum ItemStatus {
  NotStarted = "NotStarted",
  InProgress = "InProgress",
  Completed = "Completed",
  WontDo = "WontDo",
}

export function stringToActionStatus(statusString: string): ItemStatus {
  const status = statusString.trim();

  if (status == "InProgress") {
    return ItemStatus.InProgress;
  } else if (status == "Completed") {
    return ItemStatus.Completed;
  } else if (status == "WontDo") {
    return ItemStatus.WontDo;
  } else {
    return ItemStatus.NotStarted;
  }
}

export function actionStatusToString(actionStatus: ItemStatus): string {
  if (actionStatus == "InProgress") {
    return "In Progress";
  } else if (actionStatus == "Completed") {
    return "Completed";
  } else if (actionStatus == "WontDo") {
    return "Won't Do";
  } else {
    return "Not Started";
  }
}

/// Given a valid ISO formatted date time string (timestampz in Postgresql types),
/// return a valid DateTime object instance.
export function getDateTimeFromString(dateTime: string): DateTime {
  const dt = dateTime.trim();
  return dt.trim().length > 0 ? DateTime.fromISO(dt) : DateTime.now();
}
