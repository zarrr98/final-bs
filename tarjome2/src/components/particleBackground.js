import React from "react";
import "../index.css";
import Particles from "react-particles-js";
import strings from '../utils/strings'

export default class ParticleBackground extends React.Component {
  render() {
    return (
      <div className="particle-wrapper">
        <Particles
          params= {this.props.params}
        />
        <div className="particle-txt">
        <h1>{strings.mainPage.particleTitle}</h1>
        <h4>{strings.mainPage.particleSubtitle}</h4>
        </div>
      </div>
    );
  }
}
