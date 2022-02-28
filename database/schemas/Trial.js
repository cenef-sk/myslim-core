const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TrialSchema = new Schema({
  name: {
    type: String
  },
  description: {
    type: String
  },
  code: {
    type: String
  },
  topic: {
    type: Schema.Types.ObjectId,
    ref: 'Topic'
  },
  topicVersion: {
    type: String
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  publicTrial: {
    type: Boolean
  },
  // duration, start-end, number of participants,
  // only registered users
  // public, private
  // invitation,
  trialPublicId: {
    type: String
  },
  data: {
    type: Schema.Types.Mixed
  },
},
{
  timestamps: true
});

module.exports = mongoose.model('Trial', TrialSchema);
