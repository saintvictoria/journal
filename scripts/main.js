/* global angular */
angular.module ('journal',
  ['ngRoute', 'ngCookies', 'ngSanitize', 'angularFileUpload', 'mm.foundation'])
  .constant('PARSE_HEADERS', {
    headers: {
      'X-Parse-Application-Id':'IWbER00hd2pgcj7vTr9JltVyZkxOIFlVlXvJILkw',
      'X-Parse-REST-API-Key': 'Bf1DLpWdq9Bb4o02q1Vi4j2eBovTBLhvz6mUB3tJ',
      'Content-Type': 'application/json'
    }
  })
  .constant('PARSE_URI','https://api.parse.com/1')



  .config(['$routeProvider',
  function ($routeProvider){

    $routeProvider
    .when('/', {
      templateUrl: 'users-login.html',
      controller: 'LoginController'
    })
    .when('/register', {
      templateUrl: 'register-user.html',
      controller: 'LoginController'
      })
    .when('/forgot', {
      templateUrl: 'forgot-password.html',
      //controller: 'ForgotPassword'
      controller: function(){

      }
    })
    .when('/welcome', {
      templateUrl: 'welcome-view.html',
      // controller: 'WelcomeViewController'
      controller: 'EntryController'
    })
    .when('/newEntry', {
      templateUrl: 'new-entry.html',
      controller: 'EntryController'
    })
    .when('/entries', {
      templateUrl: 'entry-list.html',
      controller: 'EntryController'
    })

    .otherwise({
      templateUrl: '404.html',
      controller: function (){}
    });



  }])
  .directive('fileapi', ['$parse',function ($parse) {
    var linker = function (scope, element, attrs) {
      var destination = attrs.fileapi;
      element.bind('change', function (event) {
        var setter = $parse(destination).assign;
        var files = event.target.files;
        setter(scope, files[0]);
      });
      scope.$watch(destination, function(newval) {
        if (!newval) {
          element.val(null);
        }

      });
    };
    return {
      restrict: 'A',
      link: linker
    };
  }])
  .directive('quill', ['$parse', function ($parse) {
    var linker = function(scope, element, attrs) {
      /* global Quill */
      var dest, editorDiv, existing, getter, setter;
      dest = attrs.quillModel;
      editorDiv = element.find('.the-editor');
      if (! editorDiv) {
        throw 'Unable to find .the-editor';
      }
      if (dest) {
        getter = $parse(dest);
        setter = getter.assign;
        existing = getter(scope);
      }
      if (existing) {
        editorDiv.first().innerHTML = existing;
      }
      var quill = new Quill(editorDiv[0], {'theme': 'snow'});
      if (setter) {
        quill.on('text-change', function () {
          var htm = quill.getHTML();
          setter(scope, htm);
        });
      }
      var tb = element.parent().find('.ql-toolbar');
      if (tb) {
        quill.addModule('toolbar', {
          container: tb[0]
        });
      }
    };
    return {
      restrict: 'E',
      link: linker,
      templateUrl: 'scripts/entry/quill.html'
    };
  }])
  ;

