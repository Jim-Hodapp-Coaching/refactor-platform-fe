// Interacts with the note endpoints

import { Agreement, defaultAgreement, isAgreement, isAgreementArray, parseAgreement } from "@/types/agreement";
import { CompletionStatus, Id } from "@/types/general";
import { AxiosError, AxiosResponse } from "axios";
import { DateTime } from "ts-luxon";

export const fetchAgreementsByCoachingSessionId = async (
    coachingSessionId: Id
  ): Promise<Agreement[]> => {
    const axios = require("axios");
  
    var agreements: Agreement[] = [];
    var err: string = "";
  
    const data = await axios
      .get(`http://localhost:4000/agreements`, {
        params: {
          coaching_session_id: coachingSessionId,
        },
        withCredentials: true,
        setTimeout: 5000, // 5 seconds before timing out trying to log in with the backend
        headers: {
          "X-Version": "0.0.1",
        },
      })
      .then(function (response: AxiosResponse) {
        // handle success
        var agreements_data = response.data.data;
        if (isAgreementArray(agreements_data)) {
            agreements_data.forEach((agreements_data: any) => {
                agreements.push(parseAgreement(agreements_data))
            });
        }
      })
      .catch(function (error: AxiosError) {
        // handle error
        if (error.response?.status == 401) {
          err = "Retrieval of Agreements failed: unauthorized.";
        } else if (error.response?.status == 404) {
          err = "Retrieval of Agreements failed: Agreements by coaching session Id (" + coachingSessionId + ") not found.";
        } else {
          err =
            `Retrieval of Agreements by coaching session Id (` + coachingSessionId + `) failed.`;
        }
      });

    if (err) {
      console.error(err);
      throw err;
    }
  
    return agreements;
  };

export const createAgreement = async (
    coaching_session_id: Id,
    user_id: Id,
    body: string
  ): Promise<Agreement> => {
    const axios = require("axios");
  
    const newAgreementJson = {
        coaching_session_id: coaching_session_id,
        user_id: user_id,
        body: body,
        status: CompletionStatus.NotStarted,
        status_changed_at: DateTime.now()
    };
    console.debug("newAgreementJson: " + JSON.stringify(newAgreementJson));
    // A full real note to be returned from the backend with the same body
    var createdAgreement: Agreement = defaultAgreement();
    var err: string = "";
  
    const data = await axios
      .post(`http://localhost:4000/agreements`, newAgreementJson, {
        withCredentials: true,
        setTimeout: 5000, // 5 seconds before timing out trying to log in with the backend
        headers: {
          "X-Version": "0.0.1",
          "Content-Type": "application/json",
        },
      })
      .then(function (response: AxiosResponse) {
        // handle success
        const agreementStr = response.data.data;
        if (isAgreement(agreementStr)) {
          createdAgreement = parseAgreement(agreementStr);
        }
      })
      .catch(function (error: AxiosError) {
        // handle error
        console.error(error.response?.status);
        if (error.response?.status == 401) {
          err = "Creation of Agreement failed: unauthorized.";
        } else if (error.response?.status == 500) {
          err = "Creation of Agreement failed: internal server error.";
        } else {
          err = `Creation of new Agreement failed.`;
        }
      }
    );
    
    if (err) {
      console.error(err);
      throw err;
    }
  
    return createdAgreement;
  };

  export const updateAgreement = async (
    id: Id,
    user_id: Id,
    coaching_session_id: Id,
    body: string,
  ): Promise<Agreement> => {
    const axios = require("axios");
  
    var updatedAgreement: Agreement = defaultAgreement();
    var err: string = "";
  
    const newAgreementJson = {
        coaching_session_id: coaching_session_id,
        user_id: user_id,
        body: body
    };

    const data = await axios
      .put(`http://localhost:4000/agreements/${id}`, newAgreementJson, {
        withCredentials: true,
        setTimeout: 5000, // 5 seconds before timing out trying to log in with the backend
        headers: {
          "X-Version": "0.0.1",
          "Content-Type": "application/json",
        },
      })
      .then(function (response: AxiosResponse) {
        // handle success
        if (isAgreement(response.data.data)) {
          updatedAgreement = response.data.data;
        }
      })
      .catch(function (error: AxiosError) {
        // handle error
        console.error(error.response?.status);
        if (error.response?.status == 401) {
          err = "Update of Agreement failed: unauthorized.";
        } else if (error.response?.status == 500) {
          err = "Update of Agreement failed: internal server error.";
        } else {
          err = `Update of new Agreement failed.`;
        }
      });

    if (err) {
      console.error(err);
      throw err;
    }
  
    return updatedAgreement;
  };

  export const deleteAgreement = async (
    id: Id
  ): Promise<Agreement> => {
    const axios = require("axios");
  
    var deletedAgreement: Agreement = defaultAgreement();
    var err: string = "";
  
    const data = await axios
      .delete(`http://localhost:4000/agreements/${id}`, {
        withCredentials: true,
        setTimeout: 5000, // 5 seconds before timing out trying to log in with the backend
        headers: {
          "X-Version": "0.0.1",
          "Content-Type": "application/json",
        },
      })
      .then(function (response: AxiosResponse) {
        // handle success
        if (isAgreement(response.data.data)) {
          deletedAgreement = response.data.data;
        }
      })
      .catch(function (error: AxiosError) {
        // handle error
        console.error(error.response?.status);
        if (error.response?.status == 401) {
          err = "Deletion of Agreement failed: unauthorized.";
        } else if (error.response?.status == 500) {
          err = "Deletion of Agreement failed: internal server error.";
        } else {
          err = `Deletion of new Agreement failed.`;
        }
      });

    if (err) {
      console.error(err);
      throw err;
    }
  
    return deletedAgreement;
  };
