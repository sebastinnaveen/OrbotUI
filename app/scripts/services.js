'use strict';


angular.module('starter.services', [])
  .factory('NLPService', function (UserValue, $q, $http) {


    return {
      dfTextRequest: function (text) {
        var deferred = $q.defer();
        var url = 'https://orgbot-abb9b.appspot.com/orgbot/nlp';
        //var url = 'http://localhost:5001/orgbot/nlp';
        var textRequest = {
         "text": text,
         "sessionId": UserValue.userID
        }
        var config = {
          headers: {
            'Content-Type': 'application/json'
          }
        }
        $http.post(url, textRequest, config).then(
          function (result) {
            console.log(result.data);
            if(result.data.success){
              deferred.resolve(result.data);
            }else{
              deferred.reject('Error');
            }
          },
          function () {
            deferred.reject('Error');
          }
        );

        return deferred.promise;
      }
    }
  })
  .factory('LoginService', function (UserValue, $q, $http) {
    function setUser(data) {
      UserValue.userName = data.username;
      UserValue.userID = data.userid;
      UserValue.deployPermission = data.deployperm;
    }
    return {
      login: function (userName) {
        var deferred = $q.defer();
        var url = 'https://orgbot-abb9b.appspot.com/orgbot/login';
        var userdata = {
          "users": {
            "username": userName
          }
        }
        var config = {
          headers: {
            'Content-Type': 'application/json'
          }
        }
        $http.post(url, userdata, config).then(
          function (result) {
            console.log(result);
            if (result.data.length > 0) {
              setUser(result.data[0]);
            }
            console.log(UserValue);

            deferred.resolve(UserValue);
          },
          function () {
            deferred.reject('Error');
          }
        );



        return deferred.promise;
      },
      getUserDetails: function () {
        return UserValue;
      }
    };
  })
  .factory('Chats', function () {
    // Might use a resource here that returns a JSON array

    // Some fake testing data
    var chats = [{
      id: 0,
      name: 'Ben Sparrow',
      lastText: 'You on your way?',
      face: 'img/ben.png'
    }, {
      id: 1,
      name: 'Max Lynx',
      lastText: 'Hey, it\'s me',
      face: 'img/max.png'
    }, {
      id: 2,
      name: 'Adam Bradleyson',
      lastText: 'I should buy a boat',
      face: 'img/adam.jpg'
    }, {
      id: 3,
      name: 'Perry Governor',
      lastText: 'Look at my mukluks!',
      face: 'img/perry.png'
    }, {
      id: 4,
      name: 'Mike Harrington',
      lastText: 'This is wicked good ice cream.',
      face: 'img/mike.png'
    }];

    return {
      all: function () {
        return chats;
      },
      remove: function (chat) {
        chats.splice(chats.indexOf(chat), 1);
      },
      get: function (chatId) {
        for (var i = 0; i < chats.length; i++) {
          if (chats[i].id === parseInt(chatId)) {
            return chats[i];
          }
        }
        return null;
      }
    };
  });
