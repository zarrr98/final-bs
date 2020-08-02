const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const checkAuth = require("../middleware/check-auth");
const confirmEmailToken = require("../middleware/confirm-email");
const User = require("../../models/user");
const Advertisement = require("../../models/advertisement");
// const templates = require("../../email/templates");
// const sendEmail = require("../../email/send");
const transporter = require("../../email/send");
const sendEmail = require("../../email/templates");
const { upload } = require("../middleware/upload-file");
const messages = require("../../messages");
//const persianDate = require("persian-date");

const JWT_KEY = "dracaris";

//handle clicking on confirmation link
router.get("/confirmation/:token", confirmEmailToken, (req, res, next) => {
  console.log("req.decodedJWT in handle confirmation => ", req.decodedJWT);
  let message = messages.welcome(
    req.decodedJWT.first_name,
    req.decodedJWT.role
  );
  console.log("Weldome message : ", message);
  let query = { _id: req.decodedJWT.userId };
  let update = {
    $set: { confirmed: true },
    $push: { messages: message },
  };

  User.update(query, update)
    .exec()
    .then((resolve) => {
      res.redirect("http://localhost:3000/login");
    })
    .catch((err) => {
      return res.status(500).json({ error: err, status: 500 });
    });
});

//signup
router.put("/adduser", (req, res, next) => {
  User.findOne({ email: req.body.email })
    .exec()
    .then((u) => {
      // We have a new user!
      if (!u) {
        bcrypt.hash(req.body.password, 10, (error, hash) => {
          if (error) {
            console.log("error in bcrypt - signup");
            return res.status(500).json({
              error,
              status: 500,
            });
          } else {
            const user = new User({
              _id: mongoose.Types.ObjectId(),
              role: req.body.role,
              first_name: req.body.first_name,
              last_name: req.body.last_name,
              email: req.body.email,
              password: hash,
            });

            user
              .save()
              .then((saveUserResolve) => {
                const confirmationToken = jwt.sign(
                  {
                    email: user.email,
                    userId: user._id,
                    role: user.role,
                    first_name: user.first_name,
                    last_name: user.last_name,
                  },
                  JWT_KEY,
                  {
                    expiresIn: "1h",
                  }
                );
                transporter
                  .sendMail(
                    sendEmail(
                      req.body.email,
                      "تایید ایمیل سایت ترجمه",
                      confirmationToken
                    )
                  )
                  .then((resolve) => {
                    return res.status(200).json({
                      message: "sent email successfully",
                      status: 200,
                      answer: {
                        resolve,
                        user: user,
                      },
                    });
                  })
                  .catch((err) => {
                    console.log("error in send email");
                    return res.status(500).json({
                      error: err,
                      status: 500,
                    });
                  });

                // });
              })
              .catch((err) => {
                console.log("here");
                return res.status(500).json({
                  error: err,
                  status: 500,
                });
              });
          }
        });

        //user hast vali confirmed nist
      } else if (u && !u.confirmed) {
        const confirmationToken = jwt.sign(
          {
            email: u.email,
            userId: u._id,
            role: u.role,
            first_name: u.first_name,
            last_name: u.last_name,
          },
          JWT_KEY,
          {
            expiresIn: "1h",
          }
        );
        transporter
          .sendMail(
            sendEmail(
              req.body.email,
              "تایید ایمیل سایت ترجمه",
              confirmationToken
            )
          )
          .then((resolve) => {
            return res.status(202).json({
              message: "sent email successfully",
              status: 202,
              answer: {
                resolve,
                user: u,
              },
            });
          })
          .catch((err) => {
            console.log("error in send email");
            return res.status(500).json({
              error: err,
              status: 500,
            });
          });
      }

      // We have already seen this email address.
      else if (u) {
        return res
          .status(409)
          .json({ message: "user already existed", status: 409 });
      }
    })
    .catch((err) => {
      return res.status(500).json({
        error: err,
        status: 500,
      });
    });
});

