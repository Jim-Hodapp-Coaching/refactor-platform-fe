// Interacts with the coaching_relationship endpoints

import { CoachingRelationshipWithUserNames,
            coachingRelationshipsWithUserNamesToString,
            defaultCoachingRelationshipsWithUserNames,
            isCoachingRelationshipWithUserNamesArray
        } from "@/types/coaching_relationship_with_user_names";
import { Id } from "@/types/general";
import axios, { AxiosError, AxiosResponse, AxiosStatic } from "axios";

export const fetchCoachingRelationshipsWithUserNames = async (
    organizationId: Id
  ): Promise<[CoachingRelationshipWithUserNames[], string]> => {
    const baseUrl = `http://localhost:4000/organizations/${organizationId}/coaching_relationships`;
    const config = {
      withCredentials: true,
      timeout: 5000,
      headers: {
        "X-Version": "0.0.1",
      },
    };
    var relationships: CoachingRelationshipWithUserNames[] = defaultCoachingRelationshipsWithUserNames();
    var err: string = "";

    try {
      const response: AxiosResponse = await axios.get(baseUrl, config);
      console.debug(`AxiosResponse: ${response}`);

      if(isCoachingRelationshipWithUserNamesArray(response.data.data)) {
        relationships = response.data.data;
        console.debug(`CoachingRelationshipsWithUserNames: ${coachingRelationshipsWithUserNamesToString(relationships)}.`);
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error(axiosError.response?.status);

      if(axiosError.response?.status === 401) {
        console.error("Retrieval of CoachingRelationshipsWithUserNames failed: unauthorized.");
        err = "Retrieval of CoachingRelationshipsWithUserNames failed: unauthorized.";
      } else {
        console.log(error);
        console.error(
          `Retrieval of CoachingRelationshipsWithUserNames by organization Id (` + organizationId + `) failed.`
        );
        err =
          `Retrieval of CoachingRelationshipsWithUserNames by organization Id (` + organizationId + `) failed.`;
      }
    } 
    return [relationships, err];
  };