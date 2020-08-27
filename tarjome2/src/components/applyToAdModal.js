import React from "react";
import "../index.css";
import {
  Modal,
  Button,
  Form,
  Spinner,
  InputGroup,
  FormControl
} from "react-bootstrap";
import strings from "../utils/strings";
import { URL } from "../utils/configs";
import {PatchData} from '../utils/services'

export default class ApplyToAdModal extends React.Component {
  state = {
    showModal: this.props.showModal,
    values: {},
    error: false,
    errorMessage: "",
    isLoading: false
  };
  fields = [
    {
      type: "inputGroup",
      formType: "number",
      min: 0,
      label: strings.forms.offerYourCost,
      placeholder: strings.forms.offerYourCostPlaceHolder,
      required: true,
      name: "cost"
    }
  ];

  setErrorMessage = (name, msg) => {
    this.fields.map(item => {
      if (item.name === name) {
        item.errorMessage = msg;
        return;
      }
    });
  };

  handleChange = (key, e) => {
    const { values } = this.state;

    this.setState({
      values: { ...values, [key]: e },
      error: false,
      errorMessage: ""
    });
    this.setErrorMessage(key, "");
  };

  checkResponseStatus = response => {
    if (!response) {
      this.setState({ errorMessage: strings.screens.connectionError });
    } else if (response.status === 200) {
      console.log("applied for ad successfully")
        this.props.setShowModal(false);
        this.setState({values : {} , error : false})
      } else if (response.status === 201) {
        console.log("you have already applied for this ad");
        this.setState({ errorMessage: strings.forms.AppliedBeforeError});
      } else if (response.status === 500) {
        // console.log("ad adding failed :( data :", data);
        this.setState({ errorMessage: strings.screens.connectionError });
      }else if (response.status === 413) {
        this.props.setProfile(null);
  
        window.location = "/";
        localStorage.removeItem("profile");
      }
      
      
      else if (response.status === 403){
        this.setState({errorMessage : strings.screens.AuthFailedError})
      }else {
        this.setState({ errorMessage: strings.screens.connectionError });
      }
  };
  submit = async () => {
    const { values } = this.state;
    let error = false;
    this.fields.map((item, i) => {
      if (item.required && !values[item.name]) {
        item.errorMessage = strings.screens.errorEmpty;
        error = true;
      }
    });
    this.setState({
      error
    });
    if (!error) {
      this.setState({ isLoading: true });
      const data = await PatchData(
        `${URL.protocol}://${URL.baseURL}:${URL.port}/${URL.path}/applyForAd`,
        { ...values, adId: this.props.choosedAdId },
        this.props.profile ? this.props.profile.token : ""
      );
      this.setState({ isLoading: false });
      this.checkResponseStatus(data)
    }
  };
  componentWillReceiveProps(nextProps) {
    if (nextProps.showModal !== this.state.showModal) {
      //Perform some operation
      this.setState({ showModal: nextProps.showModal });
    }
  }

  render() {
    return (
      <Modal
        size="lg"
        show={this.state.showModal}
        onHide={() => this.props.setShowModal(false)}
        className="right-aligned"
        centered
      >
        <Modal.Header>
          <Modal.Title>{strings.screens.requestAd}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {this.fields.map(item => {
            if (item.type === "inputGroup") {
              return (
                <React.Fragment>
                  {item.label ? (
                    <label htmlFor="basic-url">{item.label}</label>
                  ) : null}
                  <InputGroup className="mb-3">
                    <FormControl
                      placeholder={item.placeholder}
                      onChange={e =>
                        this.handleChange(item.name, e.target.value)
                      }
                      value={this.state.values[item.name]}
                      type={item.formType}
                      min={item.min}
                    />

                    <InputGroup.Append>
                      <InputGroup.Text>{strings.forms.toman}</InputGroup.Text>
                    </InputGroup.Append>
                  </InputGroup>
                  {this.state.error ? (
                    <p className="text-danger" style={{ display: "block" }}>
                      {item.errorMessage}
                    </p>
                  ) : null}
                  <div className="margin-top center-aligned">
                    <p className="error-msg">{this.state.errorMessage}</p>
                  </div>
                </React.Fragment>
              );
            }
          })}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            // onClick={() => this.props.setShowModal(false)}
            onClick={this.submit}
            className="submit-btn-modal"
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
            {strings.forms.submitRequest}
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
