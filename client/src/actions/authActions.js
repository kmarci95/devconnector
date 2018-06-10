import axios from 'axios';
import { GET_ERRORS, SET_CURRENT_USER } from './types';
import setAuthToken from '../utils/setAuthToken';
import jwt_decode from 'jwt-decode';

//register
export const registeruser = (userData, history) => dispatch => {
  axios.post('/api/users/register', userData)
    .then(res => history.push('login'))
    .catch(error =>
      dispatch({
        type: GET_ERRORS,
        payload: error.response.data
      })
    );
};

//login get user
export const loginUser = (userData) => dispatch => {
  axios.post('/api/users/login', userData)
    .then(res => {
      //save to local storage
      const {token} = res.data;
      localStorage.setItem('jwtToken', token);

      //set token to auth header
      setAuthToken(token);

      //decode token to get user data
      const decoded = jwt_decode(token);

      //Set current user
      dispatch(setCurrentUser(decoded))
    })
    .catch(error =>
      dispatch({
        type: GET_ERRORS,
        payload: error.response.data
      }));
};

//set logged in user
export const setCurrentUser = (decoded) => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  }
};

//log user out
export const logoutUser = () => dispatch => {
  //remove token from local storage
  localStorage.removeItem('jwtToken');

  //remove auth header for future request
  setAuthToken(false);

  //set current user to {}, isAuth false
  dispatch(setCurrentUser({}));
};