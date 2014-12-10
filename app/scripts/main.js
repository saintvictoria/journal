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
