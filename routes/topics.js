const express  = require('express');
const router   = express.Router();
const config = require('../config');
const ObjectId = require('mongodb').ObjectId;

const User = require('../database/schemas/User');
const Topic = require('../database/schemas/Topic');
const Trial = require('../database/schemas/Trial');

const PRIVACY_FILTER = {password: 0, email: 0}

// CREATE TOPIC

router.post('/', function(req, res, next) {
  var topic = new Topic();

  topic.name = req.body.name;
  topic.introVideo =  req.body.introVideo;
  topic.introCT =  req.body.introCT;
  topic.questionaire =  req.body.questionaire;
  topic.minNumDocs =  req.body.minNumDocs;
  topic.template = req.body.template;
  topic.public = req.body.public;
  topic.hypothesis = req.body.hypothesis;
  topic.description = req.body.description;
  topic.showActivities = req.body.showActivities;
  topic.language = req.body.language;

//TODO add next properties

  topic.save(function(err) {
    if (err){
      res.status(500).send({
        success: false,
        error: err,
      });
    } else {
      res.status(200).send({
        success: true,
        data: topic
      });
    }
  });
});

// GET ALL TOPIC for admin
router.get('/', function(req, res, next) {
  let filter = {};
  if (req.query.userId) {
    let userId = req.query.userId
    // TODO if incorect userId
    if (ObjectId.isValid(userId)) {
      filter = Object.assign({}, filter, {owner: userId})
    }
  }

  Topic
  .find(filter)
  .populate("owner", PRIVACY_FILTER)
  .exec((err, topics) => {
    if (err) {
      res.status(500).send({
        success: false,
        error: err
      });
    } else {
      res.status(200).send({
        success: true,
        data: topics
      });
    }
  });
});
// list of topics for the users

// CREATE TRIAL FOR TOPIC
router.post('/:id/trials', function(req, res, next) {
  if (req.user) {
    const id = req.params.id;
    if (ObjectId.isValid(id)) {
      Topic.findById(id, function(err, topic) {
        if (err) {
          res.status(500).send({
            success: false,
            error: err,
          });
        } else {

          const code = req.body.code;

          Trial.findOne({code: code}, function(err, trialDuplicate) {
            if (err) {
              res.status(500).send({
                success: false,
                error: err,
              });
            } else {
              if (trialDuplicate) {
                res.status(403).send({
                  success: false,
                  message: "Trial with the same code already exists",
                });
              } else {
                var trial = new Trial();

                trial.name = req.body.name;
                trial.description = req.body.description;
                trial.code = req.body.code;
                trial.topic = topic;
                trial.owner = req.user._id;
                trial.publicTrial =  req.body.publicTrial;


                trial.save(function(err) {
                  if (err) {
                    res.status(500).send({
                      success: false,
                      error: err,
                    });
                  } else {
                    res.status(200).send({
                      success: true,
                      data: trial
                    });
                  }
                });
              }
            }
          });
        }
      });
    } else {
      res.status(500).send({
        success: false,
        message: "Incorect topic ID!"
      });
    }
  } else {
    res.status(401).send({
      success: false,
      message: "Unauthorized access!"
    });
  }
});

// GET TRIALS FOR TOPIC
router.get('/:id/trials', function(req, res, next) {
  if (req.user) {
    const id = req.params.id;
    if (ObjectId.isValid(id)) {
      Trial.find({topic: new ObjectId(id)}, function(err, trials) {
        if (err) {
          res.status(500).send({
            success: false,
            error: err,
          });
        } else {

          res.status(200).send({
            success: true,
            data: trials
          });
        }
      });
    } else {
      res.status(500).send({
        success: false,
        message: "Incorect topic ID!"
      });
    }
  } else {
    res.status(401).send({
      success: false,
      message: "Unauthorized access!"
    });
  }
});

module.exports = router;
