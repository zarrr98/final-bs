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
};

module.exports = messages;

// module.exports.welcomeMessage = (name) => {
//     return {
//         topic: `${strings.welcomeTopic}`,
//         text : `${name} ${strings.welcomeText}`
//     }
// }
