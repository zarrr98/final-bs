const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  role: {type : String , required : true},
  first_name: {type : String , required : true},
  last_name: {type : String , required : true},
  email: {type : String , required : true , unique : true},
  password: {type : String , required : true},
  confirmed : {type : Boolean , default : false}, // change
  translatorFields : mongoose.Schema.Types.Mixed,
}, {strict: false});

module.exports = mongoose.model("User", userSchema, "users");
