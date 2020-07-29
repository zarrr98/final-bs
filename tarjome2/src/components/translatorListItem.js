import React from "react";
import { Card, Badge, Button } from "react-bootstrap";
import strings from "../utils/strings";
import { withRouter } from "react-router-dom";

class TranslatorListItem extends React.Component {
  state = {
    cost: null,
  };
  showProfile = () => {
    let { email } = this.props.profile;
    this.props.setCurrentTranslator(email);
    this.props.history.push({
      pathname: `/translators/${email}`,
      state: {
        profile: this.props.profile,
        projectPage: this.props.projectPage
      }
    });
  };
  chooseTranslator = () => {
    let { profile } = this.props;
    if (!this.state.cost) {
      this.findCost();
    }
    this.props.setChoosenTranslator({ ...profile, cost: this.state.cost });
    this.props.setModalText(strings.screens.acceptanceAssuarance)
    this.props.setErrorMessage("")
    this.props.setShowModal(true);
  };
  doneProject = () => {
    this.props.setModalText(strings.screens.doneAssurance)
    this.props.setEmployerDoneAssure(true)
    this.props.setShowModal(true); 
    //change
  }
  findCost = () => {
    let { profile, offers } = this.props;
    if (offers && profile) {
      for (let i = 0; i < offers.length; i++) {
        if (offers[i].id === profile._id) {
          this.setState({
            cost: offers[i].cost
          });
        }
      }
    }
  };
  componentDidMount() {
    this.findCost();
  }
  render() {
    let CardClasses = "translator-list-item-card ";
    if (this.props.hoverable) {
      CardClasses += "hoverable-list-item";
    }
    return (
      <Card
        className={CardClasses}
        onClick={this.props.hoverable ? this.showProfile : () => {}}
      >
        <Card.Body>
          <Card.Title className="purple-txt">
            {this.props.profile.first_name} {this.props.profile.last_name}
          </Card.Title>
          {this.props.requestedProject ? (
            <Card.Text>
              {strings.screens.offeredPrice} : {this.state.cost}{" "}
              {strings.forms.toman}
            </Card.Text>
          ) : this.props.projectPage ? (
            <Card.Text>
              {strings.screens.agreedPrice} : {this.state.cost}{" "}
              {strings.forms.toman}
            </Card.Text>
          ) : null}
          <Card.Text>
            {this.props.profile.translatorFields.explanation}
          </Card.Text>
          <p>
            {" "}
            {strings.profile.language}
            {this.props.profile.translatorFields.languages.map(lang => {
              return (
                <React.Fragment>
                  <Badge variant="secondary">{lang}</Badge>
                  <span> </span>
                </React.Fragment>
              );
            })}
          </p>
          <p>
            {" "}
            {strings.profile.field}
            {this.props.profile.translatorFields.fields.map(f => {
              return (
                <React.Fragment>
                  <Badge variant="secondary">{f}</Badge>
                  <span> </span>
                </React.Fragment>
              );
            })}
          </p>

          {this.props.projectPage ? (
            <div className="buttons-container">
              <Button
                variant="primary"
                className="margin-top"
                onClick={this.showProfile}
              >
                {"مشاهده پروفایل"}
              </Button>
              {/* {this.props.doingProject ? (
                <Button
                  variant="success"
                  onClick={this.doneProject}
                  className="margin-top"
                >
                  {strings.screens.completeProject}
                </Button>
              ) :  */}
             {this.props.requestedProject ? (
                <Button
                  variant="success"
                  onClick={this.chooseTranslator}
                  className="margin-top"
                >
                  {"انتخاب مترجم"}
                </Button>
              ) : null}
            </div>
          ) : null}
        </Card.Body>
      </Card>
    );
  }
}

export default withRouter(TranslatorListItem);
