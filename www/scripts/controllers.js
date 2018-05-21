angular.module('starter.controllers', [])

.controller('LoginCtrl', function($scope, $ionicPlatform, $ionicLoading, $state, LoginService) {
  $scope.loginactions = {
    login: function(){
      $ionicLoading.show({
        template:'<ion-spinner icon="lines"></ion-spinner>'
      });
      LoginService.login($scope.loginactions.username).then(
        function(results) {
          console.log(results);
          if(results.userName){
            $scope.loginactions.users = results;
            $state.go('chat');
          } else{
            alert('Invalid User')
          }
          $ionicLoading.hide();
        },
        function(error) {
          alert('Error');
          $ionicLoading.hide();
        }
      );

    },
    users:{},
    username: '',
    password: '',
  }
})
.controller('ChatCtrl', function($scope, $ionicPlatform, $ionicLoading, UserValue, NLPService, $state) {
  var chatDetails = {
    userInput: '',
    description: '',
    action: '',
    payload: [],
    type: 'Plain'
  }
  $scope.chats = {
    defaultText: 'Hello '+UserValue.userName+', how can I help you?',
    txtChat: '',
    listening: false,
    chatInfo: [],
    logout: function() {
      alert('Logout');
      UserValue.userName = '';
      UserValue.userID = '';
      $state.go('login');
    },
    getResponse: function(queryText) {
      var text;
      if(queryText){
        text = queryText;
      }else{
        text = $scope.chats.txtChat;
      }
      $ionicLoading.show({
        template:'<ion-spinner icon="lines"></ion-spinner>'
      });
      $ionicPlatform.ready(function() {
          try {
            NLPService.dfTextRequest($scope.chats.txtChat).then(
                function (response) {
                  console.log('text Response', response);
                    var responseData = response.data.result;
                    var webhookPayload = responseData.fulfillment.data;

                    chatDetails.userInput = responseData.resolvedQuery;
                    chatDetails.description = responseData.fulfillment.messages[0].speech;
                    if(responseData.action === 'orgbot.deploy' &&  !responseData.actionIncomplete && !UserValue.deployPermission){
                      chatDetails.description = 'You do not have the permission to deploy the application, Please contact your administrator'
                    }
                    else if(webhookPayload){
                      chatDetails.action = responseData.action;
                      chatDetails.type = webhookPayload.displaytype;
                      chatDetails.payload = webhookPayload.data;
                      chatDetails.description = webhookPayload.message;
                    }

                    $scope.chats.chatInfo.push(chatDetails);
                    speakResponse(chatDetails.description);
                    clearChatInfo();
                    $ionicLoading.hide();
                    //$scope.$apply();
                },
                function (error) {
                  // place your error processing here
                  chatDetails.userInput = $scope.chats.txtChat;
                  chatDetails.description = 'Sorry, I couldn\'t get you';

                  $scope.chats.chatInfo.push(chatDetails);
                  speakResponse(chatDetails.description);
                  clearChatInfo();
                  $ionicLoading.hide();
                  //$scope.$apply();

              });
      } catch (e) {
        chatDetails.userInput = $scope.chats.txtChat;
        chatDetails.description = 'Something went wrong';

        $scope.chats.chatInfo.push(chatDetails);
        speakResponse(chatDetails.description);
        clearChatInfo();
        $ionicLoading.hide();
        //$scope.$apply();

      }
    });
    }
  }

  function speakResponse(text){
    if(ionic.Platform.isIOS() || ionic.Platform.isAndroid()){
        $ionicPlatform.ready(function() {
          try {
            TTS.speak(text, function () {
                      //alert('success');
                  }, function (reason) {
                      //alert(reason);
                  });
            } catch (e) {
                  alert(e);
            }
        });
    }
  }
function clearChatInfo() {

  $scope.chats.txtChat = '';
  chatDetails = {
    userInput: '',
    action: '',
    description: '',
    payload: [],
    type: 'Plain'
  }
}

function init() {
  speakResponse($scope.chats.defaultText);
}
  $ionicPlatform.ready(function() {
      init();
  });


})

