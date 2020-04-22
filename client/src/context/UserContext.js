import React from "react";
import axios from "axios";
import { config } from "../config";

var UserStateContext = React.createContext();
var UserDispatchContext = React.createContext();

function userReducer(state, action) {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return { ...state, isAuthenticated: true };
    case "SIGN_OUT_SUCCESS":
      return { ...state, isAuthenticated: false };
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

function UserProvider({ children }) {
  var [state, dispatch] = React.useReducer(userReducer, {
    isAuthenticated: !!localStorage.getItem("jwt_token"),
  });

  return (
    <UserStateContext.Provider value={state}>
      <UserDispatchContext.Provider value={dispatch}>
        {children}
      </UserDispatchContext.Provider>
    </UserStateContext.Provider>
  );
}

function useUserState() {
  var context = React.useContext(UserStateContext);
  if (context === undefined) {
    throw new Error("useUserState must be used within a UserProvider");
  }
  return context;
}

function useUserDispatch() {
  var context = React.useContext(UserDispatchContext);
  if (context === undefined) {
    throw new Error("useUserDispatch must be used within a UserProvider");
  }
  return context;
}

export {
  UserProvider,
  useUserState,
  useUserDispatch,
  loginUser,
  registerUser,
  signOut,
};

// ###########################################################

async function loginUser(
  dispatch,
  login,
  password,
  history,
  setIsLoading,
  setError,
) {
  const { baseUrl } = config;
  setError(false);
  setIsLoading(true);

  if (!!login && !!password) {
    const creds = {
      email: login,
      password: password,
    };
    try {
      const response = await axios.post(`${baseUrl}/signin`, creds);
      const { token, user } = response.data;
      localStorage.setItem("jwt_token", token);
      localStorage.setItem("user_id", user._id);
      localStorage.setItem("user_name", user.name);
      localStorage.setItem("user_email", user.email);
      setError(null);
      setIsLoading(false);
      dispatch({ type: "LOGIN_SUCCESS" });
      // history.push("/app/dashboard");
    } catch (err) {
      console.log(err);
      setError(true);
      setIsLoading(false);
    }
  } else {
    dispatch({ type: "LOGIN_FAILURE" });
    setError(true);
    setIsLoading(false);
  }
}

async function registerUser(
  dispatch,
  name,
  email,
  password,
  history,
  setIsLoading,
  setError,
) {
  const { baseUrl } = config;
  setError(false);
  setIsLoading(true);

  if (!!name && !!email && !!password) {
    const creds = {
      name,
      email,
      password,
    };
    console.log(creds);
    try {
      const response = await axios.post(`${baseUrl}/signup`, creds);
      console.log(response)
      // localStorage.setItem("jwt_token", token);
      // localStorage.setItem("user_id", user._id);
      // localStorage.setItem("user_name", user.name);
      // localStorage.setItem("user_email", user.email);
      setError(null);
      setIsLoading(false);
      history.push("/");
      // dispatch({ type: "LOGIN_SUCCESS" });
    } catch (err) {
      console.log(err);
      setError(true);
      setIsLoading(false);
    }
  } else {
    dispatch({ type: "LOGIN_FAILURE" });
    setError(true);
    setIsLoading(false);
  }
}

function signOut(dispatch, history) {
  localStorage.removeItem("jwt_token");
  localStorage.removeItem("user_id");
  localStorage.removeItem("user_name");
  localStorage.removeItem("user_email");
  dispatch({ type: "SIGN_OUT_SUCCESS" });
  history.push("/login");
}