//login
router.get("/users/:email/:pass", (req, res, next) => {
  //console.log(new persianDate().format())
  let email = req.params.email;
  User.findOne({
    email: email,
  })
    .exec()
    .then((resolve) => {
      if (resolve) {
        if (resolve._doc.confirmed) {
          bcrypt.compare(
            req.params.pass,
            resolve._doc.password,
            (err, same) => {
              if (err) {
                console.log("error in bcrypt");
                return res
                  .status(403)
                  .json({ message: "Auth failed", status: 403 });
              }
              console.log("same and err in bcrypt : ", same, err);
              if (same) {
                const token = jwt.sign(
                  {
                    email: resolve._doc.email,
                    userId: resolve._doc._id,
                    role: resolve._doc.role,
                    first_name: resolve._doc.first_name,
                    last_name: resolve._doc.last_name,
                  },
                  JWT_KEY,
                  {
                    expiresIn: "30d",
                  }
                );
                return res.status(200).json({
                  resolve: {
                    _id: resolve._doc._id,
                    role: resolve._doc.role,
                    first_name: resolve._doc.first_name,
                    last_name: resolve._doc.last_name,
                    email: resolve._doc.email,
                    translatorFields: resolve._doc.translatorFields,
                    messages: resolve._doc.messages,
                    token,
                  },
                  status: 200,
                });
              }

              console.log("same false in bcrypt");
              res.status(403).json({ message: "Auth failed", status: 403 });
            }
          );
          //it should confirm it's email
        } else {
          console.log("user is not confirmed - login resolve :", resolve._doc);
          const confirmationToken = jwt.sign(
            {
              email: resolve._doc.email,
              userId: resolve._doc._id,
              role: resolve._doc.role,
              first_name: resolve._doc.first_name,
              last_name: resolve._doc.last_name,
            },
            JWT_KEY,
            {
              expiresIn: "1h",
            }
          );
          transporter
            .sendMail(
              sendEmail(email, "تایید ایمیل سایت ترجمه", confirmationToken)
            )
            .then((resolve1) => {
              return res.status(201).json({
                message: "sent email successfully",
                status: 201,
                resolve: resolve._doc,
              });
            })
            .catch((err) => {
              console.log("error in send email");
              return res.status(500).json({
                error: err,
                status: 500,
              });
            });
        }
      } else {
        console.log("user not found");
        return res.status(403).json({ message: "Auth failed", status: 403 });
      }
    })
    .catch((err) => {
      return res.status(500).json({ error: err, status: 500 });
    });
});

//set translator fields
router.patch("/users", checkAuth, (req, res, next) => {
  console.log("req.decodedJWT => ", req.decodedJWT);
  // let id = req.params.uid;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  if (req.decodedJWT.role === "مترجم") {
    User.update({ _id: req.decodedJWT.userId }, { $set: updateOps })
      .exec()
      .then((resolve) => {
        res.status(200).json({
          status: 200,
          message: "User was updated successfully!!!",
          resolve,
        });
      })
      .catch((err) => {
        return res.status(500).json({ error: err, status: 500 });
      });
  } else {
    return res.status(403).json({ message: "Auth failed", status: 403 });
  }
});

//get all the translators (by employer) => url changed!
router.get("/translators", checkAuth, (req, res, next) => {
  if (req.decodedJWT.role === "کارفرما") {
    User.find({ role: "مترجم" })
      .exec()
      .then((resolve) => {
        let translators = resolve.filter((t) => t.translatorFields != null);
        res.status(200).json({
          status: 200,
          message: "translators returned successfully!",
          resolve: translators,
        });
      })
      .catch((err) => {
        return res.status(500).json({ error: err, status: 500 });
      });
  } else {
    return res.status(403).json({ message: "Auth failed", status: 403 });
  }
});

//create advertisement
router.put(
  "/addAdvertisement",
  checkAuth,
  upload.single("translationFile"),
  (req, res, next) => {
    const ad = new Advertisement({
      _id: mongoose.Types.ObjectId(),
      ownerId: req.decodedJWT.userId,
      title: req.body.title,
      origin_lang: req.body.origin_lang,
      target_lang: req.body.target_lang,
      field: req.body.field,
      deadline: req.body.deadline,
      translationFile: req.file.path,
      explanation: req.body.explanation,
    });
    if (req.decodedJWT.role === "کارفرما") {
      ad.save()
        .then((resolve) =>
          res.status(200).json({
            message: "avertisement was added successfully.",
            status: 200,
            resolve,
          })
        )
        .catch((err) => {
          return res.status(500).json({
            error: err,
            status: 500,
          });
        });
    } else {
      return res.status(403).json({ message: "Auth failed", status: 403 });
    }
  }
);

