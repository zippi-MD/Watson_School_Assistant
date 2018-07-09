

var ConversationPanel = (function() {
  var settings = {
    selectors: {
      chatBox: '#scrollingChat',
      fromUser: '.from-user',
      fromWatson: '.from-watson',
      latest: '.latest'
    },
    authorTypes: {
      user: 'user',
      watson: 'watson'
    }
  };

    var payload = {
        "intents": [],
        "entities": [],
        "input": {},
        "output": {
            "text": [],
            "nodes_visited": ["Bienvenido"],
            "log_messages": []
        },
        "context": {
            "conversation_id": "3943bf43-282c-4cb1-b878-ed562ed7bf6b",
            "system": {
                "dialog_stack": [{
                    "dialog_node": "root"
                }],
                "dialog_turn_counter": 1,
                "dialog_request_counter": 1,
                "_node_output_map": {
                    "Bienvenido": [0]
                },
                "branch_exited": true,
                "branch_exited_reason": "completed"
            },
            "clase": false,
            "tarea": false,
            "clases": false,
            "tareas": false,
            "proyecto": false,
            "proyectos": false
        }
    };

    var assigment = {
        info: undefined,
        dueDate: undefined
    };



  return {
    init: init,
    inputKeyDown: inputKeyDown
  };


  function init() {
    chatUpdateSetup();
    Api.sendRequest( '', null );
    setupInputBox();
  }

  function chatUpdateSetup() {
    var currentRequestPayloadSetter = Api.setRequestPayload;
    Api.setRequestPayload = function(newPayloadStr) {
      currentRequestPayloadSetter.call(Api, newPayloadStr);
      displayMessage(JSON.parse(newPayloadStr), settings.authorTypes.user);
    };

    var currentResponsePayloadSetter = Api.setResponsePayload;
    Api.setResponsePayload = function(newPayloadStr) {
      currentResponsePayloadSetter.call(Api, newPayloadStr);
      displayMessage(JSON.parse(newPayloadStr), settings.authorTypes.watson);
    };
  }


  function setupInputBox() {
    var input = document.getElementById('textInput');
    var dummy = document.getElementById('textInputDummy');
    var minFontSize = 14;
    var maxFontSize = 16;
    var minPadding = 4;
    var maxPadding = 6;


    if (dummy === null) {
      var dummyJson = {
        'tagName': 'div',
        'attributes': [{
          'name': 'id',
          'value': 'textInputDummy'
        }]
      };

      dummy = Common.buildDomElement(dummyJson);
      document.body.appendChild(dummy);
    }

    function adjustInput() {
      if (input.value === '') {

        input.classList.remove('underline');
        input.setAttribute('style', 'width:' + '100%');
        input.style.width = '100%';
      } else {

        input.classList.add('underline');
        var txtNode = document.createTextNode(input.value);
        ['font-size', 'font-style', 'font-weight', 'font-family', 'line-height',
          'text-transform', 'letter-spacing'].forEach(function(index) {
            dummy.style[index] = window.getComputedStyle(input, null).getPropertyValue(index);
          });
        dummy.textContent = txtNode.textContent;

        var padding = 0;
        var htmlElem = document.getElementsByTagName('html')[0];
        var currentFontSize = parseInt(window.getComputedStyle(htmlElem, null).getPropertyValue('font-size'), 10);
        if (currentFontSize) {
          padding = Math.floor((currentFontSize - minFontSize) / (maxFontSize - minFontSize)
            * (maxPadding - minPadding) + minPadding);
        } else {
          padding = maxPadding;
        }

        var widthValue = ( dummy.offsetWidth + padding) + 'px';
        input.setAttribute('style', 'width:' + widthValue);
        input.style.width = widthValue;
      }
    }


    input.addEventListener('input', adjustInput);
    window.addEventListener('resize', adjustInput);


    Common.fireEvent(input, 'input');
  }


  function displayMessage(newPayload, typeValue) {
    analyzePayload(newPayload, typeValue);
    var isUser = isUserMessage(typeValue);
    var textExists = (newPayload.input && newPayload.input.text)
      || (newPayload.output && newPayload.output.text);
    if (isUser !== null && textExists) {

      var messageDivs = buildMessageDomElements(newPayload, isUser);
      var chatBoxElement = document.querySelector(settings.selectors.chatBox);
      var previousLatest = chatBoxElement.querySelectorAll((isUser
              ? settings.selectors.fromUser : settings.selectors.fromWatson)
              + settings.selectors.latest);

      if (previousLatest) {
        Common.listForEach(previousLatest, function(element) {
          element.classList.remove('latest');
        });
      }

      messageDivs.forEach(function(currentDiv) {
        chatBoxElement.appendChild(currentDiv);

        currentDiv.classList.add('load');
      });

      scrollToChatBottom();
    }
  }


  function isUserMessage(typeValue) {
    if (typeValue === settings.authorTypes.user) {
      return true;
    } else if (typeValue === settings.authorTypes.watson) {
      return false;
    }
    return null;
  }

  function isNotUserMessage(typeValue) {
      return !isUserMessage(typeValue);
  }

  function buildMessageDomElements(newPayload, isUser) {
    var textArray = isUser ? newPayload.input.text : newPayload.output.text;
    if (Object.prototype.toString.call( textArray ) !== '[object Array]') {
      textArray = [textArray];
    }
    var messageArray = [];
    textArray.forEach(function(currentText) {
      if (currentText) {
        var messageJson = {
          'tagName': 'div',
          'classNames': ['segments'],
          'children': [{
            'tagName': 'div',
            'classNames': [(isUser ? 'from-user' : 'from-watson'), 'latest', ((messageArray.length === 0) ? 'top' : 'sub')],
            'children': [{
              'tagName': 'div',
              'classNames': ['message-inner'],
              'children': [{
                'tagName': 'p',
                'text': currentText
              }]
            }]
          }]
        };
        messageArray.push(Common.buildDomElement(messageJson));
      }
    });
    return messageArray;
  }



  function scrollToChatBottom() {
    var scrollingChat = document.querySelector('#scrollingChat');

    var scrollEl = scrollingChat.querySelector(settings.selectors.fromUser
            + settings.selectors.latest);
    if (scrollEl) {
      scrollingChat.scrollTop = scrollEl.offsetTop;
    }
  }

  function inputKeyDown(event, inputBox) {

    if (event.keyCode === 13 && inputBox.value) {

      var context;
      var latestResponse = Api.getResponsePayload();
      if (latestResponse) {
        context = latestResponse.context;
      }

      Api.sendRequest(inputBox.value, context);

      inputBox.value = '';
      Common.fireEvent(inputBox, 'input');
    }
  }

    function analyzePayload(payLoad, typeValue) {
        const conditions = payLoad.context;
        if(conditions.clase && isNotUserMessage(typeValue)) {
            getNextClass()
        }
        if(conditions.clases && isNotUserMessage(typeValue)){
          getNextClasses()
        }
        if(conditions.entregas && isNotUserMessage(typeValue)){
          getPendingAssigments();
        }
        if(conditions.info && isNotUserMessage(typeValue)){

          assigment.info = payLoad.input.text
        }
        if(conditions.fecha && isNotUserMessage(typeValue)){

          assigment.dueDate = payLoad.input.text;
            postNewAssigment()
        }
    };

    function getNextClass() {

        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "https://school-smart-assistant.mybluemix.net/user/class",
            "method": "GET",
            "headers": {
                "Cache-Control": "no-cache",
                "Postman-Token": "1df7431d-45c6-4504-bbdb-78685544b950"
            }
        };

        $.ajax(settings).done(function (response) {
          payload.output.text = [response];
          displayMessage(payload, 'watson');

        });

    }

    function getNextClasses() {
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "https://school-smart-assistant.mybluemix.net/user/classes",
            "method": "GET",
            "headers": {
                "Cache-Control": "no-cache",
                "Postman-Token": "7d46d15c-2c49-49b1-8c53-e7e90db8cdaf"
            }
        };

        $.ajax(settings).done(function (response) {
            if(response.length === 0){
              payload.output.text = ['No tienes ningun pendiente!!!'];
                displayMessage(payload, 'watson');
            }
            var classesList = '<ul>';
            for(var counter = 0; counter < response.length; counter++){
              const actualElement = response[counter];
              classesList += '<li>' + actualElement.name + '<br>' + actualElement.starts + ' - ' + actualElement.ends +
                              ' hrs' + '<br>' + actualElement.classRoom + '</li><br>';
            }
            classesList += '</ul>';

            payload.output.text = [classesList];
            displayMessage(payload, 'watson');
        });
    }

    function getPendingAssigments() {
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "https://school-smart-assistant.mybluemix.net/user/assigments",
            "method": "GET",
            "headers": {
                "Cache-Control": "no-cache",
                "Postman-Token": "336a597f-6249-431f-9b74-cbc96737556f"
            }
        };

        $.ajax(settings).done(function (response) {
          response = response.map((assigment) => {
            assigment.dueDate = assigment.dueDate.split('/').reverse().join('/');
            return assigment
          });

          var assigments = '<ul>';
          for(var counter = 0; counter < response.length; counter++){
            const actualElement = response[counter];
            assigments += '<li>' + actualElement.dueDate + '  -  ' + actualElement.info + '</li><br>';
          }
          assigments += '</ul>';

            payload.output.text = [assigments];
            displayMessage(payload, 'watson');
        });
    }

    function postNewAssigment(){

        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "https://school-smart-assistant.mybluemix.net/user/assigment",
            "method": "POST",
            "headers": {
                "Content-Type": "application/json",
                "Cache-Control": "no-cache",
                "Postman-Token": "c5060c32-f083-478c-ab68-adc090fd8a3c"
            },
            "processData": false,
            "data": JSON.stringify(assigment)
        };

        $.ajax(settings).done(function (response) {
            console.log('Assigment correctly added.');
        });

        assigment.info = undefined;
        assigment.dueDate = undefined;
    }

}());