angular.module('journal')
.factory('EntryFactory',
['PARSE_HEADERS','PARSE_URI','$http', '$upload',
function(PARSE_HEADERS,PARSE_URI,$http, $upload) {

  /**
  @param {Object} object An Entry or Addendum.
  @param {String} classname the Parse class to save
  @param {?function(string)} callback given the objectId after successful save
  */
  var save = function(object, classname, callback) {
    /* globals FileReader */
    "use strict";
    var config = {

      headers: PARSE_HEADERS.headers
    };
    /* this gives back the location header which contains the URL to the entry
    the object that is sent back gives a
    {string} createdAt, and the {string} objectI
    */
    var picture = object.Picture;
    delete object.Picture;
    var promise = $http.post(PARSE_URI+'/classes/'+classname, object, config);
    promise.success(function(data) {
      var oId = data.objectId;

      if (!picture) {
        if (callback) {
          callback(data.objectId);
        }
        return;
      }
      var fileReader = new FileReader();
      fileReader.readAsArrayBuffer(picture);
      fileReader.onload = function(e) {
        var headers = angular.copy(PARSE_HEADERS.headers);
        headers['Content-Type'] =  picture.type;
        var safeName = picture.name.replace(/[^A-Za-z_0-9\.]/g, '');
        var uploadConfig = {
          'url': PARSE_URI + '/files/' + safeName,
          'data': e.target.result,
          'headers': headers
        };
        var uploadPromise = $upload.http(uploadConfig);
        uploadPromise.success(function(data) {
          var fileData = {
            'Picture': {
              '__type': "File",
              'name': data.name
            }
          };
          var url = PARSE_URI+'/classes/' + classname + '/' + oId;
          var attachPromise =$http.put(url, fileData, config);
          attachPromise.success(function(data) {
            if (callback) {
              callback(data.objectId);
            }
          });
        });
      };
    });
  };
  /**

  */

  /**
  */
  var append = function() {

  };

  var entryList = function() {

    var config = {
      headers: PARSE_HEADERS.headers
    };

    //noinspection UnnecessaryLocalVariableJS
    var promise = $http.get(PARSE_URI+'/classes/Entry', config);
    return promise;
  };

  var addendumList = function () {

    var config = {
      headers: PARSE_HEADERS.headers
    };

    //noinspection UnnecessaryLocalVariableJS
    var promise = $http.get(PARSE_URI+'/classes/Addendum', config);
    return promise;
  };

   return {
     save: save,
     getAll: entryList,
     append: append,
     getAddendums: addendumList
   };

 }]);

angular.module('journal')
.controller('EntryController',
['$scope', '$location', 'EntryFactory','QuestionFactory', '$cookieStore', '$sce',
function($scope, $location,  EntryFactory, QuestionFactory, $cookieStore,  $sce){
/* global Date */

//probaly need a welcome controller
//for next two functions
  $scope.user = $cookieStore.get('currentUser');
  $scope.newEntry = function(){
    $location.path('/newEntry')
  };
  $scope.entriesView =function (){
    $location.path('/entries')
  };


  $scope.date = new Date();
  $scope.question = '';
  $scope.heading = '';
  $scope.body = '';
  var ranQuestion = function() {
    QuestionFactory.questionRandom()
    .success(function(data) {
      var qNumber =  Math.floor(Math.random() * (data.results.length));
      $scope.question = data.results[qNumber].question;

    });
  };
  ranQuestion();

  $scope.do_over = function() {
    ranQuestion();
  };

  $scope.submit = function() {
    var completeEntry = {
      'Date': {
        'iso': $scope.date,
        '__type': 'Date'
      },
      'Heading': $scope.heading,
      'QuestionText': $scope.question,
      'Body': $scope.body,
      'Picture': $scope.picture
    };
    EntryFactory.save(completeEntry, 'Entry', function() {
      $location.path('/entries')

    });
  };

//entry list
  $scope.entries = [];
  EntryFactory.getAll().success(function(data) {
    $scope.entries = data.results;
    $scope.entries.forEach(function(entry) {
      entry.Body = $sce.trustAsHtml(entry.Body);
      entry.Date = Date.parse(entry.Date.iso);
    });
  });

  // get the addendums too!
  $scope.addendums = [];
  var fetchAddendums = function() {
  EntryFactory.getAddendums().success(function(data) {
    $scope.addendums = data.results;
    $scope.addendums.forEach(function(addendum) {
      addendum.Body = $sce.trustAsHtml(addendum.Body);
      addendum.Date = Date.parse(addendum.Date.iso);
    });
  });
  };
  fetchAddendums();
  $scope.append = function(entry){
    entry.extra = !entry.extra;
  };
  $scope.addendumsForEntry = function (entry) {
    /* global _ */
    return _.filter($scope.addendums, function (it) { return it.Post.objectId === entry.objectId; });
  };

  $scope.submitAppend = function(entry){
    var completeAddendum = {
      'Date': {
        'iso': $scope.date,
        '__type': 'Date'
      },
      'Body': entry.appendBody,
      'Picture': entry.picture,
      'Post': {
        '__type': 'Pointer',
        'className': 'Entry',
        'objectId': entry.objectId
      }
    };
    EntryFactory.save(completeAddendum, 'Addendum', function() {
      entry.extra = false;
      entry.appendBody = '';
      entry.picture = null;
      fetchAddendums();
    });
  };


}]);