//get all the advertisements (by translators)
router.get("/advertisements", checkAuth, (req, res, next) => {
  User.findById(req.decodedJWT.userId)
    .exec()
    .then((user) => {
      console.log("user found! user : ", user.translatorFields);
      if (req.decodedJWT.role === "مترجم" && user.translatorFields) {
        console.log("yes its motarjem!");
        let languages = [...user.translatorFields.languages, "فارسی"];
        Advertisement.find({ status: "requested" })
          .exec()
          .then((resolve) => {
            let filetered = resolve.filter(
              (a) =>
                languages.includes(a.origin_lang) &&
                languages.includes(a.target_lang) &&
                user.translatorFields.fields.includes(a.field)
            );
            return res.status(200).json({
              status: 200,
              message: "advertisements returned successfully!",
              resolve: filetered,
            });
          })
          .catch((err) => {
            res.status(500).json({ error: err, status: 500 });
          });
      } else {
        return res.status(403).json({ message: "Auth failed", status: 403 });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err, status: 500 });
    });
});

//apply for advertisements (by translator) => url changed!
router.patch("/applyForAd", checkAuth, (req, res, next) => {
  let id = req.decodedJWT.userId;
  let adId = req.body.adId;
  let cost = req.body.cost;

  if (req.decodedJWT.role === "مترجم") {
    let exist = false;
    Advertisement.findById(adId)
      .exec()
      .then((adv) => {
        adv.requestedTranslators.map((t) => {
          if (t.id === id) {
            exist = true;
          }
        });
        if (exist) {
          res.status(200).json({
            status: 201,
            message: "You have already applied for this ad",
          });
        }
        //here
        else {
          Advertisement.findOneAndUpdate(
            { _id: adId },
            { $push: { requestedTranslators: { cost, id } } }
          )
            .exec()
            .then((resolve) => {
              //send a msg to the employer
              let message = messages.translatorApplied(
                `${req.decodedJWT.first_name} ${req.decodedJWT.last_name}`,
                adv.title
              );

              let query = { _id: adv.ownerId };
              let update = {
                $push: { messages: message },
              };

              User.update(query, update)
                .exec()
                .then((resolve2) => {
                  res.status(200).json({
                    status: 200,
                    message: "applied to ad successfully",
                    resolve,
                  });
                })
                .catch((err) => {
                  return res.status(500).json({ error: err, status: 500 });
                });
            })
            .catch((err) => {
              return res.status(500).json({ error: err, status: 500 });
            });
        }
      })
      .catch((err) => {
        return res.status(500).json({ error: err, status: 500 });
      });
  } else {
    return res.status(403).json({ message: "Auth failed", status: 403 });
  }
});

//get projects of an employer => url changed!
router.get("/employerProjects", checkAuth, (req, res, next) => {
  let id = req.decodedJWT.userId;
  if (req.decodedJWT.role === "کارفرما") {
    Advertisement.find({ ownerId: id })
      .exec()
      .then((resolve) => {
        res.status(200).json({
          status: 200,
          message: "advertisements returned successfully!",
          resolve,
        });
      })
      .catch((err) => {
        return res.status(500).json({ error: err, status: 500 });
      });
  } else {
    return res.status(403).json({ message: "Auth failed", status: 403 });
  }
});

//get projects of a translator => url changed!
router.get("/translatorProjects", checkAuth, (req, res, next) => {
  let id = req.decodedJWT.userId;
  if (req.decodedJWT.role === "مترجم") {
    Advertisement.find()
      .exec()
      .then((resolve) => {
        let projects = resolve.filter((p) => {
          if (p.translator.id === id) {
            return true;
          } else if (p.status === "requested") {
            let exist = false;
            p.requestedTranslators.map((t) => {
              if (t.id === id) {
                exist = true;
              }
            });
            return exist;
          } else {
            return false;
          }
        });

        res.status(200).json({
          status: 200,
          message: "advertisements returned successfully!",
          resolve: projects,
        });
      })
      .catch((err) => {
        return res.status(500).json({ error: err, status: 500 });
      });
  } else {
    return res.status(403).json({ message: "Auth failed", status: 403 });
  }
});

//get a user by id (used to get the translator of a project) => url changed!
router.get("/projectTranslator/:uid", checkAuth, (req, res, next) => {
  let uid = req.params.uid;
  User.findById(uid)
    .exec()
    .then((resolve) => {
      res.status(200).json({
        status: 200,
        message: "translator returned successfully!",
        resolve: {
          _id: resolve._id,
          role: resolve.role,
          first_name: resolve.first_name,
          last_name: resolve.last_name,
          email: resolve.email,
          translatorFields: resolve.translatorFields,
          messages : resolve.messages
        },
      });
    })
    .catch((err) => {
      return res.status(500).json({ error: err, status: 500 });
    });
});

