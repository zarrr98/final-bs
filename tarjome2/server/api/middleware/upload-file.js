const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./translationfiles/");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
  },
});
const fileFilter = (req, file, cb) => {
  console.log("****FILE : ", file , " AND :", file.originalname.slice(-3));
  if (AccpetedTypeFiles.includes(file.mimetype)) {
    //accept it
    cb(null, true);
  } else {
    //ignore it
    cb(new Error("wrong type file!"), false);
  }
};

module.exports.upload = multer({
  //dest:"proposalFiles/",
  storage: storage,
  fileFilter: fileFilter,
});

const AccpetedTypeFiles = [
  "application/pdf",
  "video/x-matroska",
  "video/mp4",
  "audio/mpeg",
  "application/zip",
  "application/x-zip-compressed",
  "text/html",
  "image/gif",
  "image/jpeg",
  "image/png",
  "image/bmp",
  "text/plain",
  "application/rtf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "audio/midi",
  "audio/x-midi",
  "audio/wav",
  "video/3gpp",
  "audio/3gpp",
  "video/x-msvideo",
  "text/csv",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.ms-powerpoint",
  "application/octet-stream",
  "application/rar",
  "application/vnd.rar",
  "application/x-rar-compressed",
  "audio/aac",
  "audio/AMR",
  "video/ogg",
  "application/x-subrip",
];