(function () {

  angular.module('journal')
  .controller('LoginController', ['UserFactory','$scope','$location', '$cookieStore',
              function (UserFactory,  $scope, $location, $cookieStore) {

    $scope.submitUser = function (user) {
      console.log('hey we got a thing',  user);
      UserFactory.submitUser(user);
    };

    $scope.register = function () {
      $location.path('/register')
    };

    $scope.login = function (user) {
      UserFactory.login(user);
    };

    $scope.forgot = function() {
      $location.path('/forgot')
    };

    $scope.logout = function () {
      UserFactory.logout();
    };

    $scope.welcome = function () {
      $location.path('/welcome')
    };

    $scope.newEntry = function () {
      $location.path('/newEntry')
    };



    //UserFactory.checkUser();

  }
  ]);

}());

(function (){
  angular.module('journal')
  .factory('UserFactory',
  ['PARSE_HEADERS','PARSE_URI','$http','$location','$cookieStore',
  function(PARSE_HEADERS,  PARSE_URI,  $http,  $location , $cookieStore) {

            var submitUser = function(user) {
              console.log(user);
               $http.post('https://api.parse.com/1/users', user, PARSE_HEADERS)
               .success(function(data){
                 $cookieStore.put('currentUser', data);
                 $location.path('/welcome');
               });

            };

            var register = function(user) {

            }

            var login = function(user) {
              var parameters = 'username='+user.username+'&password='+user.password;
              $http.get('https://api.parse.com/1/login/?'+parameters, PARSE_HEADERS)
              .success(function(data){
                 var user1 = $cookieStore.put('currentUser', data);
                 $location.path('/welcome');
              });

            };

            var logout =function(user) {
              $cookiestore.remove('currentUser');
              return checkUser();
            };

            var checkUser = function(user) {
              var user = $cookieStore.get('currentUser');
              if (user) {
                //$location.path('/list');
                $('#user').html('Hello '+user.name);
              } else{
                $('#user').html('Please login');
                $location.path('/');
              }
            };

            return {
              submitUser: submitUser,
              register: register,
              login: login,
              logout: logout,
              checkUser:checkUser

            }
         }

     ]);


}());

(function () {
  angular.module('journal')
  .factory('QuestionFactory',
  ['PARSE_HEADERS','PARSE_URI','$http',
  function(PARSE_HEADERS,PARSE_URI,$http) {

    /**

    */
    var randomQuestion = function() {
      var config = {
        
        headers: PARSE_HEADERS.headers
      };
      return $http.get(PARSE_URI+'/classes/Question', config);




    };

    /**
    @param {String} qDate question based on the string using year, month and day.
    */
    var dateQuestion = function(qDate) {
      var config = {

        params: {
          where: {eligible_day: qDate}
        },
        headers: PARSE_HEADERS.headers
      }
      return $http.get(PARSE_URI+'/classes/Question', config);

    };

    /**
    @param {Number} qAge question based on age of the user.
    @return always returns a random question based on the user's age.
    */
    var ageQuestion = function(qAge) {
      throw 'nope';
      var config = {
          params: {
            where: {eligible_day: '2014-12-06'}
          },
          headers: PARSE_HEADERS.headers
      }
      return $http.get(PARSE_URI+'/Question', config);


    };


    return {
      questionRandom: randomQuestion,
      questionByDate: dateQuestion,
      questionByAge: ageQuestion
    }

  }])


}());