//get all the translators of a project => url changed!
router.put("/projectTranslators", checkAuth, (req, res, next) => {
  let offers = req.body.offers;

  let ids = [];
  offers.map((offer) => {
    ids.push(offer.id);
  });

  User.find()
    .where("_id")
    .in(ids)
    .exec()
    .then((resolve) => {
      let translators = [];
      for (let i = 0; i < resolve.length; i++) {
        for (let j = 0; j < offers.length; j++) {
          if (resolve[i]._id === offers[j].id) {
            translators[i] = { ...resolve[i], cost: offers[j].cost };
            break;
          }
        }
      }

      res.status(200).json({
        status: 200,
        message: "translators returned successfully!",
        resolve,
      });
    })
    .catch((err) => {
      return res.status(500).json({ error: err, status: 500 });
    });
});

//choose translator by employer => url changed!
router.patch("/chooseTranslator/:aid", checkAuth, (req, res, next) => {
  let adId = req.params.aid;
  if (req.decodedJWT.role === "کارفرما") {
    Advertisement.update({ _id: adId }, { $set: req.body.ad })
      .exec()
      .then((resolve) => {
        let message = messages.translatorChoosed(req.body.message);
        let query = { _id: req.body.ad.translator.id };
        let update = {
          $push: { messages: message },
          $inc: { "translatorFields.acceptedProjects": 1 },
        };
        User.findOneAndUpdate(query, update)
          .exec()
          .then((resolve2) => {
            res.status(200).json({
              status: 200,
              message: "choosed translator and incremented stuff successfully",
              resolve,
            });
          })
          .catch((err) => {
            return res.status(500).json({ error: err, status: 500 });
          });
      })
      .catch((err) => {
        return res.status(500).json({ error: err, status: 500 });
      });
  } else {
    return res.status(403).json({ message: "Auth failed", status: 403 });
  }
});

//done a project by employer=> url changed
router.patch("/employer/done/:aid", checkAuth, (req, res, next) => {
  let adId = req.params.aid;

  if (req.decodedJWT.role === "کارفرما") {
    Advertisement.findById(adId)
      .exec()
      .then((ad) => {
        updateObj = { employerDone: true };
        let done = false;
        if (ad.translatorDone) {
          updateObj.status = "done";
          done = true;
        }
        Advertisement.update({ _id: adId }, { $set: updateObj })
          .exec()
          .then((resolve) => {
            console.log("$$ here")
            let message = messages.employerDoneTheProject(ad.title, done);

            let query = { _id: ad.translator.id };
            let update = {
              $push: { messages: message },
             // $inc: done ? { "translatorFields.doneProjects": 1 } : {},
            };
            if (done){
              update.$inc = { "translatorFields.doneProjects": 1 };
            }

            User.findOneAndUpdate(query, update)
              .exec()
              .then((resolve2) => {
                res.status(200).json({
                  status: 200,
                  message: "Done project and incremented stuff successfully",
                  resolve,
                });
              })
              .catch((err) => {
                return res.status(500).json({ error: err, status: 500 });
              });
          })
          .catch((err) => {
            return res.status(500).json({ error: err, status: 500 });
          });
        //    }
      })
      .catch((err) => {
        return res.status(500).json({ error: err, status: 500 });
      });
  } else {
    return res.status(403).json({ message: "Auth failed", status: 403 });
  }
});

//done a project by translator => url changed!
router.patch("/translator/done/:aid", checkAuth, (req, res, next) => {
  let adId = req.params.aid;

  if (req.decodedJWT.role === "مترجم") {
    Advertisement.findById(adId)
      .exec()
      .then((ad) => {
        updateObj = { translatorDone: true };
        let done = false;
        if (ad.employerDone) {
          updateObj.status = "done";
          done = true;
        }
        Advertisement.update({ _id: adId }, { $set: updateObj })
          .exec()
          .then((resolve) => {
            let message = messages.translatorDoneTheProject(ad.title, done);

            let query = { _id: ad.ownerId };
            let update = {
              $push: { messages: message },
            };

            User.update(query, update)
              .exec()
              .then((resolve2) => {
                if (done) {
                  User.findOneAndUpdate(
                    { _id: ad.translator.id },
                    { $inc: { "translatorFields.doneProjects": 1 } }
                  )
                    .exec()
                    .then((resolve3) => {
                      res.status(200).json({
                        status: 200,
                        message:
                          "Done project and incremented stuff successfully",
                        resolve,
                      });
                    })
                    .catch((err) => {
                      return res.status(500).json({ error: err, status: 500 });
                    });
                } else {
                  res.status(200).json({
                    status: 200,
                    message: "ad got done successfully!!!",
                    resolve,
                  });
                }
              })
              .catch((err) => {
                return res.status(500).json({ error: err, status: 500 });
              });
          })
          .catch((err) => {
            return res.status(500).json({ error: err, status: 500 });
          });
        // }
      })
      .catch((err) => {
        return res.status(500).json({ error: err, status: 500 });
      });
  } else {
    return res.status(403).json({ message: "Auth failed", status: 403 });
  }
});

