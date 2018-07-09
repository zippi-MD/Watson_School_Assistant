
'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var AssistantV1 = require('watson-developer-cloud/assistant/v1');

var app = express();


app.use(express.static('./public'));
app.use(bodyParser.json());


const {classes, nextClass, nextClasses} = require('./userInfo/classes');
const {assigments, pendingAssigments, newAssigment} = require('./userInfo/assigments');



var assistant;

if (process.env.ASSISTANT_IAM_APIKEY !== undefined && process.env.ASSISTANT_IAM_APIKEY.length > 0) {
  assistant = new AssistantV1({
    'version': '2018-02-16',
    'url': process.env.ASSISTANT_IAM_URL || '<url>',
    'iam_apikey': process.env.ASSISTANT_IAM_APIKEY || '<iam_apikey>',
    'iam_url': 'https://iam.bluemix.net/identity/token'
  });
} else {
  assistant = new AssistantV1({
    'version': '2018-02-16',
    'username': process.env.ASSISTANT_USERNAME || '<username>',
    'password': process.env.ASSISTANT_PASSWORD || '<password>'
  });
}


app.post('/api/message', function (req, res) {
  var workspace = process.env.WORKSPACE_ID || '<workspace-id>';
  if (!workspace || workspace === '<workspace-id>') {
    return res.json({
      'output': {
        'text': 'The app has not been configured with a <b>WORKSPACE_ID</b> environment variable. Please refer to the ' + '<a href="https://github.com/watson-developer-cloud/assistant-simple">README</a> documentation on how to set this variable. <br>' + 'Once a workspace has been defined the intents may be imported from ' + '<a href="https://github.com/watson-developer-cloud/assistant-simple/blob/master/training/car_workspace.json">here</a> in order to get a working application.'
      }
    });
  }
  var payload = {
    workspace_id: workspace,
    context: req.body.context || {},
    input: req.body.input || {}
  };


  assistant.message(payload, function (err, data) {
    if (err) {
      return res.status(err.code || 500).json(err);
    }
    return res.json(updateMessage(payload, data));
  });
});

app.get('/user/classes', (req, res) => {
  res.status(200).send(nextClasses());
});

app.get('/user/class', (req, res) => {
  res.status(200).send(nextClass());
});

app.get('/user/assigments', (req, res) => {

  res.status(200).send(pendingAssigments());
});

app.post('/user/assigment', (req, res) => {
  newAssigment(req.body.info, req.body.dueDate);
  res.status(200).send();
});

app.get('/date', (req, res) => {
  res.status(200).send(new Date());
});


function updateMessage(input, response) {
  var responseText = null;
  if (!response.output) {
    response.output = {};
  } else {
    return response;
  }
  if (response.intents && response.intents[0]) {
    var intent = response.intents[0];

    if (intent.confidence >= 0.75) {
      responseText = 'I understood your intent was ' + intent.intent;
    } else if (intent.confidence >= 0.5) {
      responseText = 'I think your intent was ' + intent.intent;
    } else {
      responseText = 'I did not understand your intent';
    }
  }
  response.output.text = responseText;
  return response;
}

module.exports = app;