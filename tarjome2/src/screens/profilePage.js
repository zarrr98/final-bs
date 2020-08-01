import React from "react";
import "../index.css";
import strings from "../utils/strings";
import NavigationSystem from "../components/navigationSystem";
import { navigationItems, URL,StrorageGetItem, StorageSetItem, isEmptyObject } from "../utils/configs";
import ProfileCard from "../components/profileCard";
import Load from "../components/load";
import Empty from "../components/empty";
import { withRouter, useParams } from "react-router-dom";
import { FetchData } from "../utils/services";

class ProfilePage extends React.Component {
  state = {
    isLoading: false,
    profile: this.props.profile,
  };

  getTranslator = async () => {
    let translatorId = this.props.match.params.translatorId;
    let prof = StrorageGetItem("profile", true)
    this.setState({ isLoading: true });
    let data = await FetchData(
      `${URL.protocol}://${URL.baseURL}:${URL.port}/projectTranslator/${translatorId}`,
      prof ? prof.token : ""
    );
    this.setState({ isLoading: false });
    if (data) {
      if (data.status === 200) {
        this.setState({
          profile: data.resolve,
        });
      }else if (data.status === 413) {
        this.props.setProfile(null);
  
        window.location = "/";
        localStorage.removeItem("profile");
      }
    }
  };
  componentDidMount = () => {
    if (isEmptyObject(this.props.profile)){
      this.getTranslator()
    }
  }
  render() {
    let sth = this.props.match.params.translatorId;
    console.log(
      "STH is :",
      sth,
      " and this.state.profile is : ",
      this.state.profile
    );
    let isProjectPage =  StrorageGetItem("projectPage",true);
    console.log("****** projectPage in profile page (Storage): ", isProjectPage)
    return (
      <React.Fragment>
        <NavigationSystem
          backDropClickHandler={this.props.backDropClickHandler}
          drawerToggleClickHandler={this.props.drawerToggleClickHandler}
          sideDrawerOpen={this.props.sideDrawerOpen}
          navigationItems={navigationItems.employerNavigationItems}
          loggedIn={true}
          selectedTab={
            //this.props.projectPage
            //false
            isProjectPage ? strings.navbar.profile : strings.navbar.translators
          }
        />

        {this.state.isLoading ? (
          <Load />
        ) : !isEmptyObject(this.state.profile) ? (
          <div className="color-behind-profile">
            <div style={{ width: "60%", height: "140px" }}></div>
            <ProfileCard profile={this.state.profile} dashboard={false} />
          </div>
        ) : (
          <main className="main-content">
            <Empty text={'مشکلی پیش آمده. لطفا صفحه را رفرش کنید'} />
          </main>
        )}
      </React.Fragment>
    );
  }
}

export default withRouter(ProfilePage);
