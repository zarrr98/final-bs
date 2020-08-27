import React from "react";
import "../index.css";
import strings from "../utils/strings";
import NavigationSystem from "../components/navigationSystem";
import {
  navigationItems,
  URL,
  StrorageGetItem,
  StorageSetItem,
  isEmptyObject,
} from "../utils/configs";
import Load from "../components/load";
import Empty from "../components/empty";
import { withRouter, useParams } from "react-router-dom";
import { FetchData } from "../utils/services";
import { FaCommentDots } from "react-icons/fa";
import { Card } from "react-bootstrap";

class MessagePage extends React.Component {
  state = {
    isLoading: false,
    message: {},
  };

  updateMessagesInStorage = (messageId) => {
    let profile = this.props.profile;
    if (profile) {
      let messages = profile.messages;

      for (let i = 0; i < messages.length; i++) {
        if (messageId === messages[i]._id) {
          messages[i].seen = true;
          break;
        }
      }

      profile = { ...profile, messages };
      StorageSetItem("profile", profile, true);
      this.props.setProfile(profile);
    }
    console.log("profile in storage :", StrorageGetItem("profile", true));
  };

  getAndSeenMessage = async () => {
    let messageId = this.props.match.params.messageId;
    console.log("Message Id: ", messageId);
    let profile = this.props.profile;
    console.log("@@@profile before updating messages in message page : ", profile)
    this.setState({ isLoading: true });
    let data = await FetchData(
      `${URL.protocol}://${URL.baseURL}:${URL.port}/${URL.path}/user/getmessageandseen/${messageId}`,
      profile ? profile.token : ""
    );
    this.setState({ isLoading: false });
    if (data) {
      if (data.status === 200) {
        this.setState({
          message: data.msg,
        });
        this.updateMessagesInStorage(messageId);
      } else if (data.status === 413) {
        this.props.setProfile(null);

        window.location = "/";
        localStorage.removeItem("profile");
      }
    }
  };
  componentDidMount = () => {
    this.getAndSeenMessage();
  };
  render() {
    let sth = this.props.match.params.translatorId;
    console.log(
      "STH is :",
      sth,
      " and this.state.profile is : ",
      this.state.profile
    );
    let isProjectPage = StrorageGetItem("projectPage", true);
    console.log(
      "****** projectPage in profile page (Storage): ",
      isProjectPage
    );
    return (
      <React.Fragment>
        <NavigationSystem
          backDropClickHandler={this.props.backDropClickHandler}
          drawerToggleClickHandler={this.props.drawerToggleClickHandler}
          sideDrawerOpen={this.props.sideDrawerOpen}
          navigationItems={
            this.props.profile
              ? this.props.profile.role === strings.screens.employer
                ? navigationItems.employerNavigationItems
                : navigationItems.translatorNavigationItems
              : navigationItems.notLoggedInNavigationItems
          }
          loggedIn={true}
          selectedTab={strings.navbar.alertMessages}
        />
        {this.state.isLoading ? (
          <main className="main-content">
            <Load />
          </main>
        ) : !isEmptyObject(this.state.message) ? (
          <div className="color-behind-profile">
            <div className="height-behind-msg"></div>
            <Card className="profile-card">
              <Card.Body>
                <Card.Title className="purple-txt">
                  <FaCommentDots /> {this.state.message.topic}
                </Card.Title>
                <Card.Text>{this.state.message.text}</Card.Text>
              </Card.Body>
            </Card>
          </div>
        ) : (
          <main className="main-content">
            <Empty text={"مشکلی پیش آمده. لطفا صفحه را رفرش کنید"} />
          </main>
        )}
      </React.Fragment>
    );
  }
}

export default withRouter(MessagePage);
