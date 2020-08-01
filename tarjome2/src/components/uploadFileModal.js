import React from "react";
import "../index.css";
import Dropzone from "react-dropzone";
import { FaCloudUploadAlt } from "react-icons/fa";
import strings from "../utils/strings";
import { Modal, Button, Spinner } from "react-bootstrap";
import { SendDataAndFile } from "../utils/services";
import { URL, AccpetedTypeFiles } from "../utils/configs";

export default class UploadFileModal extends React.Component {
  state = {
    acceptedFile: [],
    error: false,
    errorMessage: "",
    values: {},
    isLoading: false,
    showModal: this.props.showUploadModal,
  };

  fields = [
    {
      type: "upload-file",
      accept: AccpetedTypeFiles,
      label: strings.screens.uploadTranslatedTitle,
      //placeholder: strings.forms.ProjectExplanationPlaceHolder,
      name: "translatedFile",
      errorMessage: "",
      required: true,
    },
  ];

  setAlertShowModal = (val) => {
    this.setState({ alertShowModal: val });
  };

  setErrorMessage = (name, msg) => {
    this.fields.map((item) => {
      if (item.name === name) {
        item.errorMessage = msg;
        return;
      }
    });
  };
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

  checkResponseStatus = (response) => {
    if (!response) {
      this.setState({ errorMessage: strings.screens.connectionError });
    } else if (response.status === 200) {
      this.props.setStates({
        showUploadModal: false,
        successMessage: strings.screens.uploadTranslatedFileSuccessMsg,
      });
      this.setState({
        values: {},
        acceptedFile: [],
      });
      this.props.refreshProjects();
    } else if (response.status === 500) {
      this.setState({ errorMessage: strings.screens.connectionError });
    }else if (response.status === 413) {
      this.props.setProfile(null);

      window.location = "/";
      localStorage.removeItem("profile");
    } else {
      this.setState({ errorMessage: strings.screens.connectionError });
    }
  };

  submit = async () => {
    const { values } = this.state;
    const { ad, profile } = this.props;
    let error = false;
    this.fields.map((item, i) => {
      if (item.required && !values[item.name]) {
        item.errorMessage = strings.screens.errorEmpty;
        error = true;
      }
    });
    this.setState({
      error,
    });
    if (!error) {
      console.log("Everything is ok in submit : values => ", values);
      let sendData = {...values , adName : ad.title, ownerId: ad.ownerId}
      this.setState({ isLoading: true });
      const data = await SendDataAndFile(
        `${URL.protocol}://${URL.baseURL}:${URL.port}/upload/translatedFile/${ad._id}`,
        sendData,
        profile ? profile.token : "",
        "PATCH"
      );
      this.setState({ isLoading: false });
      this.checkResponseStatus(data);
    }
  };

  onDropRejected = (rejected) => {
    console.log("$$ onDropRejected got called => ", rejected);
    alert(strings.screens.uploadTypeFileExplanation)
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
        onHide={() => this.props.setStates({ showUploadModal: false })}
        className="right-aligned"
      >
        <Modal.Header>
          <Modal.Title>{strings.screens.uploadTranslatedTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {this.fields.map((item) => {
            if (item.type === "upload-file") {
              return (
                <div>
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
                            strings.screens.uploadFileExplanation}
                          {isDragActive &&
                            !isDragReject &&
                            strings.screens.uploadFileDropping}
                        </p>
                        <p className="text-danger mt-2">
                          {isDragReject &&
                            // this.setState({
                            //   wrongTypeFileDragged: true,
                            // }) &&
                            strings.screens.uploadFileTypeError}
                        </p>
                        {/* {rejectedFiles && rejectedFiles.length>0 && this.handleRejectedFiles(rejectedFiles)} */}
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
                    <p className="text-danger">{item.errorMessage}</p>
                  ) : null}
                </div>
              );
            }
          })}
          <div className="margin-top center-aligned">
            <p className="error-msg">{this.state.errorMessage}</p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
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
            {strings.screens.uploadFile}
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
