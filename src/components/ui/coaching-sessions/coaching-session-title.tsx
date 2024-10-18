"use client";

import { useEffect, useState } from "react";
import {
  defaultSessionTitle,
  generateSessionTitle,
  SessionTitle,
  SessionTitleStyle,
} from "@/types/session-title";
import { CoachingRelationshipWithUserNames } from "@/types/coaching_relationship_with_user_names";
import { useAppStateStore } from "@/lib/providers/app-state-store-provider";

const CoachingSessionTitle: React.FC<{
  locale: string | "us";
  style: SessionTitleStyle;
  onRender: (sessionTitle: string) => void;
}> = ({ locale, style, onRender }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [sessionTitle, setSessionTitle] = useState<SessionTitle>();
  const { coachingSession, coachingRelationship } = useAppStateStore(
    (state) => state
  );
  useState<CoachingRelationshipWithUserNames>();

  useEffect(() => {
    if (coachingSession && coachingRelationship) {
      setIsLoading(false);
      const title = generateSessionTitle(
        coachingSession,
        coachingRelationship,
        style,
        locale
      );
      setSessionTitle(title);
      onRender(title.title);
    }
  }, [coachingSession, coachingRelationship, style, locale, onRender]);

  if (isLoading) {
    return (
      <h4 className="font-semibold break-words w-full px-2 md:px-4 lg:px-6 md:text-clip">
        {defaultSessionTitle().title}
      </h4>
    );
  }

  return (
    <h4 className="font-semibold break-words w-full px-2 md:px-4 lg:px-6 md:text-clip">
      {sessionTitle ? sessionTitle.title : defaultSessionTitle().title}
    </h4>
  );
};

export { CoachingSessionTitle };
