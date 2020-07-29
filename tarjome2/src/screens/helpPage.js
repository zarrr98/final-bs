import React from "react";
import NavigationSystem from "../components/navigationSystem";
import { navigationItems } from "../utils/configs";
import strings from "../utils/strings";
import "../index.css";
import GridItem from "../material/GridItem";
import Card from "../material/Card";
import CardBody from "../material/CardBody";
import CardHeader from "../material/CardHeader";

export default class HelpPage extends React.Component {
  render() {
    let navItems = !this.props.profile
      ? navigationItems.notLoggedInNavigationItems
      : this.props.profile.role === strings.screens.translator
      ? navigationItems.translatorNavigationItems
      : navigationItems.employerNavigationItems;
    return (
      <div className="background right-aligned ">
        <NavigationSystem
          backDropClickHandler={this.props.backDropClickHandler}
          drawerToggleClickHandler={this.props.drawerToggleClickHandler}
          sideDrawerOpen={this.props.sideDrawerOpen}
          navigationItems={navItems}
          loggedIn={this.props.profile !== null}
          selectedTab={strings.navbar.help}
        />
        <main className="main-content margin-right">
          <h4>{strings.helpPage.title}</h4>
          <ul className="help-items">
            {strings.helpPage.topics.map((item, i) => {
              return (
                <li>
                  <a href={`#item${i}`}>{item.title}</a>
                </li>
              );
            })}
          </ul>
          {strings.helpPage.topics.map((item, i) => {
            return (
              <GridItem
                xs={12}
                sm={12}
                md={12}
                className="right-aligned "
                id={`item${i}`}
              >
                <Card className="extra-margin-top">
                  <CardHeader color="primary" className="center-aligned">
                    <h4>{item.title}</h4>
                  </CardHeader>
                  <CardBody>
                    {item.steps.map((step, j) => {
                      return (
                        <React.Fragment>
                          <h6>
                            {j + 1}) {step.title}
                          </h6>
                          {step.desc ? <p>{step.desc}</p> : null}
                        </React.Fragment>
                      );
                    })}
                  </CardBody>
                </Card>
              </GridItem>
            );
          })}
        </main>
      </div>
    );
  }
}
