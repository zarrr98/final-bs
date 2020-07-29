import React from "react";
import { Card, Button } from "react-bootstrap";
import strings from "../utils/strings";
import { withRouter } from "react-router-dom";
import { URL } from "../utils/configs";

class AdvertisementListItem extends React.Component {
  static defaultProps = {
    classes: "",
    projectPage: false,
  };

  onRequestAdClick = () => {
    this.props.setChoosedAdId(this.props.ad._id);
    this.props.setShowModal(true);
  };
  gotoProjectPage = () => {
    this.props.history.push({
      pathname: `/profile/myProject`,
      state: {
        ad: this.props.ad,
      },
    });
  };

  showCompleteModal = () => {
    if (this.props.projectPage) {
      this.props.setStates({
        employerDoneAssurance: true,
        errorMessage: "",
      });
    }
    this.props.setStates({
      showModal: true,
      modalText: strings.screens.doneAssurance,
      currentAd: this.props.ad,
      errorMessage: "",
    });
  };
  showUploadFileModal = () => {
    console.log("!!!!showUploadFileModal got called");
    this.props.setStates({
      showUploadModal: true,
      currentAd: this.props.ad,
    });
  };
  getPendingText = () => {
    let { ad } = this.props;
    let pendingText = "";
    if (this.props.projectPage && ad.status === strings.adStatus.doing) {
      if (ad.employerDone) {
        pendingText = strings.pendingStatusEmployer.youButNotTranslator;
      } else if (ad.translatorDone) {
        pendingText = strings.pendingStatusEmployer.translatorButNotYou;
      } else {
        // let uploadTranslatedFileInfo = !!ad.translatedFile
        //   ? strings.pendingStatusEmployer.approveInfoWithTranslatedFile
        //   : strings.pendingStatusEmployer.approveInfoWithoutTranslatedFile;
        pendingText = !!ad.translatedFile
          ? strings.pendingStatusEmployer.approveInfoWithTranslatedFile +
            "\n" +
            strings.pendingStatusEmployer.norYouNorTranslator
          : strings.pendingStatusEmployer.approveInfoWithoutTranslatedFile;
      }
    } else if (!this.props.employer && ad.status === strings.adStatus.doing) {
      if (ad.employerDone) {
        pendingText = strings.pendingStatusTranslator.employerButNotYou;
      } else if (ad.translatorDone) {
        pendingText = strings.pendingStatusTranslator.youButNotEmployer;
      } else {
        pendingText = !!ad.translatedFile
          ? strings.pendingStatusTranslator.approveInfoWithTranslatedFile +
            "\n" +
            strings.pendingStatusTranslator.norYouNorEmployer
          : strings.pendingStatusTranslator.approveInfoWithoutTranslatedFile;
      }
    }
    return pendingText;
  };

  findCost = () => {
    let { profile } = this.props;
    let { ad } = this.props;
    let cost;
    if (ad && profile) {
      for (let i = 0; i < ad.requestedTranslators.length; i++) {
        if (ad.requestedTranslators[i].id === profile._id) {
          cost = ad.requestedTranslators[i].cost;
          break;
        }
      }
    }

    return cost;
  };
  getProjectCost = () => {
    let text;
    if (
      !this.props.employer &&
      this.props.translator &&
      !this.props.appliable &&
      !this.props.projectPage
    ) {
      if (this.props.ad.status === strings.adStatus.requested) {
        let cost = this.findCost();
        text = `${strings.screens.offeredPrice} : ${cost}${" "}
          ${strings.forms.toman}`;
      } else {
        text = `${strings.screens.agreedPrice} : ${
          this.props.ad.translator.cost
        }${" "}
          ${strings.forms.toman}`;
      }
    }
    return text;
  };

  downloadFile = (address) => {
    window.open(`${URL.protocol}://${URL.baseURL}:${URL.port}/${address}`);
  };

  render() {
    let { appliable, employer, translator, projectPage } = this.props;
    let { ad } = this.props;
    let cardClasses = `right-aligned ${this.props.classes}`;
    let pendingText = this.getPendingText();
    let projectCost = this.getProjectCost();
    console.log(
      "related props : ",
      appliable,
      employer,
      translator,
      projectPage,
      ad
    );
    return (
      <Card className={cardClasses}>
        <Card.Body>
          <Card.Title className="purple-txt">{ad.title}</Card.Title>
          <Card.Subtitle className="mb-2">
            {strings.screens.project} {ad.field}
            <br />
            {ad.origin_lang} {"به"} {ad.target_lang}
            <br />
            {strings.screens.deadline} {":"} {ad.deadline}{" "}
            {strings.screens.days}
          </Card.Subtitle>
          <Card.Text>{ad.explanation}</Card.Text>
          {projectCost ? <Card.Text>{projectCost}</Card.Text> : null}
          {pendingText !== "" ? (
            <Card.Text>
              {strings.screens.status} : {pendingText}
            </Card.Text>
          ) : null}
          <div className="buttons-container">
            {appliable ? (
              <Button variant="primary" onClick={this.onRequestAdClick}>
                {strings.screens.requestAd}
              </Button>
            ) : null}
            {employer ? (
              <Button variant="primary" onClick={this.gotoProjectPage}>
                {strings.screens.seeSituation}
              </Button>
            ) : null}
            {ad.status === strings.adStatus.doing &&
            !ad.translatorDone &&
            !employer &&
            translator &&
            !appliable &&
            !projectPage ? (
              !!ad.translatedFile ? (
                <div>
                  <Button variant="primary" onClick={this.showCompleteModal}>
                    {strings.screens.completeProject}
                  </Button>
                </div>
              ) : (
                <Button variant="primary" onClick={this.showUploadFileModal}>
                  {strings.screens.uploadTranslatedFile}
                </Button>
              )
            ) : null}

            {ad.status === strings.adStatus.doing &&
            !ad.employerDone &&
            !employer &&
            !translator &&
            !appliable &&
            projectPage &&
            ad.translatedFile ? (
              <Button variant="primary" onClick={this.showCompleteModal}>
                {strings.screens.completeProject}
              </Button>
            ) : null}

            {/* upload buttons : */}
            <div>
              {(ad.status === strings.adStatus.doing &&
                !employer &&
                translator &&
                !appliable &&
                !projectPage &&
                !!ad.translatedFile) ||
              (projectPage && !!ad.translatedFile) ||
              (ad.status === strings.adStatus.done && !employer) ? (
                <Button
                  onClick={() => this.downloadFile(ad.translatedFile)}
                  variant="light"
                  className="download-btn"
                >
                  {strings.screens.downloadTranslatedFile}
                </Button>
              ) : null}

              {projectPage ||
              (ad.status !== strings.adStatus.requested && translator) ? (
                <Button
                  onClick={() => this.downloadFile(ad.translationFile)}
                  variant="light"
                  className="download-btn"
                >
                  {strings.screens.downloadTranslationFile}
                </Button>
              ) : null}
            </div>
          </div>
        </Card.Body>
      </Card>
    );
  }
}
export default withRouter(AdvertisementListItem);
