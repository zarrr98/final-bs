import React from "react";
import "../index.css";
import strings from "../utils/strings";
import NavigationSystem from "../components/navigationSystem";
import Empty from "../components/empty";
import {
  navigationItems,
  Fields,
  Languages,
  StrorageGetItem,
} from "../utils/configs";
import { URL } from "../utils/configs";
import Load from "../components/load";
import MessageListItem from "../components/messageListItem";
import { ListGroup } from "react-bootstrap";
import { FetchData } from "../utils/services";

export default class AlertMessageList extends React.Component {
  state = {
    messages: StrorageGetItem("profile", true)
      ? StrorageGetItem("profile", true).messages.reverse()
      : [],
    // filteredTranslators: [],
    isLoading: false,
  };

  // checkResponseStatus = (response) => {
  //   if (!response) {
  //     return;
  //   } else if (response.status === 200) {
  //     this.setState({
  //       translators: response.resolve,
  //       filteredTranslators: response.resolve,
  //     });
  //   } else if (response.status === 413) {
  //     this.props.setProfile(null);

  //     window.location = "/";
  //     localStorage.removeItem("profile");
  //   }
  // };
  // getMessages = async () => {
  //   // this.setState({ isLoading: true });
  //   // const data = await FetchData(
  //   //   `${URL.protocol}://${URL.baseURL}:${URL.port}/translators`,
  //   //   this.props.profile ? this.props.profile.token : ""
  //   // );
  //   // this.setState({ isLoading: false });
  //   // this.checkResponseStatus(data);
  // };
  // componentDidMount() {
  //   this.getMessages();
  // }
  render() {
    console.log("this.state.translators =>>", this.state.filteredTranslators);
    let { profile } = this.props;
    return (
      <div className="background">
        <NavigationSystem
          backDropClickHandler={this.props.backDropClickHandler}
          drawerToggleClickHandler={this.props.drawerToggleClickHandler}
          sideDrawerOpen={this.props.sideDrawerOpen}
          navigationItems={
            profile
              ? profile.role === strings.screens.translator
                ? navigationItems.translatorNavigationItems
                : navigationItems.employerNavigationItems
              : navigationItems.notLoggedInNavigationItems
          }
          loggedIn={true}
          selectedTab={strings.navbar.alertMessages}
        />
        <main className="main-content">
          {this.state.isLoading ? (
            <Load />
          ) : this.state.messages.length > 0 ? (
            <ListGroup>
              {this.state.messages.map((m) => (
                <ListGroup.Item className="list-item-container">
                  <MessageListItem
                    hoverable={true}
                    message={m}
                    profile={this.props.profile}
                  />
                </ListGroup.Item>
              ))}
            </ListGroup>
          ) : (
            <Empty />
          )}
        </main>
      </div>
    );
  }
}
