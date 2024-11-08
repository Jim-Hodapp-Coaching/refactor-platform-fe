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

  const resetRelationshipAndSession = useCallback(() => {
    setCoachingRelationship(defaultCoachingRelationshipWithUserNames());
    setRelationshipId("");
    setCoachingSession(defaultCoachingSession());
    setCoachingSessionId("");
  }, [
    setCoachingRelationship,
    setRelationshipId,
    setCoachingSession,
    setCoachingSessionId,
  ]);

  const resetSession = useCallback(() => {
    setCoachingSession(defaultCoachingSession());
    setCoachingSessionId("");
  }, [setCoachingSession, setCoachingSessionId]);

  const handleOrganizationSelection = useCallback(
    async (value: Id) => {
      if (!isClient) return; // Prevent execution on server-side
      setIsLoading(true);
      setError(null);
      try {
        resetRelationshipAndSession();
        setOrganizationId(value);
        if (value) {
          const [organization] = await fetchOrganization(value);
          if (!organization) throw new Error("Organization not found");
          setOrganization(organization);
        } else {
          setOrganization(null);
        }
      } catch (err) {
        console.error("Error fetching organization:", err);
        setError("Failed to fetch organization");
      } finally {
        setIsLoading(false);
      }
    },
    [isClient, setOrganizationId, setOrganization, resetRelationshipAndSession]
  );

  const handleRelationshipSelection = useCallback(
    async (selectedRelationship: Id) => {
      if (!isClient) return; // Prevent execution on server-side
      setIsLoading(true);
      setError(null);
      try {
        resetSession();
        setRelationshipId(selectedRelationship);
        if (selectedRelationship) {
          const organizationId = useAppStateStore(
            (state) => state.organizationId
          );
          if (!organizationId) throw new Error("Organization ID is not set");
          const relationship = await fetchCoachingRelationshipWithUserNames(
            organizationId,
            selectedRelationship
          );
          if (!relationship) throw new Error("Relationship not found");
          setCoachingRelationship(relationship);
        } else {
          setCoachingRelationship(defaultCoachingRelationshipWithUserNames());
        }
      } catch (err) {
        console.error("Error fetching relationship:", err);
        setError("Failed to fetch relationship");
      } finally {
        setIsLoading(false);
      }
    },
    [isClient, setRelationshipId, setCoachingRelationship, resetSession]
  );

  const handleSessionSelection = useCallback(
    async (selectedSession: Id) => {
      if (!isClient) return; // Prevent execution on server-side
      setIsLoading(true);
      setError(null);
      try {
        if (selectedSession) {
          const relationshipId = useAppStateStore(
            (state) => state.relationshipId
          );
          if (!relationshipId) throw new Error("Relationship ID is not set");
          const [sessions] = await fetchCoachingSessions(relationshipId);
          const theSession = sessions.find(
            (session) => session.id === selectedSession
          );
          if (!theSession) throw new Error("Selected session not found");
          setCoachingSession(theSession);
          setCoachingSessionId(theSession.id);
        } else {
          resetSession();
        }
      } catch (err) {
        console.error("Error fetching session:", err);
        setError("Failed to fetch session");
      } finally {
        setIsLoading(false);
      }
    },
    [isClient, setCoachingSession, setCoachingSessionId, resetSession]
  );

  return {
    handleOrganizationSelection,
    handleRelationshipSelection,
    handleSessionSelection,
    isLoading,
    error,
    isClient,
  };
};
