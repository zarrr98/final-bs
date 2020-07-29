import React from "react";
import { ListGroup } from "react-bootstrap";
import "../index.css";
import TranslatorListItem from "./translatorListItem";

export default class TranslatorListGroup extends React.Component {
  static defaultProps = {
    hoverable: true,
    projectPage : false,
    requestedProject : false,
    doingProject : false,
  };
  state = {
    translators: this.props.translators
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.translators.length !== this.state.translators.length) {
      //Perform some operation
      this.setState({ translators: nextProps.translators });
    }
  }
  render() {
    
    return (
      <ListGroup>
        {this.state.translators.map((item, i) => {
          return (
            <ListGroup.Item className="list-item-container">
              <TranslatorListItem
                profile={item} 
                offers = {this.props.offers}
                setCurrentTranslator={this.props.setCurrentTranslator}
                hoverable = {this.props.hoverable}
                projectPage = {this.props.projectPage}
                requestedProject = {this.props.requestedProject}
                doingProject = {this.props.doingProject}
                setShowModal = {this.props.setShowModal}
                setChoosenTranslator = {this.props.setChoosenTranslator}
                setModalText = {this.props.setModalText}
                setErrorMessage = {this.props.setErrorMessage}
                // setTransDoneAssurance = {this.props.setTransDoneAssurance}
                // setEmployerDoneAssure = {this.props.setEmployerDoneAssure}
              />
            </ListGroup.Item>
          );
        })}
      </ListGroup>
    );
  }
}
