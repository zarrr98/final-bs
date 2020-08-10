import React from "react";
import ReactDOM from "react-dom";
import strings from "./utils/strings";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  useParams,
} from "react-router-dom";
import BackDrop from "./components/Backdrop";
import SignupPage from "./screens/signupPage";
import LoginPage from "./screens/loginPage";
import AlertPage from "./screens/AlertPage";
import ResumeForm from "./screens/resumeForm";
import EmployerDashboard from "./screens/employerDashboard";
import TranslatorDashboard from "./screens/translatorDashboard";
import TranslatorList from "./screens/translatorList";
import AdvertisementList from "./screens/advertisementList";
import MainPage from "./screens/mainPage";
import ProfilePage from "./screens/profilePage";
import ProjectPage from "./screens/projectPage";
import HelpPage from "./screens/helpPage";
import AlertMessageList from "./screens/alertMessageList";
import MessagePage from "./screens/messagePage";
import { StorageSetItem, StrorageGetItem, URL } from "./utils/configs";
import { FetchData } from "./utils/services";

import Tabs from "./components/tabs";

import { Button } from "react-bootstrap";

import "./index.css";

class App extends React.Component {
  state = {
    sideDrawerOpen: false,
    profile: null,
    currentTranslator: {}, //the translator that some employer is seeing their page.
    isProjectPage: false, // the place that the translator is being seen (projectPage or translatorlists)
    //exitedProfile: { token: "" },
  };

  drawerToggleClickHandler = () => {
    this.setState((prevState) => {
      return {
        sideDrawerOpen: !prevState.sideDrawerOpen,
      };
    });
  };

  backDropClickHandler = () => {
    this.setState({
      sideDrawerOpen: false,
    });
  };

  setProfile = (profile) => {
    this.setState({
      profile: profile,
    });
  };
  updateProfile = (translatorFields) => {
    const { profile } = this.state;
    this.setState({
      profile: { ...profile, translatorFields },
    });
    console.log("updateProfile called. profile in states : ", profile);
  };

  setCurrentTranslator = (translator) => {
    this.setState({ currentTranslator: translator });
  };

  setIsProjectPage = (isProjectPage) => {
    this.setState({ isProjectPage });
  };

  getProfile = () => {
    let profile = !StrorageGetItem("profile", true)
      ? this.state.profile && console.log("get profile - a")
      : !this.state.profile
      ? StrorageGetItem("profile", true) && console.log("get profile - b")
      : StrorageGetItem("profile", true)._id !== this.state.profile._id
      ? this.state.profile && console.log("get profile - c")
      : this.state.profile && console.log("get profile - d")

    return profile;
  };

  updateProfileFromServer = async () => {
    let profile = this.getProfile();
    if (profile) {
      console.log("$$$$old profile in update profile : ", profile)
      let data = await FetchData(
        `${URL.protocol}://${URL.baseURL}:${URL.port}/projectTranslator/${profile._id}`,
        profile ? profile.token : ""
      );

      if (data) {
        if (data.status === 200 && profile._id === data.resolve._id) {
          let newProfile = { ...profile, ...data.resolve };
          console.log("$$$$ new prifile : ", newProfile)
          this.setProfile(newProfile);
          StorageSetItem("profile", newProfile, true);
        } else if (data.status === 413) {
          this.setProfile(null);

          window.location = "/";
          localStorage.removeItem("profile");
        }
      }
    }
  };

  componentDidMount = () => {
    let updateProfile = setInterval(this.updateProfileFromServer, 30000); //every 1 minutes (60s * 1000)
    this.setState({updateProfile})
  }

