// Interacts with the coaching_relationship endpoints

import { AxiosError, AxiosResponse } from "axios";
import { Id } from "@/types/general";
import { Organization, defaultOrganizations } from "@/types/organization";

export const fetchRelationshipsByOrganizationId = async (
    organizationId: Id
  ): Promise<[Relationship[], string]> => {
    const axios = require("axios");
  
    var organizations: Organization[] = defaultOrganizations();
    var err: string = "";
  
    const data = await axios
      .get(`http://localhost:4000/organizations/{:id}/coaching_relationships`, {
        params: {
          organization_id: organizationId,
        },
        withCredentials: true,
        setTimeout: 5000, // 5 seconds before timing out trying to log in with the backend
        headers: {
          "X-Version": "0.0.1",
        },
      })
      .then(function (response: AxiosResponse) {
        // handle success
        console.debug(response);
        if (isOrganizationsArray(response.data.data)) {
          organizations = response.data.data;
          console.debug(
            `Organizations: ` + organizationsToString(organizations) + `.`
          );
        }
      })
      .catch(function (error: AxiosError) {
        // handle error
        console.error(error.response?.status);
        if (error.response?.status == 401) {
          console.error("Retrieval of Coaching Relationships failed: unauthorized.");
          err = "Retrieval of Coaching Relationships failed: unauthorized.";
        } else {
          console.log(error);
          console.error(
            `Retrieval of Coaching Relationship(s) by user Id (` + organizationId + `) failed.`
          );
          err =
            `Retrieval of Coaching Relationship(s) by user Id (` + organizationId + `) failed.`;
        }
      });
  
    return [organizations, err];
  };