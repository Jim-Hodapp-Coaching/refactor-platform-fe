// Interacts with the Organizations endpoints

import { siteConfig } from "@/site.config";
import { Id } from "@/types/general";
import {
  Organization,
  defaultOrganization,
  defaultOrganizations,
  isOrganization,
  isOrganizationsArray,
  organizationToString,
} from "@/types/organization";
import { AxiosError, AxiosResponse } from "axios";

export const fetchOrganizations = async (): Promise<
  [Organization[], string]
> => {
  const axios = require("axios");

  var organizations: Organization[] = defaultOrganizations();
  var err: string = "";

  const data = await axios
    .get(`${siteConfig.env.backendServiceURL}/organizations`, {
      withCredentials: true,
      setTimeout: 5000, // 5 seconds before timing out trying to log in with the backend
      headers: {
        "X-Version": siteConfig.env.backendApiVersion,
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

export const fetchOrganization = async (
  id: Id
): Promise<[Organization, string]> => {
  const axios = require("axios");

  var organization: Organization = defaultOrganization();
  var err: string = "";

  const data = await axios
    .get(`${siteConfig.env.backendServiceURL}/organizations/${id}`, {
      withCredentials: true,
      setTimeout: 5000, // 5 seconds before timing out trying to log in with the backend
      headers: {
        "X-Version": siteConfig.env.backendApiVersion,
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
        console.error("Retrieval of Organization failed: unauthorized.");
        err = "Retrieval of Organization failed: unauthorized.";
      } else {
        console.log(error);
        console.error(`Retrieval of Organization(` + id + `) failed.`);
        err = `Retrieval of Organization(` + id + `) failed.`;
      }
    });

  return [organization, err];
};

export const fetchOrganizationsByUserId = async (
  userId: Id
): Promise<[Organization[], string]> => {
  const axios = require("axios");

  var organizations: Organization[] = defaultOrganizations();
  var err: string = "";

  const data = await axios
    .get(`${siteConfig.env.backendServiceURL}/organizations`, {
      params: {
        user_id: userId,
      },
      withCredentials: true,
      setTimeout: 5000, // 5 seconds before timing out trying to log in with the backend
      headers: {
        "X-Version": siteConfig.env.backendApiVersion,
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
    .post(
      `${siteConfig.env.backendServiceURL}/organizations`,
      strOrganization,
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
    .put(
      `${siteConfig.env.backendServiceURL}/organizations/${id}`,
      strOrganization,
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
    .delete(`${siteConfig.env.backendServiceURL}/organizations/${id}`, {
      withCredentials: true,
      setTimeout: 5000, // 5 seconds before timing out trying to log in with the backend
      headers: {
        "X-Version": siteConfig.env.backendApiVersion,
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
