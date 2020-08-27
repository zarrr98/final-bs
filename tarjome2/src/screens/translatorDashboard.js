import React from "react";
import "../index.css";
import strings from "../utils/strings";
import NavigationSystem from "../components/navigationSystem";
import { navigationItems, URL } from "../utils/configs";
import ProfileCard from "../components/profileCard";
import ProjectTabs from "../components/projectTabs";
import AlertModal from "../components/alertModal";
import { FaRedoAlt } from "react-icons/fa";
import { OverlayTrigger, Tooltip, Alert } from "react-bootstrap";
import { FetchData } from "../utils/services";
import UploadFileModal from "../components/uploadFileModal";
import Tabs from "../components/tabs";

export default class TranslatorDashboard extends React.Component {
  state = {
    isLoading: false,
    requestedProjects: [],
    doingProjects: [],
    doneProjects: [],
    showModal: false,
    showUploadModal: false,
    modalText: "",
    currentAd: null, //current ad that is being done
    errorMessage: "",
    successMessage: "",
  };

  setErrorMessage = (msg) => {
    this.setState({ errorMessage: msg });
  };
  setShowModal = (val) => {
    this.setState({
      showModal: val,
    });
  };

  setModalText = (text) => {
    this.setState({
      modalText: text,
    });
  };
  setStates = (obj) => {
    console.log("!!! setStates got called. passed obj is : ", obj);
    this.setState(obj);
  };

  divideProjects = (projects) => {
    let requested = [];
    let doing = [];
    let done = [];
    if (projects) {
      requested = projects.filter((p) => p.status === "requested");
      doing = projects.filter((p) => p.status === "doing");
      done = projects.filter((p) => p.status === "done");
    }

    this.setState({
      requestedProjects: requested.reverse(),
      doingProjects: doing.reverse(),
      doneProjects: done.reverse(),
    });
  };
  checkResponseStatus = (response) => {
    if (!response) {
      this.divideProjects([]);
    } else if (response.status === 200) {
      this.divideProjects(response.resolve);
    }else if (response.status === 413) {
      this.props.setProfile(null);

      window.location = "/";
      localStorage.removeItem("profile");
    } else {
      this.divideProjects([]);
    }
  };
  refreshProjects = async () => {
    this.setState({ isLoading: true });
    const data = await FetchData(
      `${URL.protocol}://${URL.baseURL}:${URL.port}/${URL.path}/translatorProjects`,
      this.props.profile ? this.props.profile.token : ""
    );

    this.setState({ isLoading: false });
    this.checkResponseStatus(data);
  };
  componentDidMount = () => {
    this.refreshProjects();
  };
  render() {
    // console.log("this.props.profile : ", this.props.profile);

    return (
      <React.Fragment>
        <NavigationSystem
          backDropClickHandler={this.props.backDropClickHandler}
          drawerToggleClickHandler={this.props.drawerToggleClickHandler}
          sideDrawerOpen={this.props.sideDrawerOpen}
          navigationItems={navigationItems.translatorNavigationItems}
          loggedIn={true}
          selectedTab={strings.navbar.profile}
        />

        <div className="color-behind-profile">
          <div style={{ width: "60%", height: "140px" }}></div>
          <ProfileCard
            profile={this.props.profile}
            setProfile={this.props.setProfile}
          />
          {this.state.errorMessage !== "" ? (
            <Alert
              key={this.props.profile._id}
              variant={"danger"}
              className="margin-top right-aligned"
            >
              {this.state.errorMessage}
            </Alert>
          ) : this.state.successMessage !== "" ? (
            <Alert
              key={this.props.profile._id}
              variant={"success"}
              className="margin-top right-aligned"
            >
              {this.state.successMessage}
            </Alert>
          ) : null}
          <h3 className="margin-top margin-right right-aligned">
            <OverlayTrigger
              overlay={<Tooltip>{strings.screens.refreshTooltip}</Tooltip>}
            >
              <FaRedoAlt
                onClick={this.refreshProjects}
                className="refresh-icon"
              />
            </OverlayTrigger>
            <span style={{ marginRight: "10px" }}>
              {strings.profile.projects}
            </span>
          </h3>
          {/* <ProjectTabs
            profile={this.props.profile}
            isLoading={this.state.isLoading}
            requested={this.state.requestedProjects}
            doing={this.state.doingProjects}
            done={this.state.doneProjects}
            employer={false}
            setStates={this.setStates}
            translator={true}
          /> */}
          <Tabs
            profile={this.props.profile}
            isLoading={this.state.isLoading}
            requested={this.state.requestedProjects}
            doing={this.state.doingProjects}
            done={this.state.doneProjects}
            employer={false}
            setStates={this.setStates}
            translator={true}
          />
        </div>
        <AlertModal
          showModal={this.state.showModal}
          setShowModal={this.setShowModal}
          text={this.state.modalText}
          profile={this.props.profile}
          ad={this.state.currentAd}
          //choosenTranslator = {this.state.choosenTranslator}
          translatorDoneAssurance={true}
          refreshProjects={this.refreshProjects}
          setErrorMessage={this.setErrorMessage}
          setProfile = {this.props.setProfile}
          //employerDoneAssurance = {this.state.employerDoneAssurance}
        />
        <UploadFileModal
          showModal={this.state.showUploadModal}
          //setShowModal={this.setShowModal}
          profile={this.props.profile}
          ad={this.state.currentAd}
          refreshProjects={this.refreshProjects}
          setStates={this.setStates}
          setProfile = {this.props.setProfile}
        />
      </React.Fragment>
    );
  }
}
