const express  = require('express');
const router   = express.Router();
const config = require('../config');
const ObjectId = require('mongodb').ObjectId;

const Participant = require('../database/schemas/Participant');
const User = require('../database/schemas/User');
const Topic = require('../database/schemas/Topic');
const Trial = require('../database/schemas/Trial');
const Document = require('../database/schemas/Document');

const PRIVACY_FILTER = {password: 0, email: 0}

// JOIN TRIAL by CODE
router.post('/:id/documents', function(req, res, next) {
  if (req.user) {
    const id = req.params.id;
    if (ObjectId.isValid(id)) {
      Participant
      .findOne({_id: id})
      .exec((err, participant) => {
        if (err) {
          res.status(500).send({
            success: false,
            error: err
          });
        } else {
          if (participant) {
            let document = new Document();

            if (participant.user){
              document.user = participant.user;
            }
            if (participant.guest){
              document.guest = participant.guest;
            }

            document.participant = participant._id;
            document.trial = participant.trial;
            document.topic = participant.topic;
            document.data = req.body.data;

            document.save(function(err) {
              if (err) {
                res.status(500).send({
                  success: false,
                  error: err,
                });
              } else {
                res.status(200).send({
                  success: true,
                  data: document
                });
              }
            });
          } else {
            res.status(404).send({
              success: false,
              message: "No participant found!"
            });
          }
        }
      });
    } else {
      res.status(500).send({
        success: false,
        message: "Incorect participant ID!"
      });
    }
  } else {
    res.status(401).send({
      success: false,
      message: "Unauthorized access!"
    });
  }
});

// GET ALL PARTICIPANTS for TRIAL
router.get('/:id/documents', function(req, res, next) {
  const id = req.params.id;
  if (ObjectId.isValid(id)) {
    Document
    .find({participant: id})
    .populate("user", PRIVACY_FILTER)
    .populate("trial", PRIVACY_FILTER)
    .populate("topic", PRIVACY_FILTER)
    .populate("participant", PRIVACY_FILTER)
    .exec((err, documents) => {
      if (err) {
        res.status(500).send({
          success: false,
          error: err
        });
      } else {
        res.status(200).send({
          success: true,
          data: documents
        });
      }
    });
  }
});


// UPDATE participant
router.put('/:id', function(req, res, next) {
  const id = req.params.id;
  if (ObjectId.isValid(id)) {
    Participant.findOne({_id: id}).exec((err, participant) => {
      if (err) {
        res.status(500).send({
          success: false,
          error: err
        });
      } else {
        if (participant) {
          if (req.body.data) participant.data = req.body.data;
          if (req.body.stateId) participant.stateId = req.body.stateId;
          if (req.body.chatHistory) participant.chatHistory = req.body.chatHistory;
          if (req.body.documents) participant.documents = req.body.documents;
          participant.save((err) => {
            if (err) {
              res.status(500).send({
                success: false,
                error: err,
              });
            } else {
              res.status(200).send({
                success: true,
                data: participant
              });
            }
          });
        } else {
          res.status(404).send({
            success: false,
            message: "No participant found!"
          });
        }
      }
    });
  }
});


// GET participant
router.get('/:id', function(req, res, next) {
  const id = req.params.id;
  if (ObjectId.isValid(id)) {
    Participant
    .findOne({_id: id})
    .populate("user", PRIVACY_FILTER)
    .populate("trial", PRIVACY_FILTER)
    .populate("topic", PRIVACY_FILTER)
    .populate("documents")
    .exec((err, participant) => {
      if (err) {
        res.status(500).send({
          success: false,
          error: err
        });
      } else {
        if (participant) {
          res.status(200).send({
            success: true,
            data: participant
          });
        } else {
          res.status(404).send({
            success: false,
            message: "No participant found!"
          });
        }
      }
    });
  } else {
    res.status(500).send({
      success: false,
      message: "Incorect participant ID!"
    });
  }
});

// DELETE participant
router.delete('/:id', function(req, res, next) {
  const id = req.params.id;
  if (ObjectId.isValid(id)) {
    Participant
    .findByIdAndRemove(id)
    .exec((err, participant) => {
      if (err) {
        res.status(500).send({
          success: false,
          error: err
        });
      } else {
        if (participant) {
          res.status(200).send({
            success: true,
            message: "Participant has been removed!"
          });
        } else {
          res.status(404).send({
            success: false,
            message: "No participant found!"
          });
        }
      }
    });
  } else {
    res.status(500).send({
      success: false,
      message: "Incorect participant ID!"
    });
  }
});
// ADD MESSAGE TO CHAT HISTORY
//

module.exports = router;
