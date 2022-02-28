const express  = require('express');
const router   = express.Router();
const config = require('../config');
const ObjectId = require('mongodb').ObjectId;

const Document = require('../database/schemas/Document');

const PRIVACY_FILTER = {password: 0, email: 0}

router.put('/:id', function(req, res, next) {
  const id = req.params.id;
  if (ObjectId.isValid(id)) {
    Document.findOne({_id: id}).exec((err, document) => {
      if (err) {
        res.status(500).send({
          success: false,
          error: err
        });
      } else {
        if (document) {
          if (req.body.data) document.data = req.body.data;
          document.save((err) => {
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
            message: "No document found!"
          });
        }
      }
    });
  }
});


// GET Document
router.get('/:id', function(req, res, next) {
  const id = req.params.id;
  if (ObjectId.isValid(id)) {
    Document
    .findOne({_id: id})
    .populate("user", PRIVACY_FILTER)
    .populate("trial", PRIVACY_FILTER)
    .populate("topic", PRIVACY_FILTER)
    .populate("participant", PRIVACY_FILTER)
    .exec((err, document) => {
      if (err) {
        res.status(500).send({
          success: false,
          error: err
        });
      } else {
        if (document) {
          res.status(200).send({
            success: true,
            data: document
          });
        } else {
          res.status(404).send({
            success: false,
            message: "No document found!"
          });
        }
      }
    });
  } else {
    res.status(500).send({
      success: false,
      message: "Incorect document ID!"
    });
  }
});

router.get('/trial/:id', function(req, res, next) {
  const id = req.params.id;
  if (ObjectId.isValid(id)) {
    Document
    .find({trial: new ObjectId(id)})
    // .populate("user", PRIVACY_FILTER)
    // .populate("trial", PRIVACY_FILTER)
    // .populate("topic", PRIVACY_FILTER)
    // .populate("participant", PRIVACY_FILTER)
    .exec((err, documents) => {
      if (err) {
        res.status(500).send({
          success: false,
          error: err
        });
      } else {
        if (documents) {
          res.status(200).send({
            success: true,
            data: documents
          });
        } else {
          res.status(404).send({
            success: false,
            message: "No document found!"
          });
        }
      }
    });
  } else {
    res.status(500).send({
      success: false,
      message: "Incorect trial ID!"
    });
  }
});


// DELETE document
router.delete('/:id', function(req, res, next) {
  const id = req.params.id;
  if (ObjectId.isValid(id)) {
    Document
    .findByIdAndRemove(id)
    .exec((err, document) => {
      if (err) {
        res.status(500).send({
          success: false,
          error: err
        });
      } else {
        if (document) {
          res.status(200).send({
            success: true,
            message: "Document has been removed!"
          });
        } else {
          res.status(404).send({
            success: false,
            message: "No document found!"
          });
        }
      }
    });
  } else {
    res.status(500).send({
      success: false,
      message: "Incorect document ID!"
    });
  }
});

module.exports = router;
