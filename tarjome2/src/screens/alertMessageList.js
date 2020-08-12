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
      ? StrorageGetItem("profile", true).messages
      : [],
    // messages: this.props.profile ? this.props.profile.messages.reverse() : [],
    // filteredTranslators: [],
    isLoading: false,
  };

  reverseMessages = (messages) => {
    let msgs = messages;
    if (messages && messages.length > 0){
      if (messages[0].topic === strings.screens.welcomeMessageTopic){
        msgs = messages.reverse();
      }
     
    }
    return msgs;
  }
  render() {
    let messages = this.reverseMessages(this.state.messages)
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
          ) : messages && messages.length > 0 ? (
            <ListGroup>
              {messages.map((m , idx) => {
                return (
                  <ListGroup.Item className="list-item-container">
                    <MessageListItem
                      hoverable={true}
                      message={m}
                      profile={this.props.profile}
                    />
                  </ListGroup.Item>
                );
              })}
            </ListGroup>
          ) : (
            <Empty />
          )}
        </main>
      </div>
    );
  }
}
