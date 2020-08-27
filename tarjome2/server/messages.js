const strings = require("./strings");
const mongoose = require("mongoose");

const messages = {
  welcome: (name, role) => {
    return {
      _id: mongoose.Types.ObjectId(),
      topic: `${strings.welcomeTopic}`,
      text:
        role === "کارفرما"
          ? `${name} ${strings.welcomeTextEmployer}`
          : `${name} ${strings.welcomeTextTranslator}`,
    };
  },

  translatorApplied: (translatorName, adName) => {
    return {
      _id: mongoose.Types.ObjectId(),
      topic: strings.translatorAppliedTopic(adName),
      text: strings.translatorAppliedText(translatorName, adName),
    };
  },

  translatorChoosed: (adName) => {
    return {
      _id: mongoose.Types.ObjectId(),
      topic: strings.translatorChoosedTopic(adName),
      text: strings.translatorChoosedText(adName),
    };
  },

  //for notifying the employer
  translatedFileUploaded: (adName) => {
    return {
      _id: mongoose.Types.ObjectId(),
      topic: strings.translatedFileUploadedTopic(adName),
      text: strings.translatedFileUploadedText(adName),
    };
  },

  //for notifying the employer
  translatorDoneTheProject : (adName , EmployeDone) => {
    return {
      _id : mongoose.Types.ObjectId(),
      topic : strings.translatorDoneTheProjectTopic(adName),
      text : strings.translatorDoneTheProjectText(adName , EmployeDone)
    }
  },

  //for notifying the translator
  employerDoneTheProject : (adName , TranslatorDone) => {
    return {
      _id : mongoose.Types.ObjectId(),
      topic : strings.employerDoneTheProjectTopic(adName),
      text : strings.employerDoneTheProjectText(adName , TranslatorDone)
    }
  },
  
};

module.exports = messages;
