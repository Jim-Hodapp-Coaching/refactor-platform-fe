"use client";

import { useEffect, useState } from "react";
import {
  generateSessionTitle,
  SessionTitle,
  SessionTitleStyle,
} from "@/types/session-title";
import { CoachingRelationshipWithUserNames } from "@/types/coaching_relationship_with_user_names";
import { CoachingSession } from "@/types/coaching-session";

const CoachingSessionTitle: React.FC<{
  coachingSession: CoachingSession;
  coachingRelationship: CoachingRelationshipWithUserNames;
  locale: string | "us";
  style: SessionTitleStyle;
  onRender: (sessionTitle: string) => void;
}> = ({ coachingSession, coachingRelationship, locale, style, onRender }) => {
  const [sessionTitle, setSessionTitle] = useState<SessionTitle>();

  useEffect(() => {
    async function getSessionTitle() {
      const sessionTitle = generateSessionTitle(
        coachingSession,
        coachingRelationship,
        style,
        locale
      );
      setSessionTitle(sessionTitle);
      console.debug("sessionTitle: " + JSON.stringify(sessionTitle));
      onRender(sessionTitle.title);
    }

    getSessionTitle();
  }, [coachingSession, coachingRelationship]);

  return (
    <h4 className="font-semibold break-words w-full px-2 md:px-4 lg:px-6 md:text-clip">
      {sessionTitle?.title}
    </h4>
  );
};

export { CoachingSessionTitle };
