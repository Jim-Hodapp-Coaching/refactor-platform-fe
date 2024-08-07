// A type alias for each entity's Id field
export type Id = string;

// A sorting type that can be used by any of our custom types when stored
// as arrays
export enum SortOrder {
    Ascending = "ascending",
    Descending = "descending"
  }