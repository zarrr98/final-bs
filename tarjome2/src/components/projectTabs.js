import React from "react";
import "../index.css";
import strings from "../utils/strings";
import { Tabs, Tab } from "react-bootstrap";
import Load from "./load";
import Empty from "./empty";
import AdListGroup from "./adListGroup";

export default class ProjectTabs extends React.Component {
  state = {
    isLoading: this.props.isLoading,
    requested: this.props.requested,
    doing: this.props.doing,
    done: this.props.done
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.isLoading !== this.state.isLoading) { 
      this.setState({ isLoading: nextProps.isLoading });
    }

    if (nextProps.requested.length !== this.state.requested.length) {
      this.setState({ requested: nextProps.requested });
    }
    //if (nextProps.doing.length !== this.state.doing.length) {
      this.setState({ doing: nextProps.doing });
   // }
    if (nextProps.done.length !== this.state.done.length) {
      this.setState({ done: nextProps.done });
    }
  }
  render() {
    console.log(
      "In project Tabs requested , doing , done",
      this.state.requested,
      this.state.doing,
      this.state.done
    );
    return (
      <Tabs defaultActiveKey="requested" id={this.props.profile._id}>
        <Tab
          eventKey="requested"
          title={strings.profile.requested}
          className="right-aligned"
        >
          {this.state.isLoading ? (
            <Load />
          ) : this.state.requested.length > 0 ? (
            <AdListGroup
              profile={this.props.profile}
              advertisements={this.state.requested}
              appliable={false}
              employer={this.props.employer}
              setStates={this.props.setStates}
              translator={this.props.translator}
            />
          ) : (
            <Empty information={strings.emptyAlert.project} />
          )}
        </Tab>
        <Tab
          eventKey="doing"
          title={strings.profile.doing}
          className="right-aligned"
        >
          {this.state.isLoading ? (
            <Load />
          ) : this.state.doing.length > 0 ? (
            <AdListGroup
              profile={this.props.profile}
              advertisements={this.state.doing}
              appliable={false}
              employer={this.props.employer}
              setStates={this.props.setStates}
              translator={this.props.translator}
            />
          ) : (
            <Empty information={strings.emptyAlert.project} />
          )}
        </Tab>
        <Tab
          eventKey="done"
          title={strings.profile.done}
          className="right-aligned"
        >
          {this.state.isLoading ? (
            <Load />
          ) : this.state.done.length > 0 ? (
            <AdListGroup
              profile={this.props.profile}
              advertisements={this.state.done}
              appliable={false}
              employer={this.props.employer}
              setStates={this.props.setStates}
              translator={this.props.translator}
            />
          ) : (
            <Empty information={strings.emptyAlert.project} />
          )}
        </Tab>
      </Tabs>
    );
  }
}
