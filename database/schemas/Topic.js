const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TopicSchema = new Schema({
  name: {
    type: String
  },
  // could be mark down syntax, html, ... reference to video, ...
  description: {
    type: String
  },
  introCT: {
    type: Boolean
  },
  questionaire: {
    type: Boolean
  },
  introVideo: {
    type: Boolean
  },
  finalCT: {
    type: Boolean
  },
  //html? video individually?
  introStory: {
    type: String
  },
  finalStory: {
    type: String
  },
  hypothesis: {
    type: String
  },
  showActivities: {
    type: Boolean
  },
  finalQuestionnaire: {
    type: Boolean
  },
  customYoutube: {
    type: String
  },
  minNumDocs: {
    type: Number
  },
  template: {
    type: String,
    // enum: ['generic', 'climatic'],
  },
  templateSettings: {
    type: Schema.Types.Mixed
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  public: {
    type: Boolean
  },
  language: {
    type: String,
    enum: ['en', 'sk', 'cz'],
  },
  version: {
    type: String
  },
},
{
  timestamps: true
});

module.exports = mongoose.model('Topic', TopicSchema);
