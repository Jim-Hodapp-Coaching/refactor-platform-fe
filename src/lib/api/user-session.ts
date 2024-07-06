// Interacts with the user_session_controller endpoints
import { Id } from "@/types/general";
import { AxiosError, AxiosResponse } from "axios";

export const loginUser = async (email: string, password: string): Promise<[Id, string]> => {
    const axios = require("axios");

    console.log("email: ", email);
    console.log("password: ", password.replace(/./g, "*"));

    var userId: Id = "";
    var err: string = "";

    const data = await axios
      .post(
        "http://localhost:4000/login",
        {
          email: email,
          password: password,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          setTimeout: 5000, // 5 seconds before timing out trying to log in with the backend
        }
      )
      .then(function (response: AxiosResponse) {
        // handle success
        userId = response.data.data.id;
      })
      .catch(function (error: AxiosError) {
        // handle error
        console.error(error.response?.status);
        if (error.response?.status == 401) {
            err = "Login failed: unauthorized";
        } else {
            console.error(error);
            err = `Login failed: ${error.message}`;
        }
      })

      return [userId, err];
}

export const logoutUser = async (): Promise<string> => {
    const axios = require("axios");

    const data = await axios
        .get(
          "http://localhost:4000/logout",
          {
            withCredentials: true,
            setTimeout: 5000, // 5 seconds before timing out trying to log in with the backend
          }
        )
        .then(function (response: AxiosResponse) {
          // handle success
          console.debug(response);
        })
        .catch(function (error: AxiosError) {
          // handle error
          console.error(`Logout failed: ${error.message}`);
          return(`Logout failed: ${error.message}`);
        })

        return "";
}
