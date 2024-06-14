import { DateTime } from "ts-luxon";
import { Id } from "@/types/general";

// pub id: Id,
// #[sea_orm(unique)]
// pub organization_id: Id,
// pub coach_id: Id,
// pub coachee_id: Id,
// #[schema(value_type = String, format = DateTime)] // Applies to OpenAPI schema
// pub created_at: DateTimeWithTimeZone,
// #[schema(value_type = String, format = DateTime)] // Applies to OpenAPI schema
// pub updated_at: DateTimeWithTimeZone,

// This must always reflect the Rust struct on the backend
// entity::coaching_relationships::Model
export interface CoachingRelationship {
  id: Id;
  name: string;
  logo?: string;
  created_at: DateTime;
  updated_at: DateTime;
}

export function isOrganization(value: unknown): value is Organization {
  if (!value || typeof value !== "object") {
    return false;
  }
  const object = value as Record<string, unknown>;

  return (
    (typeof object.id === "string" &&
      typeof object.name === "string" &&
      typeof object.created_at === "string" &&
      typeof object.updated_at === "string") ||
    typeof object.logo === "string" // logo is optional
  );
}

export function isOrganizationsArray(value: unknown): value is Organization[] {
  return Array.isArray(value) && value.every(isOrganization);
}

export function defaultOrganization(): Organization {
  var now = DateTime.now();
  return {
    id: "",
    name: "",
    logo: "",
    created_at: now,
    updated_at: now,
  };
}

export function defaultOrganizations(): Organization[] {
  return [defaultOrganization()];
}

export function organizationToString(organization: Organization): string {
  return JSON.stringify(organization);
}

export function organizationsToString(organizations: Organization[]): string {
  return JSON.stringify(organizations);
}
