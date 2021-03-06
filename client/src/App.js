import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from "./components/layout/Footer";
import Landing from "./components/layout/Landing";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import { Provider } from 'react-redux';
import store from './store';
import jwt_decode from 'jwt-decode';
import setAuthToken from './utils/setAuthToken';
import { logoutUser, setCurrentUser } from "./actions/authActions";
import Dashboard from './components/dashboard/Dashboard';
import { clearCurrentProfile } from "./actions/profileActions";
import PrivateRoute from './components/common/PrivateRoute';
import CreateProfile from './components/create-profile/CreateProfile';
import EditProfile from "./components/edit-profile/EditProfile";
import AddExperience from './components/add-credentials/AddExperience';
import AddEducation from "./components/add-credentials/AddEducation";
import Profiles from './components/profiles/Profiles';
import Profile from "./components/profile/Profile";
import NotFound from "./components/not-found/NoutFound";
import Posts from "./components/posts/Posts";
import Post from "./components/post/Post";

import './App.css';

//check for token
if(localStorage.jwtToken) {
  //set auth token header auth
  setAuthToken(localStorage.jwtToken);

  //decode token and get user info and exp
  const decoded = jwt_decode(localStorage.jwtToken);

  //set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));

  //check for expired token
  const currentTime = Date.now() / 1000;
  if(decoded.exp < currentTime) {
    //Logout
    store.dispatch(logoutUser());

    //clear current profile
    store.dispatch(clearCurrentProfile());

    //redirect to login
    window.location.href = '/login';
  }
}

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <div className="App">
            <Navbar/>
            <Route path="/" component={Landing} exact/>
            <div className="container">
              <Route exact path="/profiles" component={Profiles}/>
              <Route exact path="/register" component={Register}/>
              <Route exact path="/login" component={Login}/>
              <Route exact path="/profile/:handle" component={Profile}/>
              <Route exact path="/not-found" component={NotFound}/>
              <Switch>
                <PrivateRoute exact path="/dashboard" component={Dashboard}/>
                <PrivateRoute exact path="/create-profile" component={CreateProfile}/>
                <PrivateRoute exact path="/edit-profile" component={EditProfile}/>
                <PrivateRoute exact path="/add-experience" component={AddExperience}/>
                <PrivateRoute exact path="/add-education" component={AddEducation}/>
                <PrivateRoute exact path="/feed" component={Posts}/>
                <PrivateRoute exact path="/post/:id" component={Post}/>
              </Switch>
            </div>
            <Footer/>
          </div>
        </BrowserRouter>
      </Provider>
    );
  }
}

export default App;
