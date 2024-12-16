// Interacts with the overarching_goal endpoints

import {
  OverarchingGoal,
  defaultOverarchingGoal,
  isOverarchingGoal,
  isOverarchingGoalArray,
  parseOverarchingGoal,
} from "@/types/overarching-goal";
import { ItemStatus, Id } from "@/types/general";
import { AxiosError, AxiosResponse } from "axios";
import { siteConfig } from "@/site.config";

export const fetchOverarchingGoalsByCoachingSessionId = async (
  coachingSessionId: Id
): Promise<OverarchingGoal[]> => {
  const axios = require("axios");

  var goals: OverarchingGoal[] = [];
  var err: string = "";

  await axios
    .get(`${siteConfig.env.backendServiceURL}/overarching_goals`, {
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
      var goals_data = response.data.data;
      if (isOverarchingGoalArray(goals_data)) {
        goals_data.forEach((goals_data: any) => {
          goals.push(parseOverarchingGoal(goals_data));
        });
      }
    })
    .catch(function (error: AxiosError) {
      // handle error
      if (error.response?.status == 401) {
        err = "Retrieval of OverarchingGoals failed: unauthorized.";
      } else if (error.response?.status == 404) {
        err =
          "Retrieval of OverarchingGoals failed: OverarchingGoals by coaching session Id (" +
          coachingSessionId +
          ") not found.";
      } else {
        err =
          `Retrieval of OverarchingGoals by coaching session Id (` +
          coachingSessionId +
          `) failed.`;
      }
    });

  if (err) {
    console.error(err);
    throw err;
  }

  return goals;
};

export const createOverarchingGoal = async (
  coaching_session_id: Id,
  title: string,
  body: string,
  status: ItemStatus
): Promise<OverarchingGoal> => {
  const axios = require("axios");

  const newOverarchingGoalJson = {
    coaching_session_id: coaching_session_id,
    title: title,
    body: body,
    status: status,
  };
  console.debug(
    "newOverarchingGoalJson: " + JSON.stringify(newOverarchingGoalJson)
  );
  // A full real action to be returned from the backend with the same body
  var createdOverarchingGoal: OverarchingGoal = defaultOverarchingGoal();
  var err: string = "";

  await axios
    .post(
      `${siteConfig.env.backendServiceURL}/overarching_goals`,
      newOverarchingGoalJson,
      {
        withCredentials: true,
        setTimeout: 5000, // 5 seconds before timing out trying to log in with the backend
        headers: {
          "X-Version": siteConfig.env.backendApiVersion,
          "Content-Type": "application/json",
        },
      }
    )
    .then(function (response: AxiosResponse) {
      // handle success
      const goal_data = response.data.data;
      if (isOverarchingGoal(goal_data)) {
        createdOverarchingGoal = parseOverarchingGoal(goal_data);
      }
    })
    .catch(function (error: AxiosError) {
      // handle error
      console.error(error.response?.status);
      if (error.response?.status == 401) {
        err = "Creation of OverarchingGoal failed: unauthorized.";
      } else if (error.response?.status == 500) {
        err = "Creation of OverarchingGoal failed: internal server error.";
      } else {
        err = `Creation of new OverarchingGoal failed.`;
      }
    });

  if (err) {
    console.error(err);
    throw err;
  }

  return createdOverarchingGoal;
};

export const updateOverarchingGoal = async (
  id: Id,
  coaching_session_id: Id,
  title: string,
  body: string,
  status: ItemStatus
): Promise<OverarchingGoal> => {
  const axios = require("axios");

  var updatedOverarchingGoal: OverarchingGoal = defaultOverarchingGoal();
  var err: string = "";

  const toUpdateOverarchingGoalJson = {
    id: id,
    coaching_session_id: coaching_session_id,
    title: title,
    body: body,
    status: status,
  };
  console.debug(
    "toUpdateOverarchingGoalJson: " +
      JSON.stringify(toUpdateOverarchingGoalJson)
  );

  await axios
    .put(
      `${siteConfig.env.backendServiceURL}/overarching_goals/${id}`,
      toUpdateOverarchingGoalJson,
      {
        withCredentials: true,
        setTimeout: 5000, // 5 seconds before timing out trying to log in with the backend
        headers: {
          "X-Version": siteConfig.env.backendApiVersion,
          "Content-Type": "application/json",
        },
      }
    )
    .then(function (response: AxiosResponse) {
      // handle success
      const goal_data = response.data.data;
      if (isOverarchingGoal(goal_data)) {
        updatedOverarchingGoal = parseOverarchingGoal(goal_data);
      }
    })
    .catch(function (error: AxiosError) {
      // handle error
      console.error(error.response?.status);
      if (error.response?.status == 401) {
        err = "Update of OverarchingGoal failed: unauthorized.";
      } else if (error.response?.status == 500) {
        err = "Update of OverarchingGoal failed: internal server error.";
      } else {
        err = `Update of new OverarchingGoal failed: ${error.response?.statusText}`;
      }
    });

  if (err) {
    console.error(err);
    throw err;
  }

  return updatedOverarchingGoal;
};

export const deleteOverarchingGoal = async (
  id: Id
): Promise<OverarchingGoal> => {
  const axios = require("axios");

  var deletedOverarchingGoal: OverarchingGoal = defaultOverarchingGoal();
  var err: string = "";

  await axios
    .delete(`${siteConfig.env.backendServiceURL}/overarching_goals/${id}`, {
      withCredentials: true,
      setTimeout: 5000, // 5 seconds before timing out trying to log in with the backend
      headers: {
        "X-Version": siteConfig.env.backendApiVersion,
        "Content-Type": "application/json",
      },
    })
    .then(function (response: AxiosResponse) {
      // handle success
      const goal_data = response.data.data;
      if (isOverarchingGoal(goal_data)) {
        deletedOverarchingGoal = parseOverarchingGoal(goal_data);
      }
    })
    .catch(function (error: AxiosError) {
      // handle error
      console.error(error.response?.status);
      if (error.response?.status == 401) {
        err = "Deletion of OverarchingGoal failed: unauthorized.";
      } else if (error.response?.status == 500) {
        err = "Deletion of OverarchingGoal failed: internal server error.";
      } else {
        err = `Deletion of OverarchingGoal failed.`;
      }
    });

  if (err) {
    console.error(err);
    throw err;
  }

  return deletedOverarchingGoal;
};