/*.controller('ChatsCtrl', function($scope, $ionicPlatform, $ionicLoading) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  var chatInformation = {
    userInput: '',
    description: '',
    url:'',
    fileType:'',
    name:'',
    action:'',
    tickets: [],
    ticketDetails:{

    }
  }
  $scope.chat = {
    defaultText: 'Hello Suresh, how can I help you?',
    txtChat: '',
    listening: false,
    chatInfo: [],
    getResponse: function(queryText) {
      var text;
      if(queryText){
        text = queryText;
      }else{
        text = $scope.chat.txtChat;
      }


      $ionicLoading.show({
        template:'<ion-spinner icon="lines"></ion-spinner>'
      });
      $ionicPlatform.ready(function() {
          try {
            ApiAIPlugin.requestText(
                {
                    query: text
                },
                function (response) {
                    // place your result processing here
                    //alert(JSON.stringify(response));
                    console.log('text Response', response);
                    var responseData = response.result;
                    chatInformation.userInput = responseData.resolvedQuery;
                    chatInformation.description = responseData.fulfillment.speech;

                    /*if(responseData.fulfillment.data){
                      chatInformation.action = 'final';
                      chatInformation.name = 'Please find your details here...';
                      chatInformation.description = responseData.fulfillment.data.text;
                      if(responseData.fulfillment.data.url){
                        chatInformation.url = responseData.fulfillment.data.url
                      }
                      if(responseData.fulfillment.data.filetype){
                        chatInformation.filetype = responseData.fulfillment.data.filetype;
                      }
                    }
                    if(responseData.fulfillment.messages[1].payload){
                      if(responseData.fulfillment.messages[1].payload.tickets){
                        chatInformation.tickets = responseData.fulfillment.messages[1].payload.tickets;
                      }else{
                        chatInformation.ticketDetails = responseData.fulfillment.messages[1].payload
                      }
                    }

                    $scope.chat.chatInfo.push(chatInformation);
                    speakResponse(chatInformation.description);
                    clearChatInfo();
                    $ionicLoading.hide();
                    $scope.$apply();

                },
                function (error) {
                    // place your error processing here
                    chatInformation.userInput = $scope.chat.txtChat;
                    chatInformation.description = 'Sorry, I couldn\'t get you';

                    $scope.chat.chatInfo.push(chatInformation);
                    speakResponse(chatInformation.description);
                    clearChatInfo();
                    $ionicLoading.hide();
                    $scope.$apply();

                });
        } catch (e) {
          $ionicLoading.hide();
            alert(e);
        }
      });

    },
    sendVoice: function() {
        $ionicLoading.show({
          template:'<ion-spinner icon="lines"></ion-spinner><br>You can speak to me!.......'
        });
          $ionicPlatform.ready(function() {
          try {

              ApiAIPlugin.requestVoice(
                {}, // empty for simple requests, some optional parameters can be here
                function (response) {
                  console.log('Voice Response', response);
                  var responseData = response.result;
                  chatInformation.userInput = responseData.resolvedQuery;
                  chatInformation.description = responseData.fulfillment.speech;

                  /*if(responseData.fulfillment.data){
                    chatInformation.action = 'final';
                    chatInformation.name = 'Please find your details here...';
                    chatInformation.description = responseData.fulfillment.data.text;
                    if(responseData.fulfillment.data.url){
                      chatInformation.url = responseData.fulfillment.data.url
                    }
                    if(responseData.fulfillment.data.filetype){
                      chatInformation.filetype = responseData.fulfillment.data.filetype;
                    }
                  }
                  if(responseData.fulfillment.messages[1].payload){
                    if(responseData.fulfillment.messages[1].payload.tickets){
                      chatInformation.tickets = responseData.fulfillment.messages[1].payload.tickets;
                    }else{
                      chatInformation.ticketDetails = responseData.fulfillment.messages[1].payload
                    }
                  }

                  $scope.chat.chatInfo.push(chatInformation);
                  speakResponse(chatInformation.description);
                  clearChatInfo();
                  $scope.$apply();
                },
                function (error) {
                  console.log('Voice Error', error);
                  //chatInformation.userInput = $scope.chat.txtChat;
                  chatInformation.description = 'Sorry, I couldn\'t get you';

                  $scope.chat.chatInfo.push(chatInformation);
                  speakResponse(chatInformation.description);
                  clearChatInfo();
                  $scope.$apply();
                });
        } catch (e) {
          $ionicLoading.hide();
            alert(e);
        }
      });
    }
  }
function speakResponse(text){
  $ionicPlatform.ready(function() {
    try {
      TTS.speak(text, function () {
                //alert('success');
            }, function (reason) {
                //alert(reason);
            });
      } catch (e) {
              alert(e);
      }
    });
}

function addChatData(data){
    chatInformation.userInput = data.resolvedQuery;
    chatInformation.description = data.fulfillment.speech;

    $scope.chat.chatInfo.push(chatInformation);
    clearChatInfo();
}
function addChatErrorData(data){
    chatInformation.userInput = $scope.chat.txtChat;
    chatInformation.description = 'Sorry, I couldn\'t get you';

    $scope.chat.chatInfo.push(chatInformation);
    clearChatInfo();
}

function clearChatInfo() {

  $scope.chat.txtChat = '';
  chatDetails = {
    userInput: '',
    description: '',
    payload: [],
    type: 'Plain'
  }
}

function init() {
  speakResponse($scope.chat.defaultText);
}
  $ionicPlatform.ready(function() {
      init();
  });
});*/
