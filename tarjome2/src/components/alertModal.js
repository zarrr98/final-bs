import React from "react";
import "../index.css";
import { Modal, Button, Spinner } from "react-bootstrap";
import strings from "../utils/strings";
import { URL } from "../utils/configs";
import { withRouter } from "react-router-dom";
import { PatchData } from "../utils/services";

class AlertModal extends React.Component {
  static defaultProps = {
    acceptanceAssuarance: true,
    translatorDoneAssurance: false,
    employerDoneAssurance: false,
    errorMessage: "",
  };
  state = {
    showModal: this.props.showModal,
    error: false,
    errorMessage: this.props.errorMessage,
    isLoading: false,
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.showModal !== this.state.showModal) {
      //Perform some operation
      this.setState({ showModal: nextProps.showModal });
    }
  }

  checkResponseStatus = (response) => {
    if (!response) {
      this.props.setErrorMessage(strings.screens.connectionError);
    } else if (response.status === 200) {
      if (this.props.translatorDoneAssurance) {
        this.props.ad.translatorDone = true;
        this.props.refreshProjects();
      } else {
        console.log("after patching data status 200 : ", response);
        this.props.history.push({
          pathname: "/profile",
        });
      }
    } else if (response.status === 403) {
      this.props.setErrorMessage(strings.screens.AuthFailedError);
    } else if (response.status === 413) {
      this.props.setProfile(null);

      window.location = "/";
      localStorage.removeItem("profile");
    } else {
      this.props.setErrorMessage(strings.screens.connectionError);
    }
  };
  chooseTranslator = async () => {
    let { profile, ad, choosenTranslator } = this.props;
    let sendData = {
      translator: { id: choosenTranslator._id, cost: choosenTranslator.cost },
      status: "doing",
    };
    console.log("@@@@sendData : ", sendData);
    this.setState({ isLoading: true });
    const data = await PatchData(
      `${URL.protocol}://${URL.baseURL}:${URL.port}/chooseTranslator/${ad._id}`,
      sendData,
      profile ? profile.token : ""
    );
    this.setState({ isLoading: false });
    this.checkResponseStatus(data);
    this.props.setShowModal(false);
  };

  doneForEmployer = async () => {
    console.log("doneForEmployer got called");
    let { profile, ad, choosenTranslator } = this.props;
    this.setState({ isLoading: true });
    const data = await PatchData(
      `${URL.protocol}://${URL.baseURL}:${URL.port}/employer/done/${ad._id}`,
      {},
      profile ? profile.token : ""
    );
    this.setState({ isLoading: false });
    this.checkResponseStatus(data);
    this.props.setShowModal(false);
  };
  doneForTranslator = async () => {
    console.log("doneFor translator got called");
    let { profile, ad } = this.props;
    this.setState({ isLoading: true });
    const data = await PatchData(
      `${URL.protocol}://${URL.baseURL}:${URL.port}/translator/done/${ad._id}`,
      {},
      profile ? profile.token : ""
    );
    this.setState({ isLoading: false });
    this.checkResponseStatus(data);
    this.props.setShowModal(false);
  };
  componentDidMount = () => {
    this.setState({
      errorMessage: "",
    });
  };
  render() {
    return (
      <Modal
        size="lg"
        show={this.state.showModal}
        onHide={() => this.props.setShowModal(false)}
        className="right-aligned"
        centered
      >
        {this.props.header ? (
          <Modal.Header>
            <Modal.Title>{this.props.headerText}</Modal.Title>
          </Modal.Header>
        ) : null}
        <Modal.Body>
          <h4>{this.props.text}</h4>
        </Modal.Body>
        <Modal.Footer>
          <div className="buttons-container">
            <Button
              variant="success"
              onClick={
                this.props.employerDoneAssurance
                  ? this.doneForEmployer
                  : this.props.translatorDoneAssurance
                  ? this.doneForTranslator
                  : this.chooseTranslator
              }
              disabled={this.state.isLoading ? true : false}
            >
              {this.state.isLoading ? (
                <Spinner
                  as="span"
                  animation="grow"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
              ) : null}
              {strings.screens.yesSure}
            </Button>
            <Button
              variant="danger"
              onClick={() => this.props.setShowModal(false)}
              disabled={this.state.isLoading ? true : false}
            >
              {strings.screens.notSure}
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default withRouter(AlertModal);
