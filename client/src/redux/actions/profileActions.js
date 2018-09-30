import axios from "axios";

import {
  GET_PROFILE,
  PROFILE_LOADING,
  CLEAR_CURRENT_PROFILE,
  GET_ERRORS
} from "./types";

export const getProfile = () => dispatch => {
  dispatch(profileLoading());
  axios
    .get("/api/profile")
    .then(res =>
      dispatch({
        type: GET_PROFILE,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_PROFILE,
        payload: {}
      })
    );
};

export const createProfile = (data, history) => dispatch => {
  axios
    .post("/api/profile/", data)
    .then(res => {
      history.push("/dashboard");
    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};

export const profileLoading = () => {
  return {
    type: PROFILE_LOADING
  };
};

export const clearProfile = () => {
  return {
    type: CLEAR_CURRENT_PROFILE
  };
};
