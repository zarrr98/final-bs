import React from "react";
import ReactDOM from "react-dom";
import strings from "./utils/strings";
import { BrowserRouter as Router, Route } from "react-router-dom";
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

import Tabs from "./components/tabs";

import { Button } from "react-bootstrap";

import "./index.css";

class App extends React.Component {
  state = {
    sideDrawerOpen: false,
    profile: null,
    currentTranslator: "test@gmail.com", //the email of translator that some employer is seeing their page.
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
    // console.log(
    //   "set Profile called. voroodi : ",
    //   profile,
    //   " and profile in states :",
    //   this.state.profile
    // );
  };
  updateProfile = (translatorFields) => {
    const { profile } = this.state;
    this.setState({
      profile: { ...profile, translatorFields },
    });
    console.log(
      "updateProfile called. profile in states : ",
      this.state.profile
    );
  };

  setCurrentTranslator = (email) => {
    this.setState({ currentTranslator: email });
  };
  render() {
    let backDrop;
    if (this.state.sideDrawerOpen) {
      backDrop = <BackDrop backDropClickHandler={this.backDropClickHandler} />;
    }
    return (
      <Router>
        <Route exact path={`/`}>
          <MainPage
            profile={this.state.profile}
            backDropClickHandler={this.backDropClickHandler}
            drawerToggleClickHandler={this.drawerToggleClickHandler}
            sideDrawerOpen={this.state.sideDrawerOpen}
          />
        </Route>
        <Route exact path={`/help`}>
          <HelpPage
            profile={this.state.profile}
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
          <ResumeForm updateProfile={this.updateProfile} />
        </Route>
        <Route exact path={`/profile`}>
          {!this.state.profile ? null : this.state.profile.role ===
            strings.screens.translator ? (
            <TranslatorDashboard
              profile={this.state.profile}
              backDropClickHandler={this.backDropClickHandler}
              drawerToggleClickHandler={this.drawerToggleClickHandler}
              sideDrawerOpen={this.state.sideDrawerOpen}
              setProfile={this.setProfile}
            />
          ) : (
            <EmployerDashboard
              profile={this.state.profile}
              backDropClickHandler={this.backDropClickHandler}
              drawerToggleClickHandler={this.drawerToggleClickHandler}
              sideDrawerOpen={this.state.sideDrawerOpen}
              setProfile={this.setProfile}
            />
          )}
        </Route>

        <Route exact path={`/profile/myProject`}>
          <ProjectPage
            profile={this.state.profile}
            backDropClickHandler={this.backDropClickHandler}
            drawerToggleClickHandler={this.drawerToggleClickHandler}
            sideDrawerOpen={this.state.sideDrawerOpen}
            setCurrentTranslator={this.setCurrentTranslator}
          />
        </Route>

        <Route exact path={`/translators`}>
          <TranslatorList
            profile={this.state.profile}
            backDropClickHandler={this.backDropClickHandler}
            drawerToggleClickHandler={this.drawerToggleClickHandler}
            sideDrawerOpen={this.state.sideDrawerOpen}
            setCurrentTranslator={this.setCurrentTranslator}
          />
        </Route>
        <Route exact path={`/advertisements`}>
          <AdvertisementList
            profile={this.state.profile}
            backDropClickHandler={this.backDropClickHandler}
            drawerToggleClickHandler={this.drawerToggleClickHandler}
            sideDrawerOpen={this.state.sideDrawerOpen}
          />
        </Route>
        <Route exact path={`/translators/${this.state.currentTranslator}`}>
          <ProfilePage
            backDropClickHandler={this.backDropClickHandler}
            drawerToggleClickHandler={this.drawerToggleClickHandler}
            sideDrawerOpen={this.state.sideDrawerOpen}
          />
        </Route>

        <Route exact path={`/tabs`}>
          <Tabs />
        </Route>
      </Router>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
