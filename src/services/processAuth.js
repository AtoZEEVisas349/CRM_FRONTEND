const API_BASE_URL = "https://crm-backend-production-c208.up.railway.app/api";
const BASE_HEADERS = {
  "Content-Type": "application/json",
  "x-company-id": "549403a0-8e59-440f-a381-17ae457c60c4",
};

/*------------------------------LOGIN---------------------------*/
export const loginUser = async (email, password) => {
  const tryLogin = async (userType) => {
    const res = await fetch(`${API_BASE_URL}/${userType}/login`, {
      method: "POST",
      headers: BASE_HEADERS,
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) throw await res.json();
    const data = await res.json();
    return { ...data, type: userType };
  };

  try {
    return await tryLogin("customer");
  } catch (err1) {
    try {
      return await tryLogin("processperson");
    } catch (err2) {
      const errorMessage =
        err2?.message || err1?.message || "Login failed for both user types.";
      throw new Error(errorMessage);
    }
  }
};

/*------------------------------SIGNUP---------------------------*/
export const signupUser = async (fullName, email, password, userType = "customer") => {
  const res = await fetch(`${API_BASE_URL}/${userType}/signup`, {
    method: "POST",
    headers: BASE_HEADERS,
    credentials: "include",
    body: JSON.stringify({ fullName, email, password }),
  });

  const responseBody = await res.json();
  if (!res.ok) {
    console.error("Signup API error details:", responseBody);
    throw new Error(responseBody.error || "Signup failed");
  }

  return responseBody;
};
/*------------------------------LOGOUT---------------------------*/
export const logoutUser = async (userType = "customer") => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_BASE_URL}/${userType}/logout`, {
    method: "POST",
    headers: {
      ...BASE_HEADERS,
      Authorization: `Bearer ${token}`,
    },
    credentials: "include", // still needed for cookie fallback
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Logout failed");
  return data;
};

