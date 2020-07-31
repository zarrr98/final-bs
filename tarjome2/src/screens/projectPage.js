import React from "react";
import "../index.css";
import strings from "../utils/strings";
import NavigationSystem from "../components/navigationSystem";
import { navigationItems, URL } from "../utils/configs";
import { withRouter } from "react-router-dom";
import AdvertisementListItem from "../components/advertisementListItem";
import TranslatorListGroup from "../components/translatorListGroup";
import Load from "../components/load";
import Empty from "../components/empty";
import AlertModal from "../components/alertModal";
import { FetchData, PutData } from "../utils/services";
import { Alert } from "react-bootstrap";

class ProjectPage extends React.Component {
  state = {
    translators: [],
    isLoading: false,
    showModal: false,
    choosenTranslator: null,
    modalText: "",
    errorMessage: "",
    // translatorDoneAssurance : false,
    employerDoneAssurance: false,
  };

  setShowModal = (val) => {
    this.setState({
      showModal: val,
    });
  };

  setChoosenTranslator = (val) => {
    console.log("setChoosenTranslator got called . the parameter is :", val);
    this.setState({
      choosenTranslator: val,
    });
  };

  setModalText = (text) => {
    this.setState({
      modalText: text,
    });
  };

  setStates = (obj) => {
    this.setState(obj);
  };
  setErrorMessage = (msg) => {
    this.setState({ errorMessage: msg });
  };
  setTranslators = async () => {
    let { ad } = this.props.location.state;
    let translators = [];
    let data = null;
    this.setState({ isLoading: true });
    if (ad.status === strings.adStatus.requested) {
      data = await PutData(
        `${URL.protocol}://${URL.baseURL}:${URL.port}/projectTranslators`,
        { offers: ad.requestedTranslators },
        this.props.profile ? this.props.profile.token : ""
      );
      this.setState({ isLoading: false });
      if (data) {
        if (data.status === 200) {
          translators = data.resolve;
        } else if (data.status === 413) {
          this.props.setProfile(null);

          window.location = "/";
          localStorage.removeItem("profile");
        }
      }
    } else {
      data = await FetchData(
        `${URL.protocol}://${URL.baseURL}:${URL.port}/projectTranslator/${ad.translator.id}`,
        this.props.profile ? this.props.profile.token : ""
      );
      this.setState({ isLoading: false });
      if (data) {
        if (data.status === 200) {
          translators = [data.resolve];
        } else if (data.status === 413) {
          this.props.setProfile(null);

          window.location = "/";
          localStorage.removeItem("profile");
        }
      }
    }
    this.setState({ translators });
  };

  componentDidMount = () => {
    this.setTranslators();
  };
  render() {
    let { ad } = this.props.location.state;
    //console.log("Ad Gotten in projct page : ", this.props.location.state.ad);
    return (
      <React.Fragment>
        <NavigationSystem
          backDropClickHandler={this.props.backDropClickHandler}
          drawerToggleClickHandler={this.props.drawerToggleClickHandler}
          sideDrawerOpen={this.props.sideDrawerOpen}
          navigationItems={navigationItems.employerNavigationItems}
          loggedIn={true}
          selectedTab={strings.navbar.profile}
        />
        <div className="color-behind-profile">
          <div style={{ width: "60%", height: "140px" }}></div>
          <AdvertisementListItem
            ad={ad}
            appliable={false}
            employer={false}
            classes={"profile-card"}
            projectPage={true}
            setStates={this.setStates}
          />
          {this.state.errorMessage !== "" ? (
            <Alert
              key={ad._id}
              variant={"danger"}
              className="margin-top right-aligned"
            >
              {this.state.errorMessage}
            </Alert>
          ) : null}
          <h3 className="margin-top margin-right right-aligned">
            {ad.status === strings.adStatus.requested
              ? strings.screens.requstedTranslatorsTitle
              : ad.status === strings.adStatus.doing
              ? strings.screens.doingTranslatorTitle
              : strings.screens.doneTranslatorTitle}
          </h3>
          {this.state.isLoading ? (
            <Load />
          ) : this.state.translators.length > 0 ? (
            <TranslatorListGroup
              translators={this.state.translators}
              offers={ad.requestedTranslators}
              setCurrentTranslator={this.props.setCurrentTranslator}
              setIsProjectPage={this.props.setIsProjectPage}
              hoverable={false}
              projectPage={true}
              requestedProject={ad.status === strings.adStatus.requested}
              doingProject={
                !ad.employerDone && ad.status === strings.adStatus.doing
              }
              setShowModal={this.setShowModal}
              setChoosenTranslator={this.setChoosenTranslator}
              setModalText={this.setModalText}
              setErrorMessage={this.setErrorMessage}
              // setTransDoneAssurance = {this.setTransDoneAssurance}
              // setEmployerDoneAssure = {this.setEmployerDoneAssure}
            />
          ) : (
            <Empty information={strings.emptyAlert.translator} />
          )}
        </div>
        <AlertModal
          showModal={this.state.showModal}
          setShowModal={this.setShowModal}
          text={this.state.modalText}
          profile={this.props.profile}
          ad={ad}
          choosenTranslator={this.state.choosenTranslator}
          //translatorDoneAssurance = {this.state.translatorDoneAssurance}
          employerDoneAssurance={this.state.employerDoneAssurance}
          setErrorMessage={this.setErrorMessage}
          setProfile={this.props.setProfile}
        />
      </React.Fragment>
    );
  }
}

export default withRouter(ProjectPage);
