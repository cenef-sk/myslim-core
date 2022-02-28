const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DocumentSchema = new Schema({
  guest: {
    name: {
      type: String
    },
    _id: {
      type: String
    }
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  topic: {
    type: Schema.Types.ObjectId,
    ref: 'Topic'
  },
  trial: {
    type: Schema.Types.ObjectId,
    ref: 'Trial'
  },
  participant: {
    type: Schema.Types.ObjectId,
    ref: 'Participant'
  },
  data: {
    type: Schema.Types.Mixed
  },
  // dataVersion: {
  //   type: String
  // }
},
{
  timestamps: true
});

module.exports = mongoose.model('Document', DocumentSchema);
