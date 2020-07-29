import React from "react";
import "../index.css";
import strings from "../utils/strings";

export default class InfoSection extends React.Component {
  render() {
    return (
      <div className="info-section-container extra-margin-top">
        <div className="info-row">
          <div className="info-col">
            <h5>درباره ما</h5>
            <p>{strings.mainPage.aboutUsInfo1}</p>
            <p>{strings.mainPage.aboutUsInfo2}</p>
            <p>{strings.mainPage.aboutUsInfo3}</p>
          </div>
          <div className="info-col">
            <h5>{strings.mainPage.contactUs}</h5>
            <p>{strings.mainPage.contactUs1}</p>
            <p>{strings.mainPage.contactUs2}</p>
            <p>{strings.mainPage.contactUs3}</p>
          </div>
        </div>
      </div>
    );
  }
}
