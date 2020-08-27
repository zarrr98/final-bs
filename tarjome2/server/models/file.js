const mongoose = require("mongoose");

const fileSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    name : String,
    testFile : String,
  },
  { strict: false }
);

module.exports = mongoose.model("TestFile", fileSchema, "files");
