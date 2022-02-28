const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ParticipantSchema = new Schema({
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
  chatHistory: [{
    time: {
      type: Date
    },
    user: {
      type: String
    },
    text: {
      type: String
    },
    kind: {
      type: String
    }
  }],
  stateId: {
    type: String
  },
  documents: [{
    type: Schema.Types.ObjectId,
    ref: 'Document'
  }],
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

module.exports = mongoose.model('Participant', ParticipantSchema);
