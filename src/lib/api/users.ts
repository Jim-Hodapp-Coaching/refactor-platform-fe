// Interacts with the user endpoints

import { AxiosError, AxiosResponse } from "axios";
import { getActions, getUserId } from "@/lib/app-state-store";

const {setUserId} = getActions();

export const fetchUser = async (userId: string) => {
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
console.log(response);
console.log("data: ", response.data)

const userId = response.data.data.external_id;
setUserId(userId);
console.log("user.external_id: ", userId);

router.push("/coaching-sessions");
})
.catch(function (error: AxiosError) {
// handle error
console.log(error.response?.status);
if (error.response?.status == 401) {
setError("Login failed: unauthorized");
} else {
console.log(error);
setError(`Login failed: ${error.message.toLocaleLowerCase}`);
}
})
.finally(function () {
// always executed
setTimeout(() => {
setIsLoading(false);
}, 3000);
});
}
