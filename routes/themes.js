const express  = require('express');
const router   = express.Router();

const THEMES = [{
    name: "Generic",
    id: "generic",

  },{
    name: "Climatic changes",
    id: "climatic",
  },
]

// GET ALL THEMES - currently static
router.get('/', function(req, res, next) {
  res.status(200).send({
    success: true,
    data: THEMES
  });
});

module.exports = router;
