import React from "react";
import NavigationSystem from "../components/navigationSystem";
import { navigationItems, cardPictures,ParticleParams } from "../utils/configs";
import strings from "../utils/strings";
import "../index.css";
import GridItemContainer from "../components/gridItemContainer";
import ParticleBackground from "../components/particleBackground";
import InfoSection from "../components/infoSection";
import { Image, Col, Row, Button } from "react-bootstrap";

export default class MainPage extends React.Component {
  
  employerSection = [
    {
      src: cardPictures[0],
      title: strings.mainPage.submitAdTitle,
      text: strings.mainPage.submitAdText
    },
    {
      src: cardPictures[1],
      title: strings.mainPage.chooseTranslatorTitle,
      text: strings.mainPage.chooseTranslatorText
    },
    {
      src: cardPictures[2],
      title: strings.mainPage.finishTitle,
      text: strings.mainPage.finishText
    }
  ];

  translatorSection = [
    {
      src: cardPictures[3],
      title: strings.mainPage.advertisementParticipateTitle,
      text: strings.mainPage.advertisementParticipateText
    },
    {
      src: cardPictures[4],
      title: strings.mainPage.secondTranslationTitle,
      text: strings.mainPage.secondTranslationText
    },
    {
      src: cardPictures[5],
      title: strings.mainPage.finishTranslationTitle,
      text: strings.mainPage.finishTranslationText
    }
  ];

  
  render() {
    let navItems = !this.props.profile
      ? navigationItems.notLoggedInNavigationItems
      : this.props.profile.role === strings.screens.translator
      ? navigationItems.translatorNavigationItems
      : navigationItems.employerNavigationItems;
    return (
      <div className="background">
        <NavigationSystem
          backDropClickHandler={this.props.backDropClickHandler}
          drawerToggleClickHandler={this.props.drawerToggleClickHandler}
          sideDrawerOpen={this.props.sideDrawerOpen}
          navigationItems={navItems}
          loggedIn={this.props.profile !== null}
          selectedTab={strings.navbar.mainPage}
        />
        {/* <main className="main-content"> */}
        {/* <CanvasBackGround/> */}
        <ParticleBackground
          params= {ParticleParams}
        />

        <GridItemContainer
          className="margin-top"
          title={strings.mainPage.employerQuestionTitle}
          content={this.employerSection}
          cardContent = {true}
        />
        <GridItemContainer
          className="extra-margin-top"
          title={strings.mainPage.translatorQuestionTitle}
          content={this.translatorSection}
          cardContent = {true}
        />
        <InfoSection />
        
      </div>
    );
  }
}
