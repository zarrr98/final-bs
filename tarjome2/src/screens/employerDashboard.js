import React from "react";
import "../index.css";
import strings from "../utils/strings";
import NavigationSystem from "../components/navigationSystem";
import { navigationItems, URL } from "../utils/configs";
import ProfileCard from "../components/profileCard";
import ProjectTabs from "../components/projectTabs";
import Tabs from "../components/tabs";
import CreateAdModal from "../components/createAdModal";
import { FaRedoAlt } from "react-icons/fa";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { FetchData } from "../utils/services";

export default class EmployerDashboard extends React.Component {
  state = {
    showModal: false,
    isLoading: false,
    requestedProjects: [],
    doingProjects: [],
    doneProjects: [],
  };

  setShowModal = (val) => {
    this.setState({
      showModal: val,
    });
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
    } else if (response.status === 413) {
      this.props.setProfile(null);

      window.location = "/";
      localStorage.removeItem("profile");
    }
     else {
      this.divideProjects([]);
    }
  };
  refreshProjects = async () => {
    this.setState({ isLoading: true });
    const data = await FetchData(
      `${URL.protocol}://${URL.baseURL}:${URL.port}/employerProjects`,
      this.props.profile ? this.props.profile.token : ""
    );

    this.setState({ isLoading: false });
    this.checkResponseStatus(data);
  };
  componentDidMount = () => {
    this.refreshProjects();
  };
  render() {
    return (
      <React.Fragment>
        <NavigationSystem
          backDropClickHandler={this.props.backDropClickHandler}
          drawerToggleClickHandler={this.props.drawerToggleClickHandler}
          sideDrawerOpen={this.props.sideDrawerOpen}
          navigationItems={navigationItems.employerNavigationItems}
          loggedIn={true}
          selectedTab={strings.navbar.profile}
        />

        <div className="color-behind-profile">
          <div style={{ width: "60%", height: "140px" }}></div>
          <ProfileCard
            profile={this.props.profile}
            setShowModal={this.setShowModal}
            setProfile={this.props.setProfile}
          />
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
            employer={true}
            translator={false}
          /> */}
          <Tabs
            profile={this.props.profile}
            isLoading={this.state.isLoading}
            requested={this.state.requestedProjects}
            doing={this.state.doingProjects}
            done={this.state.doneProjects}
            employer={true}
            translator={false}
          />
        </div>

        <CreateAdModal
          showModal={this.state.showModal}
          setShowModal={this.setShowModal}
          profile={this.props.profile}
          refreshProjects={this.refreshProjects}
          setProfile = {this.props.setProfile}
        />
      </React.Fragment>
    );
  }
}
