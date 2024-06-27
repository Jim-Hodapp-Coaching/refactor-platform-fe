// Interacts with the coaching_relationship endpoints

import { CoachingRelationshipWithUserNames,
            coachingRelationshipsWithUserNamesToString,
            defaultCoachingRelationshipsWithUserNames,
            isCoachingRelationshipWithUserNamesArray
        } from "@/types/coaching_relationship_with_user_names";
import { Id } from "@/types/general";
import { AxiosError, AxiosResponse } from "axios";

export const fetchCoachingRelationshipsWithUserNames = async (
    organizationId: Id
  ): Promise<[CoachingRelationshipWithUserNames[], string]> => {
    const axios = require("axios");
  
    var relationships: CoachingRelationshipWithUserNames[] = defaultCoachingRelationshipsWithUserNames();
    var err: string = "";
  
    const data = await axios
      .get(`http://localhost:4000/organizations/${organizationId}/coaching_relationships`, {
        withCredentials: true,
        setTimeout: 5000, // 5 seconds before timing out trying to log in with the backend
        headers: {
          "X-Version": "0.0.1",
        },
      })
      .then(function (response: AxiosResponse) {
        // handle success
        console.debug(response);
        if (isCoachingRelationshipWithUserNamesArray(response.data.data)) {
          relationships = response.data.data;
          console.debug(
            `CoachingRelationshipsWithUserNames: ` + coachingRelationshipsWithUserNamesToString(relationships) + `.`
          );
        }
      })
      .catch(function (error: AxiosError) {
        // handle error
        console.error(error.response?.status);
        if (error.response?.status == 401) {
          console.error("Retrieval of CoachingRelationshipsWithUserNames failed: unauthorized.");
          err = "Retrieval of CoachingRelationshipsWithUserNames failed: unauthorized.";
        } else {
          console.log(error);
          console.error(
            `Retrieval of CoachingRelationshipsWithUserNames by organization Id (` + organizationId + `) failed.`
          );
          err =
            `Retrieval of CoachingRealtionshipsWithUserNames by organization Id (` + organizationId + `) failed.`;
        }
      });
  
    return [relationships, err];
  };