//upload translated file by translator
router.patch(
  "/upload/translatedFile/:aid",
  checkAuth,
  upload.single("translatedFile"),
  (req, res, next) => {
    let adId = req.params.aid;
    if (req.decodedJWT.role === "مترجم") {
      Advertisement.update(
        { _id: adId },
        { $set: { translatedFile: req.file.path } }
      )
        .exec()
        .then((resolve) => {
          let message = messages.translatedFileUploaded(req.body.adName);

          let query = { _id: req.body.ownerId };
          let update = {
            $push: { messages: message },
          };

          User.update(query, update)
            .exec()
            .then((resolve2) => {
              res.status(200).json({
                status: 200,
                message: "uploaded translated file successfully",
                resolve,
              });
            })
            .catch((err) => {
              return res.status(500).json({ error: err, status: 500 });
            });

          // res.status(200).json({
          //   status: 200,
          //   message: "uploaded translated file successfully",
          //   resolve,
          // });
        })
        .catch((err) => {
          return res.status(500).json({ error: err, status: 500 });
        });
    } else {
      return res.status(403).json({ message: "Auth failed", status: 403 });
    }
  }
);

//get messages of a user
router.get("/user/messages", checkAuth, (req, res, next) => {
  let id = req.decodedJWT.userId;

  User.findById(id)
    .exec()
    .then((resolve) => {
      res.status(200).json({
        status: 200,
        message: "messages returned successfully!",
        resolve,
      });
    })
    .catch((err) => {
      return res.status(500).json({ error: err, status: 500 });
    });
});

//get a message and seen it
router.get("/user/getmessageandseen/:mid", checkAuth, (req, res, next) => {
  let id = req.decodedJWT.userId;
  let mid = req.params.mid;
  User.findById(id)
    .exec()
    .then((resolve) => {
      let message = {};
      // console.log(resolve._doc.messages[0]._doc);
      resolve._doc.messages.map((m) => {
        if (String(m._doc._id) === mid) {
          // console.log("message set");
          message = { ...m._doc, seen: true };
        }
      });

      let query = { "messages._id": mid };
      let update = {
        $set: {
          "messages.$.seen": true,
        },
      };
      User.update(query, update)
        .exec()
        .then((resolve2) => {
          res.status(200).json({
            status: 200,
            message: "message returned and got seen successfully!",
            msg: message,
          });
        })
        .catch((err) => {
          return res.status(500).json({ error: err, status: 500 });
        });
    })
    .catch((err) => {
      return res.status(500).json({ error: err, status: 500 });
    });
});

module.exports = router;

//send email (test)
// router.put("/sendemail", (req, res, next) => {
//   User.findOne({ email: req.body.email })
//     .exec()
//     .then((u) => {
//       // We have a new user!

//         bcrypt.hash(req.body.password, 10, (error, hash) => {
//           const user = new User({
//             _id: mongoose.Types.ObjectId(),
//             role: req.body.role,
//             first_name: req.body.first_name,
//             last_name: req.body.last_name,
//             email: req.body.email,
//             password: req.body.password,
//           });
//           const confirmationToken = jwt.sign(
//             {
//               email: user.email,
//               userId: user._id,
//               role: user.role,
//             },
//             JWT_KEY,
//             {
//               expiresIn: '7h', //test
//             }
//           );
//           transporter
//             .sendMail(
//               sendEmail(req.body.email,"تایید ایمیل سایت ترجمه",confirmationToken )
//             )
//             .then((resolve) => {
//               return res.status(200).json({
//                 message: "sent email successfully",
//                 status: 200,
//                 answer: {
//                  resolve,
//                  user : user,
//                 },
//               });
//             })
//             .catch((err) => {
//               console.log("error in send email");
//               return res.status(500).json({
//                 error: err,
//                 status: 500,
//               });
//             });

//         });

//       // We have already seen this email address.

//     })
//     .catch((err) => {
//       return res.status(500).json({
//         error: err,
//         status: 500,
//       });
//     });
// });
