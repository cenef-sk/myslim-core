const express  = require('express');
const router   = express.Router();
const config = require('../config');
const jwt = require('jsonwebtoken');
const ObjectId = require('mongodb').ObjectId;

const Participant = require('../database/schemas/Participant');
const User = require('../database/schemas/User');
const Topic = require('../database/schemas/Topic');
const Trial = require('../database/schemas/Trial');
const Document = require('../database/schemas/Document');

// list of trials for Admin
const PRIVACY_FILTER = {password: 0, email: 0}

// GET ALL TRIALS for admin
router.get('/', function(req, res, next) {
  let filter = {};
  if (req.query.public === 'true') {
    filter = Object.assign({}, filter, {publicTrial: true})
  }
  if (req.query.userId) {
    let userId = req.query.userId
    // TODO if incorect userId
    if (ObjectId.isValid(userId)) {
      filter = Object.assign({}, filter, {owner: userId})
    }
  }
  if (req.query.trialId) {
    let trialId = req.query.trialId
    // TODO if incorect trialId
    if (ObjectId.isValid(trialId)) {
      filter = Object.assign({}, filter, {_id: trialId})
    }
  }
  if (req.query.code) {
    let code = req.query.code
    filter = Object.assign({}, filter, {code: code})
  }

  Trial
  .find(filter)
  .populate("owner", PRIVACY_FILTER)
  .populate("topic", PRIVACY_FILTER)
  .exec((err, trials) => {
    if (err) {
      res.status(500).send({
        success: false,
        error: err
      });
    } else {
      Participant.aggregate([
         { $match: { } },
         { $group: { _id: "$trial", count:{$sum:1} } }
      ]).exec((err, groups) => {
        if(err) {
          res.status(500).send({
            success: false,
            error: err
          });
        } else {
          res.status(200).send({
            success: true,
            data: trials.map((trial) => {
              const group = groups.find((group) => {
                return(group._id.equals(trial._id))
              })
              const count = (group)?group.count:0;
              return (Object.assign({}, trial.toObject() , {count: count}));
            })
          });
        }
      })
    }
  });
});

// GET ALL PARTICIPANTS for TRIAL
router.get('/:id/participants', function(req, res, next) {
  const id = req.params.id;
  if (ObjectId.isValid(id)) {
    Participant
    .find({trial: id})
    .populate("user", PRIVACY_FILTER)
    .populate("trial", PRIVACY_FILTER)
    .populate("topic", PRIVACY_FILTER)
    .exec((err, participants) => {
      if (err) {
        res.status(500).send({
          success: false,
          error: err
        });
      } else {
        Document.aggregate([
           { $match: { } },
           { $group: { _id: "$participant", count:{$sum:1} } }
        ]).exec((err, groups) => {
          if(err) {
            res.status(500).send({
              success: false,
              error: err
            });
          } else {
            res.status(200).send({
              success: true,
              data: participants.map((participant) => {
                const group = groups.find((group) => {
                  return(group._id.equals(participant._id))
                })
                const count = (group)?group.count:0;
                return (Object.assign({}, participant.toObject() , {count: count}));
              })
            });
          }
        })
      }
    });
  }
});

// JOIN TRIAL by CODE
router.post('/join', function(req, res, next) {
  let FILTER = null;
  const id = req.body.id;
  if (ObjectId.isValid(id)) {
    FILTER = {_id: req.body.id}
  }
  if(req.body.code) {
    FILTER = {code: req.body.code}
  }

  if(FILTER) {
    Trial
    .findOne(FILTER)
    .populate("topic")
    .exec((err, trial) => {
      if (err) {
        res.status(500).send({
          success: false,
          error: err
        });
      } else {
        if (req.user || req.body.name) {
          let participant = new Participant();

          if (req.user) {
            participant.user = req.user._id
          } else {
            participant.guest.name = req.body.name
          }

          participant.trial = trial._id;
          participant.topic = trial.topic

          participant.save(function(err) {
            if (err) {
              res.status(500).send({
                success: false,
                error: err,
              });
            } else {

              let token = null;
              if (participant.guest && participant.guest.name) {
                const id = new ObjectId();
                const tokenContent = {
                  _id: id,
                  name: participant.guest.name,
                  isGuest: true
                };
                token = jwt.sign(tokenContent, config.SECRET, {
                  expiresIn: '30d' // expires in 30 days
                });
              }

              res.status(200).send({
                success: true,
                data: {
                  participant: participant,
                  token: token,
                  template: trial.topic.template,
                  hypothesis: trial.topic.hypothesis,
                  showActivities: trial.topic.showActivities
                }
              });
            }
          });
        } else {
          res.status(500).send({
            success: false,
            message: "Please provide user token or guest name!"
          });
        }

      }
    });
  } else {
    res.status(500).send({
      success: false,
      message: "Please provide correct id or code to join trial!"
    });
  }
});


module.exports = router;
