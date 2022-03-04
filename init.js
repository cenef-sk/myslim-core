const fs = require('fs');
// const Grid = require('gridfs-stream');
const mongoose = require('mongoose');
const config = require('./config');

// const IMMUNIZATION = require('./immunization');

//Start mongodb connection
const dbconnection = require('./database/db.js');

const Document = require('./database/schemas/Document');
const Participant = require('./database/schemas/Participant');
const Topic = require('./database/schemas/Topic');
const Trial = require('./database/schemas/Trial');
const User = require('./database/schemas/User');

function createUser(email, password,  name, roles, _id) {
  const user = new User();

  if (_id) {
    user._id = _id;
  }

  user.email = email;
  user.password = password;
  user.name = name;
  user.roles = roles;

  return(user);
}

function createTopic(user, template, name, description, introCT, introStory, hypothesis, finalQuestionnaire, _id) {
  const topic = new Topic();
  if (_id) {
    topic._id = _id;
  }

  topic.owner = user;
  topic.template = template;
  topic.name = name;
  topic.description = description;
  topic.introCT = introCT;
  topic.introStory = introStory;
  topic.hypothesis = hypothesis;
  topic.finalQuestionnaire = finalQuestionnaire;
  topic.public = true;

  return(topic);
}


function createTrial(user, topic, code, name, _id) {
  const trial = new Trial();
  if (_id) {
    trial._id = _id;
  }

  trial.owner = user;
  trial.topic = topic;
  trial.code = code;
  trial.name = name;

  return(trial);
}

function createParticipant(user, topic, trial, messages, _id) {
  const participant = new Participant();
  if (_id) {
    participant._id = _id;
  }

  participant.user = user;
  participant.topic = topic;
  participant.trial = trial;
  participant.chatHistory = messages;

  return(participant);
}

function createDocument(user, topic, trial, participant, data, _id) {
  const document = new Document();
  if (_id) {
    document._id = _id;
  }

  document.user = user;
  document.topic = topic;
  document.trial = trial;
  document.participant = participant;
  document.data = data;

  return(document);
}

async function main(application) {
  console.log("PROCESSING ...");

  await Document.deleteMany({});
  await Participant.deleteMany({});
  await Topic.deleteMany({});
  await Trial.deleteMany({});
  await User.deleteMany({});

  // setup admin account customize the default values
  const admin = createUser('admin@admin.com', 'adminPass', 'Admin Name',  ['Member', 'Admin', 'Teacher']);
  await admin.save();

  // const topic1 = createTopic(admin, "chat-climatic", "Klimatické zmeny", "Klimatické zmeny neformalnou formou", true, "introStory", "hypothesis", true);
  // await topic1.save();
  //
  // const topic2 = createTopic(admin, "chat-generic", "Očkovanie", "Očkovanie neformalnou formou", true, "introStory", "hypothesis", true);
  // await topic2.save();
  //
  // const topic3 = createTopic(admin, "chat-generic", "Zdravá strava", "Zdravá strava", true, "introStory", "hypothesis", true);
  // await topic3.save();
  //
  // const topic4 = createTopic(admin, "form-generic", "Zdravá strava", "Zdravá strava", true, "introStory", "hypothesis", true);
  // await topic4.save();
  //
  // const trial1 = createTrial(admin,  topic1, "FFFFFF", "1.C");
  // await trial1.save();
  // const trial2 = createTrial(admin,  topic1, "EEEEEE", "2.C");
  // await trial2.save();
  // const trial3 = createTrial(admin,  topic2, "DDDDDD", "2.C");
  // await trial3.save();
  // const trial4 = createTrial(admin,  topic3, "BBBBBB", "2.C");
  // await trial4.save();
  // const trial5 = createTrial(admin,  topic4, "AAAAAA", "2.C");
  // await trial5.save();


  // const message1 = {
  //   text: "Ahoj Peter"
  // };
  // const message2 = {
  //   text: "Ahoj Juraj"
  // };
  //
  // const messages = [message1, message2];
  // const participant1 = createParticipant(admin,  topic1, trial1, messages);
  // await participant1.save();

  // const document1 = createDocument(
  //   admin,  topic1, trial1, participant1, {url: "http://sme.sk"}
  // );
  // await document1.save();

  // const document2 = createDocument(
  //   admin,  topic1, trial1, participant1, {url: "http://dennikn.sk"}
  // );
  // await document2.save();

  await dbconnection.disconnectDB();
  process.exit();
}

var stdin = process.openStdin();

// Wait while db is initialized
setTimeout(() => {
  console.log("==================================================================");
  console.log("ARE YOU SURE, ALL DATA IN " + config.dbURI + " WILL BE DELETED (Y/N)!: [N]");
}, 2000);

stdin.addListener("data", function(d) {
    if (d.toString().trim() == "Y") {
      main();
    } else {
      process.exit();
    }
  });
