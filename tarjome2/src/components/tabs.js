import React from "react";
import "../tabs.css";
import strings from "../utils/strings";
import Load from "./load";
import Empty from "./empty";
import AdListGroup from "./adListGroup";



export default class Tabs extends React.Component {
  state = {
    activeTab: 0,
    // data: data,
    isLoading: this.props.isLoading,
    requested: this.props.requested,
    doing: this.props.doing,
    done: this.props.done,
  };

  changeTabOnClick = (index) => {
    this.setState({
      activeTab: index,
    });
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
    let data = [this.state.requested, this.state.doing, this.state.done];
    return (
      <div className="tabs-body">
        <TabHeader
          data={data}
          click={this.changeTabOnClick}
          activeId={this.state.activeTab}
          profile={this.props.profile}
          isLoading={this.state.isLoading}
          requested={this.state.requested}
          doing={this.state.doing}
          done={this.state.done}
          employer={this.props.employer}
          translator={this.props.translator}
        />
        <TabContent
          data={data}
          activeId={this.state.activeTab}
          profile={this.props.profile}
          isLoading={this.state.isLoading}
          requested={this.state.requested}
          doing={this.state.doing}
          done={this.state.done}
          employer={this.props.employer}
          translator={this.props.translator}
          setStates={this.props.setStates}
        />
      </div>
    );
  }
}

class TabHeader extends React.Component {
  state = {
    isLoading: this.props.isLoading,
    requested: this.props.requested,
    doing: this.props.doing,
    done: this.props.done,
  };

  doClick(index, event) {
    this.props.click(index);
  }

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
    let activeClass = this.props.activeId;

    let tabs = this.props.data.map((item, index) => {
      let name =
        index === 0
          ? strings.profile.requested
          : index === 1
          ? strings.profile.doing
          : strings.profile.done;
      return (
        <li className={activeClass === index ? "active" : ""}>
          <a onClick={this.doClick.bind(this, index)}>
            <span>{name}</span>
          </a>
        </li>
      );
    });

    return <ul className="tabs-header">{tabs}</ul>;
  }
}

class TabContent extends React.Component {
  state = {
    isLoading: this.props.isLoading,
    requested: this.props.requested,
    doing: this.props.doing,
    done: this.props.done,
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
    let activeClass = this.props.activeId;
    let projects = [this.state.requested , this.state.doing , this.state.done]
    let content = projects.map((item, index) => {
      return (
        <div
          className={"tabs-textItem " + (activeClass === index ? "show" : "")}
        >
          {/* <p>{item.text}</p> */}
          {this.state.isLoading ? (
            <Load />
          ) : item.length > 0 ? (
            <AdListGroup
              profile={this.props.profile}
              //   advertisements={this.state.requested}
              advertisements={item}
              appliable={false}
              employer={this.props.employer}
              setStates={this.props.setStates}
              translator={this.props.translator}
            />
          ) : (
            <Empty information={strings.emptyAlert.project} />
          )}
        </div>
      );
    });

    return <div className="tabs-content">{content}</div>;
  }
}
