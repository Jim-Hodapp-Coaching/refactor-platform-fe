// Interacts with the coaching_session endpoints

import { siteConfig } from "@/site.config";
import {
  CoachingSession,
  isCoachingSessionArray,
  parseCoachingSession,
  sortCoachingSessionArray,
} from "@/types/coaching-session";
import { Id, SortOrder } from "@/types/general";
import axios, { AxiosError, AxiosResponse } from "axios";
import useSWR from "swr";
import { DateTime } from "ts-luxon";

// TODO: for now we hardcode a 2 month window centered around now,
// eventually we want to make this be configurable somewhere
// (either on the page or elsewhere)
const fromDate = DateTime.now().minus({ month: 1 }).toISODate();
const toDate = DateTime.now().plus({ month: 1 }).toISODate();

interface ApiResponse {
  status_code: number;
  data: CoachingSession[];
}

const fetcher = async (
  url: string,
  relationshipId: Id
): Promise<CoachingSession[]> =>
  axios
    .get<ApiResponse>(url, {
      params: {
        coaching_relationship_id: relationshipId,
        from_date: fromDate,
        to_date: toDate,
      },
      withCredentials: true,
      timeout: 5000,
      headers: {
        "X-Version": siteConfig.env.backendApiVersion,
      },
    })
    .then((res) => res.data.data);

/// A hook to retrieve all CoachingSessions associated with relationshipId
export function useCoachingSessions(relationshipId: Id) {
  console.debug(`relationshipId: ${relationshipId}`);
  console.debug("fromDate: " + fromDate);
  console.debug("toDate: " + toDate);

  const { data, error, isLoading } = useSWR<CoachingSession[]>(
    [`${siteConfig.env.backendServiceURL}/coaching_sessions`, relationshipId],
    ([url, _token]) => fetcher(url, relationshipId)
  );

  console.debug(`data: ${JSON.stringify(data)}`);

  return {
    coachingSessions: Array.isArray(data) ? data : [],
    isLoading,
    isError: error,
  };
}

export const fetchCoachingSessions = async (
  coachingRelationshipId: Id
): Promise<[CoachingSession[], string]> => {
  const axios = require("axios");

  var coaching_sessions: CoachingSession[] = [];
  var err: string = "";

  console.debug("fromDate: " + fromDate);
  console.debug("toDate: " + toDate);

  const data = await axios
    .get(`${siteConfig.env.backendServiceURL}/coaching_sessions`, {
      params: {
        coaching_relationship_id: coachingRelationshipId,
        from_date: fromDate,
        to_date: toDate,
      },
      withCredentials: true,
      setTimeout: 5000, // 5 seconds before timing out trying to log in with the backend
      headers: {
        "X-Version": siteConfig.env.backendApiVersion,
      },
    })
    .then(function (response: AxiosResponse) {
      // handle success
      var sessions_data = response.data.data;
      if (isCoachingSessionArray(sessions_data)) {
        // Sort returned sessions in ascending order by their date field
        sessions_data = sortCoachingSessionArray(
          sessions_data,
          SortOrder.Ascending
        );

        sessions_data.forEach((session_data: any) => {
          coaching_sessions.push(parseCoachingSession(session_data));
        });
      }
    })
    .catch(function (error: AxiosError) {
      // handle error
      console.error(error.response?.status);
      if (error.response?.status == 401) {
        console.error("Retrieval of CoachingSessions failed: unauthorized.");
        err = "Retrieval of CoachingSessions failed: unauthorized.";
      } else {
        console.log(error);
        console.error(
          `Retrieval of CoachingSessions by coaching relationship Id (` +
            coachingRelationshipId +
            `) failed.`
        );
        err =
          `Retrieval of CoachingSessions by coaching relationship Id (` +
          coachingRelationshipId +
          `) failed.`;
      }
    });

  return [coaching_sessions, err];
};
