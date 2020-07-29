import React from "react";
import "../index.css";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import strings from "../utils/strings";
import { Fields, Languages, URL, AccpetedTypeFiles } from "../utils/configs";
import { SendDataAndFile } from "../utils/services";
import Dropzone from "react-dropzone";
import { FaCloudUploadAlt } from "react-icons/fa";

export default class CreateAdModal extends React.Component {
  state = {
    showModal: this.props.showModal,
    values: {
      field: Fields[0],
      origin_lang: [...Languages, strings.forms.persian][0],
      target_lang: [...Languages, strings.forms.persian][0],
    },
    error: false,
    errorMessage: "",
    isLoading: false,
    acceptedFile: [],
  };
  fields = [
    {
      type: "text",
      label: strings.forms.projectName,
      placeholder: strings.forms.projectNamePlaceHolder,
      errorMessage: "",
      required: true,
      name: "title",
    },

    {
      type: "one-row",
      name: "languages",
      errorMessage: "",
      validationFunction: (vals) => {
        return vals[0] != vals[1];
      },
      unvalidMessage: strings.forms.languagesSililarErr,
      fields: [
        {
          type: "selectoption",
          label: strings.forms.originLang,
          disabledValue: strings.forms.originLang,
          options: [...Languages, strings.forms.persian],
          name: "origin_lang",
          required: true,
        },
        {
          type: "selectoption",
          label: strings.forms.targetLang,
          disabledValue: strings.forms.targetLang,
          options: [...Languages, strings.forms.persian],
          name: "target_lang",
          required: true,
        },
      ],
    },
    {
      type: "selectoption",
      label: strings.forms.textField,
      disabledValue: strings.forms.textField,
      options: Fields,
      name: "field",
      required: true,
    },
    {
      type: "text",
      formType: "number",
      min: 1,
      label: strings.forms.translationDeadline,
      name: "deadline",
      errorMessage: "",
      placeholder: strings.forms.daysNeeded,
      required: true,
      validationFunction: (value) => {
        return value > 0;
      },
      unvalidMessage: strings.screens.notNegativeExperience,
    },
    {
      type: "upload-file",
      accept: AccpetedTypeFiles,
      label: strings.screens.uploadFileTitle,
      //placeholder: strings.forms.ProjectExplanationPlaceHolder,
      name: "translationFile",
      errorMessage: "",
      required: true,
    },
    {
      type: "textarea",
      formType: "textarea",
      label: strings.screens.explanation,
      placeholder: strings.forms.ProjectExplanationPlaceHolder,
      name: "explanation",
      errorMessage: "",
      required: true,
    },
  ];

  onDrop = (acceptedFiles, key) => {
    let { values } = this.state;
    acceptedFiles.length > 0 &&
      this.setState({
        values: { ...values, [key]: acceptedFiles[0] },
        acceptedFile: acceptedFiles,
        error: false,
        errorMessage: "",
      });

    acceptedFiles.length > 0 && this.setErrorMessage(key, "");
  };

  onDropRejected = (rejected) => {
   // console.log("$$ onDropRejected got called => ", rejected);
    alert(strings.screens.uploadTypeFileExplanation)
  };

  setErrorMessage = (name, msg) => {
    this.fields.map((item) => {
      if (item.name === name) {
        item.errorMessage = msg;
        return;
      } else if (item.type === "one-row") {
        item.fields.map((r) => {
          if (r.name === name) {
            r.errorMessage = msg;
            return;
          }
        });
      }
    });
  };

  handleChange = (key, e) => {
    const { values } = this.state;

    this.setState({
      values: { ...values, [key]: e },
      error: false,
      errorMessage: "",
    });
    this.setErrorMessage(key, "");
  };
  optionHandleChange = (key, value, name) => {
    console.log(
      "optionHandleClick got called , key and value is :",
      key,
      value
    );
    const { values } = this.state;
    let selectedOption;
    for (let i = 0; i < value.length; i++) {
      if (value[i].selected) {
        selectedOption = value[i].value;
        console.log(
          "selected option : ",
          selectedOption,
          " and its index is : ",
          i
        );
        break;
      }
    }

    this.setState({
      values: { ...values, [key]: selectedOption },
      error: false,
      errorMessage: "",
    });
    this.setErrorMessage(name, "");
  };

