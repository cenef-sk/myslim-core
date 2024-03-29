const express  = require('express');
const router   = express.Router();
const config = require('../config');
const ObjectId = require('mongodb').ObjectId;

const User = require('../database/schemas/User');
const PRIVACY_FILTER = {password: 0, email: 0}

const jwt = require('jsonwebtoken');

const {sendEmail} = require('../services/userServices');
const {forgotSubject, forgotEmail} = require('../services/emailTemplates');

// GET TOKEN
// create valid token for valid user
router.post('/token', function(req, res, next) {
  var user = new User();

  const password = req.body.password;
  const email = req.body.email;

  if (password && email) {
    User
    .findOne({email: email})
    .exec((err, user) => {
      if (err) {
        res.status(500).send({
          success: false,
          error: err,
        });
      } else {
        if (user) {
          user.comparePassword(password, function(err, isMatch){
            if(isMatch){
              const tokenContent = {
                _id: user._id,
                name: user.name,
                roles: user.roles,
                language: user.language,
              };
              const token = jwt.sign(tokenContent, config.SECRET, {
                expiresIn: '30d' // expires in 30 days
              });

              res.status(200).json({
                success: true,
                token: token
              });
            } else {
              res.status(401).json({
                success: false,
                message: "Wrong Login or Password"
              });
            }
          });
        } else {
          res.status(401).json({
            success: false,
            message: "Wrong Login or Password"
          });
        }
      }
    });
  } else {
    res.status(500).send({
      success: false,
      message: "Password or email not provided!"
    });
  }
});

// GET ALL USERS
router.get('/', function(req, res, next) {
  User
  .find({}, PRIVACY_FILTER)
  .exec((err, users) => {
    if (err) {
      res.status(500).send({
        success: false,
        error: err
      });
    } else {
      res.status(200).send({
        success: true,
        data: users
      });
    }
  });
});

// GET User
router.get('/:id', function(req, res, next) {
  const id = req.params.id;
  if (ObjectId.isValid(id)) {
    User
    .findOne({_id: id}, PRIVACY_FILTER)
    .exec((err, user) => {
      if (err) {
        res.status(500).send({
          success: false,
          error: err
        });
      } else {
        if (user) {
          res.status(200).send({
            success: true,
            data: user
          });
        } else {
          res.status(404).send({
            success: false,
            message: "No user found!"
          });
        }
      }
    });
  } else {
    res.status(500).send({
      success: false,
      message: "Incorect user ID!"
    });
  }
});

// DELETE User
router.delete('/:id', function(req, res, next) {
  const id = req.params.id;
  if (ObjectId.isValid(id)) {
    //   Document.findByIdAndRemove(req.params.id, function(err) {
    User
    .findByIdAndRemove(id)
    .exec((err, user) => {
      if (err) {
        res.status(500).send({
          success: false,
          error: err
        });
      } else {
        if (user) {
          res.status(200).send({
            success: true,
            message: "User has been removed!"
          });
        } else {
          res.status(404).send({
            success: false,
            message: "No user found!"
          });
        }
      }
    });
  } else {
    res.status(500).send({
      success: false,
      message: "Incorect user ID!"
    });
  }
});

router.post('/', function(req, res, next) {
  var user = new User();

  user.name = req.body.name;
  user.language = req.body.language;
  user.email = req.body.email;
  user.password = req.body.password;
  user.roles = ["Teacher"];
  user.approvedEmail = false;

  User
  .findOne({email: user.email})
  .exec((err, user2) => {
    if (err) {
      res.status(500).send({
        success: false,
        error: err,
      });
    } else {
      if (user2) {
        res.status(403).send({
          success: false,
          message: "User with the same email already exists",
        });
      } else {
        user.save(function(err) {
          if (err){
            res.status(500).send({
              success: false,
              error: err,
            });
          } else {
            delete user.password;
            res.status(200).send({
              success: true,
              data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                roles: user.roles,
                approvedEmail: user.approvedEmail,
              }
            });
          }
        });
      }
    }
  });

});

router.post('/forgot', function(req, res, next) {
  var user = new User();

  user.email = req.body.email;
  lng = req.body.lng;

  User
  .findOne({email: user.email})
  .exec((err, user2) => {
    if (err) {
      res.status(500).send({
        success: false,
        error: err,
      });
    } else {
      if (user2) {

        const tokenContent = {
          _id: user2._id,
        };
        const token = jwt.sign(tokenContent, config.SECRET, {
          expiresIn: 60*30 // expires in 30 minutes
        });


        sendEmail(user.email, forgotSubject(lng),
        forgotEmail(lng, token), () => {
          res.status(200).send({
            success: true,
          });
        })
      } else {
        res.status(200).send({
          success: true,
        });
      }
    }
  });

});


//UPDATE User (update allowed only for - name, password, language)
router.put('/reset', function(req, res, next) {
  const token = req.body.token;
  const password = req.body.password;

  if (token && password) {
    jwt.verify(token, config.SECRET, function(err, decoded) {
      if (err) {
        //return wrong token
        res.status(200).json({
          success: false,
        })
        // next(new Error('Failed to authenticate. Login again.'));
      } else {
        let id = decoded._id;
        if (ObjectId.isValid(id)) {
          User.findById(id, function(err, user) {
            if (err) {
              res.status(500).send({
                success: false,
                error: err,
              });
            } else {

              if (user) {
                    user.password = password;

                    user.updatedAt = Date.now();

                    user.save(function(err) {
                      if (err) {
                        res.status(500).send({
                          success: false,
                          error: err,
                        });
                      } else {
                        res.status(200).send({
                          success: true,
                          message: "User has been updated!"
                        });
                      }
                    });
              }
            }
          });
        } else {
          res.status(500).send({
            success: false,
            message: "Incorect user ID!"
          });
        }

      }
    })
  } else {
    res.status(400).send({
      success: false,
      message: "Bad request"
    });
  }

});


//UPDATE User (update allowed only for - name, password, language)
router.put('/:id', function(req, res, next) {
  const id = req.params.id;
  if (ObjectId.isValid(id)) {
    User.findById(id, function(err, user) {
      if (err) {
        res.status(500).send({
          success: false,
          error: err,
        });
      } else {

        if (req.body.password && req.body.newPassword && user) {
          user.comparePassword(req.body.password, function(err, isMatch){
            if(isMatch){
              user.password = req.body.newPassword;

              user.updatedAt = Date.now();

              user.save(function(err) {
                if (err) {
                  res.status(500).send({
                    success: false,
                    error: err,
                  });
                } else {
                  res.status(200).send({
                    success: true,
                    message: "User has been updated!"
                  });
                }
              });
            } else {
              res.status(200).json({
                success: false,
                message: "Wrong Old Password"
              });
            }
          });
        } else {
          if (req.body.name) user.name = req.body.name;
          if (req.body.language) user.language = req.body.language;
          user.updatedAt = Date.now();

          user.save(function(err) {
            if (err) {
              res.status(500).send({
                success: false,
                error: err,
              });
            } else {
              res.status(200).send({
                success: true,
                message: "User has been updated!"
              });
            }
          });
        }


      }
    });
  } else {
    res.status(500).send({
      success: false,
      message: "Incorect user ID!"
    });
  }
});

module.exports = router;
