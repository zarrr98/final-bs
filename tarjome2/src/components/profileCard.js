import React from "react";
import "../index.css";
import strings from "../utils/strings";
import { Card, Badge, Button } from "react-bootstrap";
import { withRouter } from "react-router-dom";
import Empty from './empty'

class ProfileCard extends React.Component {
  static defaultProps = {
    dashboard: true
  };
  logout = () => {
    this.props.setProfile(null);
    
    this.props.history.push({
      pathname: `/`
    });
    localStorage.removeItem("profile")
  };
  render() {
    let translator = this.props.profile ? this.props.profile.role === strings.screens.translator : false;
    let roleInfo = this.props.profile ?
      (this.props.profile.role === strings.screens.translator
        ? `${this.props.profile.role} ${strings.profile.for} ${this.props.profile.translatorFields.experienceYears} ${strings.profile.year}`
        : `${this.props.profile.role}`) : "";
    let explanation = this.props.profile ? this.props.profile.translatorFields
      ? this.props.profile.translatorFields.explanation
      : "" : "";
    return this.props.profile ? (
      <Card className="profile-card">
        <Card.Body>
          <Card.Title>
            {this.props.profile.first_name} {this.props.profile.last_name}
          </Card.Title>
          <Card.Subtitle className="mb-2 text-muted">
            {roleInfo}
            <br />
            {this.props.profile.email}
          </Card.Subtitle>
          <Card.Text>{explanation}</Card.Text>
          <div
            className={`buttons-container ${translator ? "flex-reverse" : ""}`}
          >
            {!translator ? (
              <Button
                variant="primary"
                onClick={() => this.props.setShowModal(true)}
              >
                {strings.profile.createAd}
              </Button>
            ) : null}
            {this.props.dashboard ? (
              <Button variant="danger" onClick={this.logout}>
                {strings.screens.exit}
              </Button>
            ) : null}
          </div>
        </Card.Body>
        {translator ? (
          <Card.Footer>
            <div className="card-footer-row">
              <div className="card-footer-col">
                <p>
                  {" "}
                  {strings.profile.language}
                  {this.props.profile && this.props.profile.translatorFields.languages.map(lang => {
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
                  {this.props.profile && this.props.profile.translatorFields.fields.map(f => {
                    return (
                      <React.Fragment>
                        <Badge variant="secondary">{f}</Badge>
                        <span> </span>
                      </React.Fragment>
                    );
                  })}
                </p>
              </div>
              <div className="card-footer-col">
                <p>
                  {strings.screens.acceptedProjects}{" "}
                  {this.props.profile.translatorFields.acceptedProjects
                    ? this.props.profile.translatorFields.acceptedProjects
                    : 0}
                </p>
                <p>
                  {strings.screens.doneProjects}{" "}
                  {this.props.profile.translatorFields.doneProjects
                    ? this.props.profile.translatorFields.doneProjects
                    : 0}
                </p>
              </div>
            </div>
          </Card.Footer>
        ) : null}
      </Card>
    ) : <Empty/>;
  }
}
export default withRouter(ProfileCard);