  checkResponseStatus = (response) => {
    if (!response) {
      this.setState({ errorMessage: strings.screens.connectionError });
    } else if (response.status === 200) {
      this.props.setShowModal(false);
      this.props.refreshProjects();
      this.setState({
        values: {
          field: Fields[0],
          origin_lang: [...Languages, strings.forms.persian][0],
          target_lang: [...Languages, strings.forms.persian][0],
        },
      });
    } else if (response.status === 500) {
      this.setState({ errorMessage: strings.screens.connectionError });
    } else {
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
      } else if (item.validationFunction) {
        if (item.type === "one-row") {
          let arr = [];
          item.fields.map((r) => arr.push(values[r.name]));
          if (!item.validationFunction(arr)) {
            item.errorMessage = item.unvalidMessage;
            error = true;
          }
        } else if (!item.validationFunction(values[item.name])) {
          item.errorMessage = item.unvalidMessage;
          error = true;
        }
      }
    });
    this.setState({
      error,
    });
    if (!error) {
      console.log("Everything is ok in submit : values => ", values);
      this.setState({ isLoading: true });
      const data = await SendDataAndFile(
        `${URL.protocol}://${URL.baseURL}:${URL.port}/addAdvertisement`,
        values,
        this.props.profile.token,
        "PUT"
      );
      this.setState({ isLoading: false });
      this.checkResponseStatus(data);
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
      >
        <Modal.Header>
          <Modal.Title>{strings.profile.createAd}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form className="right-aligned">
            {this.fields.map((item, i) => {
              if (item.type === "text") {
                return (
                  <Form.Group className="margin-top" key={item.name}>
                    {item.label ? <Form.Label>{item.label}</Form.Label> : null}
                    <Form.Control
                      type={item.formType}
                      placeholder={item.placeholder}
                      onChange={(e) =>
                        this.handleChange(item.name, e.target.value)
                      }
                      value={this.state.values[item.name]}
                      min={item.min}
                    />
                    {this.state.error ? (
                      <Form.Text className="text-danger">
                        {item.errorMessage}
                      </Form.Text>
                    ) : null}
                  </Form.Group>
                );
              } else if (item.type === "selectoption") {
                return (
                  <Form.Group key={item.name}>
                    {item.label ? <Form.Label>{item.label}</Form.Label> : null}
                    <Form.Control
                      as="select"
                      onChange={(e) =>
                        this.optionHandleChange(
                          item.name,
                          e.target.options,
                          item.name
                        )
                      }
                    >
                      {item.disabledValue ? (
                        <option key={item.disabledValue} disabled>
                          {item.disabledValue}
                        </option>
                      ) : null}
                      {item.options.map((field) => (
                        <option key={field}>{field}</option>
                      ))}
                    </Form.Control>
                    {this.state.error ? (
                      <Form.Text className="text-danger">
                        {item.errorMessage}
                      </Form.Text>
                    ) : null}
                  </Form.Group>
                );
              } else if (item.type === "textarea") {
                return (
                  <Form.Group key={item.name}>
                    {item.label ? <Form.Label>{item.label}</Form.Label> : null}
                    <Form.Control
                      as="textarea"
                      rows="3"
                      placeholder={item.placeholder}
                      onChange={(e) =>
                        this.handleChange(item.name, e.target.value)
                      }
                      value={this.state.values[item.name]}
                    />
                    {this.state.error ? (
                      <Form.Text className="text-danger">
                        {item.errorMessage}
                      </Form.Text>
                    ) : null}
                  </Form.Group>
                );
              } else if (item.type === "upload-file") {
                return (
                  <div>
                    {item.label ? <Form.Label>{item.label}</Form.Label> : null}
                    {/* <div className="text-center upload-file-container "> */}
                    <Dropzone
                      onDrop={(acceptedFiles) =>
                        this.onDrop(acceptedFiles, item.name)
                      }
                      onDropRejected={(rejected) =>
                        this.onDropRejected(rejected, item.name)
                      }
                      accept={item.accept}
                      multiple={false}
                    >
                      {({
                        getRootProps,
                        getInputProps,
                        isDragActive,
                        isDragReject,
                        rejectedFiles,
                      }) => (
                        <div
                          {...getRootProps()}
                          className="text-center upload-file-container "
                        >
                          <input {...getInputProps()} />
                          <p className="gray-text">
                            {!isDragActive &&
                              strings.screens.uploadFileExplanation
                              }
                            {isDragActive &&
                              !isDragReject &&
                              strings.screens.uploadFileDropping}
                          </p>
                          <p className="text-danger mt-2">
                            {isDragReject &&
                              strings.screens.uploadFileTypeError}
                          </p>

                          <div className="upload-btn">
                            <FaCloudUploadAlt className="refresh-icon " />{" "}
                            {this.state.acceptedFile.length > 0
                              ? strings.screens.uploadFileAgain
                              : strings.screens.uploadFile}
                          </div>
                          <ul className="list-group mt-2 margin-top">
                            {this.state.acceptedFile.length > 0 &&
                              this.state.acceptedFile.map((acceptedFile) => (
                                <li className="list-group-item list-group-item-success">
                                  {acceptedFile.name}
                                </li>
                              ))}
                          </ul>
                        </div>
                      )}
                    </Dropzone>
                    {this.state.error ? (
                      <Form.Text className="text-danger">
                        {item.errorMessage}
                      </Form.Text>
                    ) : null}
                    {/* </div> */}
                  </div>
                );
              } else if (item.type === "one-row") {
                return (
                  <React.Fragment>
                    <Form.Row>
                      {item.fields.map((rowF) => {
                        if (rowF.type === "selectoption") {
                          return (
                            <Form.Group key={rowF.name}>
                              {rowF.label ? (
                                <Form.Label>{rowF.label}</Form.Label>
                              ) : null}
                              <Form.Control
                                as="select"
                                onChange={(e) =>
                                  this.optionHandleChange(
                                    rowF.name,
                                    e.target.options,
                                    item.name
                                  )
                                }
                              >
                                {rowF.disabledValue ? (
                                  <option key={rowF.disabledValue} disabled>
                                    {rowF.disabledValue}
                                  </option>
                                ) : null}
                                {rowF.options.map((field) => (
                                  <option key={field}>{field}</option>
                                ))}
                              </Form.Control>
                              {this.state.error ? (
                                <Form.Text className="text-danger">
                                  {rowF.errorMessage}
                                </Form.Text>
                              ) : null}
                            </Form.Group>
                          );
                        }
                        // return (
                        //   <Col>
                        //     <Form.Control placeholder="First name" />
                        //   </Col>
                        // );
                      })}
                    </Form.Row>
                    {this.state.error ? (
                      <Form.Text className="text-danger margin-bottom">
                        {item.errorMessage}
                      </Form.Text>
                    ) : null}
                  </React.Fragment>
                );
              }
            })}
          </Form>
          <div className="margin-top center-aligned">
            <p className="error-msg">{this.state.errorMessage}</p>
          </div>
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
            {strings.forms.submitAd}
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
