import { useCallback, useState, useEffect } from "react";
import { Id } from "@/types/general";
import { fetchCoachingRelationshipWithUserNames } from "@/lib/api/coaching-relationships";
import { fetchCoachingSessions } from "@/lib/api/coaching-sessions";
import { fetchOrganization } from "@/lib/api/organizations";
import { useAppState } from "./use-app-state";
import { defaultCoachingRelationshipWithUserNames } from "@/types/coaching_relationship_with_user_names";
import { defaultCoachingSession } from "@/types/coaching-session";
import { useAppStateStore } from "@/lib/providers/app-state-store-provider";

export const useSelectionHandlers = () => {
  const {
    setOrganizationId,
    setRelationshipId,
    setCoachingSessionId,
    setOrganization,
    setCoachingRelationship,
    setCoachingSession,
  } = useAppState();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const resetState = useCallback(
    (level: "all" | "relationship" | "session") => {
      if (level === "all" || level === "relationship") {
        setCoachingRelationship(defaultCoachingRelationshipWithUserNames());
        setRelationshipId("");
      }
      if (level === "all" || level === "relationship" || level === "session") {
        setCoachingSession(defaultCoachingSession());
        setCoachingSessionId("");
      }
    },
    [
      setCoachingRelationship,
      setRelationshipId,
      setCoachingSession,
      setCoachingSessionId,
    ]
  );

  const handleSelection = useCallback(
    async (level: "organization" | "relationship" | "session", value: Id) => {
      if (!isClient) return;
      setIsLoading(true);
      setError(null);

      try {
        switch (level) {
          case "organization":
            resetState("all");
            setOrganizationId(value);
            if (value) {
              const [organization] = await fetchOrganization(value);
              if (!organization) throw new Error("Organization not found");
              setOrganization(organization);
            } else {
              setOrganization(null);
            }
            break;

          case "relationship":
            resetState("relationship");
            setRelationshipId(value);
            if (value) {
              const organizationId = useAppStateStore(
                (state) => state.organizationId
              );
              if (!organizationId)
                throw new Error("Organization ID is not set");
              const relationship = await fetchCoachingRelationshipWithUserNames(
                organizationId,
                value
              );
              if (!relationship) throw new Error("Relationship not found");
              setCoachingRelationship(relationship);
            }
            break;

          case "session":
            if (value) {
              const relationshipId = useAppStateStore(
                (state) => state.relationshipId
              );
              if (!relationshipId)
                throw new Error("Relationship ID is not set");
              const [sessions] = await fetchCoachingSessions(relationshipId);
              const theSession = sessions.find(
                (session) => session.id === value
              );
              if (!theSession) throw new Error("Selected session not found");
              setCoachingSession(theSession);
              setCoachingSessionId(theSession.id);
            } else {
              resetState("session");
            }
            break;
        }
      } catch (err) {
        console.error(`Error fetching ${level}:`, err);
        setError(`Failed to fetch ${level}`);
      } finally {
        setIsLoading(false);
      }
    },
    [
      isClient,
      setOrganizationId,
      setOrganization,
      setRelationshipId,
      setCoachingRelationship,
      setCoachingSession,
      setCoachingSessionId,
      resetState,
    ]
  );

  return {
    handleOrganizationSelection: (value: Id) =>
      handleSelection("organization", value),
    handleRelationshipSelection: (value: Id) =>
      handleSelection("relationship", value),
    handleSessionSelection: (value: Id) => handleSelection("session", value),
    isLoading,
    error,
    isClient,
  };
};