  componentWillUnmount = () => {
    clearInterval(this.state.updateProfile)
  }
  render() {
    let backDrop;
    if (this.state.sideDrawerOpen) {
      backDrop = <BackDrop backDropClickHandler={this.backDropClickHandler} />;
    }
    let profile = this.getProfile();
    return (
      <Router>
        <Route exact path={`/`}>
          <MainPage
            profile={profile}
            backDropClickHandler={this.backDropClickHandler}
            drawerToggleClickHandler={this.drawerToggleClickHandler}
            sideDrawerOpen={this.state.sideDrawerOpen}
          />
        </Route>
        <Route exact path={`/help`}>
          <HelpPage
            profile={profile}
            backDropClickHandler={this.backDropClickHandler}
            drawerToggleClickHandler={this.drawerToggleClickHandler}
            sideDrawerOpen={this.state.sideDrawerOpen}
          />
        </Route>
        <Route exact path={`/signup`}>
          <SignupPage setProfile={this.setProfile} />
        </Route>
        <Route exact path={`/login`}>
          <LoginPage setProfile={this.setProfile} />
        </Route>
        <Route exact path={`/alert`}>
          <AlertPage />
        </Route>
        <Route exact path={`/fillResume`}>
          <ResumeForm
            updateProfile={this.updateProfile}
            setProfile={this.setProfile}
          />
        </Route>
        <Route exact path={`/profile`}>
          {
            // !profile ? null :
            !!profile && profile.role === strings.screens.translator ? (
              <TranslatorDashboard
                profile={profile}
                backDropClickHandler={this.backDropClickHandler}
                drawerToggleClickHandler={this.drawerToggleClickHandler}
                sideDrawerOpen={this.state.sideDrawerOpen}
                setProfile={this.setProfile}
              />
            ) : (
              <EmployerDashboard
                profile={profile}
                backDropClickHandler={this.backDropClickHandler}
                drawerToggleClickHandler={this.drawerToggleClickHandler}
                sideDrawerOpen={this.state.sideDrawerOpen}
                setProfile={this.setProfile}
              />
            )
          }
        </Route>

        <Route exact path={`/profile/myProject`}>
          <ProjectPage
            profile={profile}
            backDropClickHandler={this.backDropClickHandler}
            drawerToggleClickHandler={this.drawerToggleClickHandler}
            sideDrawerOpen={this.state.sideDrawerOpen}
            setCurrentTranslator={this.setCurrentTranslator}
            setIsProjectPage={this.setIsProjectPage}
            setProfile={this.setProfile}
          />
        </Route>

        <Route exact path={`/translators`}>
          <TranslatorList
            profile={profile}
            backDropClickHandler={this.backDropClickHandler}
            drawerToggleClickHandler={this.drawerToggleClickHandler}
            sideDrawerOpen={this.state.sideDrawerOpen}
            setCurrentTranslator={this.setCurrentTranslator}
            setIsProjectPage={this.setIsProjectPage}
            setProfile={this.setProfile}
          />
        </Route>
        <Route exact path={`/advertisements`}>
          <AdvertisementList
            profile={profile}
            backDropClickHandler={this.backDropClickHandler}
            drawerToggleClickHandler={this.drawerToggleClickHandler}
            sideDrawerOpen={this.state.sideDrawerOpen}
            setProfile={this.setProfile}
          />
        </Route>

        <Route exact path={`/messages`}>
          <AlertMessageList
            profile={profile}
            backDropClickHandler={this.backDropClickHandler}
            drawerToggleClickHandler={this.drawerToggleClickHandler}
            sideDrawerOpen={this.state.sideDrawerOpen}
            setProfile={this.setProfile}
          />
        </Route>
        {/* <Route exact path={`/translators/${this.state.currentTranslator._id}`}>
          <ProfilePage
            backDropClickHandler={this.backDropClickHandler}
            drawerToggleClickHandler={this.drawerToggleClickHandler}
            sideDrawerOpen={this.state.sideDrawerOpen}
            profile = {this.state.currentTranslator}
            projectPage = {this.state.isProjectPage}
          />
        </Route> */}
        <Switch>
          <Route
            path={`/messages/:messageId`}
            children={
              <MessagePage
                backDropClickHandler={this.backDropClickHandler}
                drawerToggleClickHandler={this.drawerToggleClickHandler}
                sideDrawerOpen={this.state.sideDrawerOpen}
                setProfile={this.setProfile}
                profile={profile}
              />
            }
          />
        </Switch>

        <Switch>
          <Route
            path={`/translators/:translatorId`}
            children={
              <ProfilePage
                backDropClickHandler={this.backDropClickHandler}
                drawerToggleClickHandler={this.drawerToggleClickHandler}
                sideDrawerOpen={this.state.sideDrawerOpen}
                profile={this.state.currentTranslator}
                projectPage={this.state.isProjectPage}
                setProfile={this.setProfile}
              />
            }
          />
        </Switch>
      </Router>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
