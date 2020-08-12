const mongoose = require("mongoose");

const adSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    ownerId: String,
    requestedTranslators: [{cost: String, id: String}],
    translator: {cost: String, id: String},
    employerDone : { type: Boolean, default: false },
    translatorDone : { type: Boolean, default: false },
    title: String,
    origin_lang: String,
    target_lang: String,
    field: String,
    deadline: String,
    explanation: String,
    status: { type: String, default: "requested", enum : ["requested", "doing", "done"] }, //[requested , doing , done]
    translationFile : { type: String, required: true },
    translatedFile : String,
  },
  { strict: false }
);

module.exports = mongoose.model("Advertisement", adSchema, "advertisements");
