// Interacts with the action endpoints

import { siteConfig } from "@/site.config";
import {
  Action,
  defaultAction,
  isAction,
  isActionArray,
  parseAction,
} from "@/types/action";
import { ItemStatus, Id } from "@/types/general";
import { AxiosError, AxiosResponse } from "axios";
import { DateTime } from "ts-luxon";

export const fetchActionsByCoachingSessionId = async (
  coachingSessionId: Id
): Promise<Action[]> => {
  const axios = require("axios");

  var actions: Action[] = [];
  var err: string = "";

  const data = await axios
    .get(`${siteConfig.env.backendServiceURL}/actions`, {
      params: {
        coaching_session_id: coachingSessionId,
      },
      withCredentials: true,
      setTimeout: 5000, // 5 seconds before timing out trying to log in with the backend
      headers: {
        "X-Version": siteConfig.env.backendApiVersion,
      },
    })
    .then(function (response: AxiosResponse) {
      // handle success
      var actions_data = response.data.data;
      if (isActionArray(actions_data)) {
        actions_data.forEach((actions_data: any) => {
          actions.push(parseAction(actions_data));
        });
      }
    })
    .catch(function (error: AxiosError) {
      // handle error
      if (error.response?.status == 401) {
        err = "Retrieval of Actions failed: unauthorized.";
      } else if (error.response?.status == 404) {
        err =
          "Retrieval of Actions failed: Actions by coaching session Id (" +
          coachingSessionId +
          ") not found.";
      } else {
        err =
          `Retrieval of Actions by coaching session Id (` +
          coachingSessionId +
          `) failed.`;
      }
    });

  if (err) {
    console.error(err);
    throw err;
  }

  return actions;
};

export const createAction = async (
  coaching_session_id: Id,
  body: string,
  status: ItemStatus,
  due_by: DateTime
): Promise<Action> => {
  const axios = require("axios");

  const newActionJson = {
    coaching_session_id: coaching_session_id,
    body: body,
    due_by: due_by,
    status: status,
  };
  console.debug("newActionJson: " + JSON.stringify(newActionJson));
  // A full real action to be returned from the backend with the same body
  var createdAction: Action = defaultAction();
  var err: string = "";

  const data = await axios
    .post(`${siteConfig.env.backendServiceURL}/actions`, newActionJson, {
      withCredentials: true,
      setTimeout: 5000, // 5 seconds before timing out trying to log in with the backend
      headers: {
        "X-Version": siteConfig.env.backendApiVersion,
        "Content-Type": "application/json",
      },
    })
    .then(function (response: AxiosResponse) {
      // handle success
      const action_data = response.data.data;
      if (isAction(action_data)) {
        createdAction = parseAction(action_data);
      }
    })
    .catch(function (error: AxiosError) {
      // handle error
      console.error(error.response?.status);
      if (error.response?.status == 401) {
        err = "Creation of Action failed: unauthorized.";
      } else if (error.response?.status == 500) {
        err = "Creation of Action failed: internal server error.";
      } else {
        err = `Creation of new Action failed.`;
      }
    });

  if (err) {
    console.error(err);
    throw err;
  }

  return createdAction;
};

export const updateAction = async (
  id: Id,
  coaching_session_id: Id,
  body: string,
  status: ItemStatus,
  due_by: DateTime
): Promise<Action> => {
  const axios = require("axios");

  var updatedAction: Action = defaultAction();
  var err: string = "";

  const newActionJson = {
    coaching_session_id: coaching_session_id,
    body: body,
    status: status,
    due_by: due_by,
  };
  console.debug("newActionJson: " + JSON.stringify(newActionJson));

  const data = await axios
    .put(`${siteConfig.env.backendServiceURL}/actions/${id}`, newActionJson, {
      withCredentials: true,
      setTimeout: 5000, // 5 seconds before timing out trying to log in with the backend
      headers: {
        "X-Version": siteConfig.env.backendApiVersion,
        "Content-Type": "application/json",
      },
    })
    .then(function (response: AxiosResponse) {
      // handle success
      const action_data = response.data.data;
      if (isAction(action_data)) {
        updatedAction = parseAction(action_data);
      }
    })
    .catch(function (error: AxiosError) {
      // handle error
      console.error(error.response?.status);
      if (error.response?.status == 401) {
        err = "Update of Action failed: unauthorized.";
      } else if (error.response?.status == 500) {
        err = "Update of Action failed: internal server error.";
      } else {
        err = `Update of new Action failed.`;
      }
    });

  if (err) {
    console.error(err);
    throw err;
  }

  return updatedAction;
};

export const deleteAction = async (id: Id): Promise<Action> => {
  const axios = require("axios");

  var deletedAction: Action = defaultAction();
  var err: string = "";

  const data = await axios
    .delete(`${siteConfig.env.backendServiceURL}/actions/${id}`, {
      withCredentials: true,
      setTimeout: 5000, // 5 seconds before timing out trying to log in with the backend
      headers: {
        "X-Version": siteConfig.env.backendApiVersion,
        "Content-Type": "application/json",
      },
    })
    .then(function (response: AxiosResponse) {
      // handle success
      const action_data = response.data.data;
      if (isAction(action_data)) {
        deletedAction = parseAction(action_data);
      }
    })
    .catch(function (error: AxiosError) {
      // handle error
      console.error(error.response?.status);
      if (error.response?.status == 401) {
        err = "Deletion of Action failed: unauthorized.";
      } else if (error.response?.status == 500) {
        err = "Deletion of Action failed: internal server error.";
      } else {
        err = `Deletion of Action failed.`;
      }
    });

  if (err) {
    console.error(err);
    throw err;
  }

  return deletedAction;
};
