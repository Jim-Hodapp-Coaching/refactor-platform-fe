// Interacts with the Organizations endpoints

import { Id } from "@/types/general";
import {
  Organization,
  defaultOrganization,
  defaultOrganizations,
  isOrganization,
  isOrganizationsArray,
  organizationToString,
  organizationsToString,
} from "@/types/organization";
import { AxiosError, AxiosResponse } from "axios";

// TODO:
// 1. Clean up the error handlers...can we make a new standard error handler
//    method that shares dealing with errors in a less repetitive way?
// 2. Create a config item for specifying the X-Version to use for requests.

export const fetchOrganizations = async (): Promise<
  [Organization[], string]
> => {
  const axios = require("axios");

  var organizations: Organization[] = defaultOrganizations();
  var err: string = "";

  const data = await axios
    .get("http://localhost:4000/organizations", {
      withCredentials: true,
      setTimeout: 5000, // 5 seconds before timing out trying to log in with the backend
      headers: {
        "X-Version": "0.0.1",
      },
    })
    .then(function (response: AxiosResponse) {
      // handle success
      if (isOrganizationsArray(response.data.data)) {
        organizations = response.data.data;
      }
    })
    .catch(function (error: AxiosError) {
      // handle error
      console.log(error.response?.status);
      if (error.response?.status == 401) {
        console.error("Retrieval of Organization failed: unauthorized.");
        err = "Retrieval of Organization failed: unauthorized.";
      } else {
        console.log(error);
        console.error("Retrieval of Organization failed.");
        err = "Retrieval of Organization failed.";
      }
    });

  return [organizations, err];
};

export const fetchOrganization = async (id: Id): Promise<Organization> => {
  const axios = require("axios");

  var organization: Organization = defaultOrganization();
  var err: string = "";

  const data = await axios
    .get(`http://localhost:4000/organizations/${id}`, {
      withCredentials: true,
      setTimeout: 5000, // 5 seconds before timing out trying to log in with the backend
      headers: {
        "X-Version": "0.0.1",
      },
    })
    .then(function (response: AxiosResponse) {
      // handle success
      if (isOrganization(response.data.data)) {
        organization = response.data.data;
      }
    })
    .catch(function (error: AxiosError) {
      // handle error
      console.error(error.response?.status);
      if (error.response?.status == 401) {
        err = "Retrieval of Organization failed: unauthorized.";
      } else {
        err = `Retrieval of Organization(` + id + `) failed.`;
      }
    });

  if (err) throw err;

  return organization;
};

export const fetchOrganizationsByUserId = async (
  userId: Id
): Promise<[Organization[], string]> => {
  const axios = require("axios");

  var organizations: Organization[] = defaultOrganizations();
  var err: string = "";

  const data = await axios
    .get(`http://localhost:4000/organizations`, {
      params: {
        user_id: userId,
      },
      withCredentials: true,
      setTimeout: 5000, // 5 seconds before timing out trying to log in with the backend
      headers: {
        "X-Version": "0.0.1",
      },
    })
    .then(function (response: AxiosResponse) {
      // handle success
      if (isOrganizationsArray(response.data.data)) {
        organizations = response.data.data;
      }
    })
    .catch(function (error: AxiosError) {
      // handle error
      console.error(error.response?.status);
      if (error.response?.status == 401) {
        console.error("Retrieval of Organizations failed: unauthorized.");
        err = "Retrieval of Organization failed: unauthorized.";
      } else {
        console.log(error);
        console.error(
          `Retrieval of Organization(s) by user Id (` + userId + `) failed.`
        );
        err =
          `Retrieval of Organization(s) by user Id (` + userId + `) failed.`;
      }
    });

  return [organizations, err];
};

export const createOrganization = async (
  organization: Organization
): Promise<[Organization, string]> => {
  const axios = require("axios");

  var createdOrganization: Organization = defaultOrganization();
  var err: string = "";

  var strOrganization: string = organizationToString(organization);
  const data = await axios
    .post(`http://localhost:4000/organizations`, strOrganization, {
      withCredentials: true,
      setTimeout: 5000, // 5 seconds before timing out trying to log in with the backend
      headers: {
        "X-Version": "0.0.1",
        "Content-Type": "application/json",
      },
    })
    .then(function (response: AxiosResponse) {
      // handle success
      if (isOrganization(response.data.data)) {
        createdOrganization = response.data.data;
      }
    })
    .catch(function (error: AxiosError) {
      // handle error
      console.error(error.response?.status);
      if (error.response?.status == 401) {
        console.error("Creation of Organization failed: unauthorized.");
        err = "Creation of Organization failed: unauthorized.";
      } else if (error.response?.status == 500) {
        console.error(
          "Creation of Organization failed: internal server error."
        );
        err = "Creation of Organization failed: internal server error.";
      } else {
        console.log(error);
        console.error(`Creation of new Organization failed.`);
        err = `Creation of new Organization failed.`;
      }
    });

  return [createdOrganization, err];
};

export const updateOrganization = async (
  id: number,
  organization: Organization
): Promise<[Organization, string]> => {
  const axios = require("axios");

  var updatedOrganization: Organization = defaultOrganization();
  var err: string = "";

  var strOrganization: string = organizationToString(organization);
  const data = await axios
    .put(`http://localhost:4000/organizations/${id}`, strOrganization, {
      withCredentials: true,
      setTimeout: 5000, // 5 seconds before timing out trying to log in with the backend
      headers: {
        "X-Version": "0.0.1",
        "Content-Type": "application/json",
      },
    })
    .then(function (response: AxiosResponse) {
      // handle success
      if (isOrganization(response.data.data)) {
        updatedOrganization = response.data.data;
      }
    })
    .catch(function (error: AxiosError) {
      // handle error
      console.error(error.response?.status);
      if (error.response?.status == 401) {
        console.error("Update of Organization failed: unauthorized.");
        err = "Update of Organization failed: unauthorized.";
      } else if (error.response?.status == 500) {
        console.error("Update of Organization failed: internal server error.");
        err = "Update of Organization failed: internal server error.";
      } else {
        console.log(error);
        console.error(`Update of new Organization failed.`);
        err = `Update of new Organization failed.`;
      }
    });

  return [updatedOrganization, err];
};

export const deleteOrganization = async (
  id: number
): Promise<[string, string]> => {
  const axios = require("axios");

  var deleted_id: string = "";
  var err: string = "";

  const data = await axios
    .delete(`http://localhost:4000/organizations/${id}`, {
      withCredentials: true,
      setTimeout: 5000, // 5 seconds before timing out trying to log in with the backend
      headers: {
        "X-Version": "0.0.1",
      },
    })
    .then(function (response: AxiosResponse) {
      // handle success
      var json = response.data;
      if ("id" in json) {
        deleted_id = json.id;
      }
    })
    .catch(function (error: AxiosError) {
      // handle error
      console.error(error.response?.status);
      if (error.response?.status == 401) {
        console.error("Deletion of Organization failed: unauthorized.");
        err = "Deletion of Organization failed: unauthorized.";
      } else if (error.response?.status == 500) {
        console.error(
          "Deletion of Organization failed: internal server error."
        );
        err = "Deletion of Organization failed: internal server error.";
      } else {
        console.log(error);
        console.error(`Deletion of Organization(` + id + `) failed.`);
        err = `Deletion of Organization(` + id + `) failed.`;
      }
    });

  return [deleted_id, err];
};
