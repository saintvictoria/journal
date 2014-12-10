(function (){

  angular.module ('journal',['ngRoute','angularFileUpload', 'ngCookies','mm.foundation'])
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
      var destination = attrs['fileapi'];
      element.bind('change', function (event) {
        var setter = $parse(destination).assign;
        var files = event.target.files;
        setter(scope, files[0]);
      });
      scope.$watch(destination, function(newval, oldval) {
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
  .directive('quill2', ['$timeout',function ($timeout) {
    var linker = function (scope, element, attrs) {
      var quillId = 'quill'+Math.floor(Math.random()*1000);
      //var formatGroup = ['bold','italic', 'underline'];

      var editorDiv = angular.element('<div>' +
      //'<div id="' + quillId + '-t"></div>' +
      '<div id="' + quillId + '-e"></div>' +
      '</div>');
      element.append(editorDiv);
      $timeout(function() {

      var quill = new Quill(editorDiv[0] );//'#' + quillId + '-e');
      var tb = element.parent().find('.ql-toolbar');
      tb.attr('id',quillId + '-t');
      quill.addModule('toolbar', {
         //container: '#' + quillId +'-t'
         container: tb[0]
       });
     },500);

    };
    return {
      restrict: 'A',
      link: linker
    };
  }])
  .directive('quill', ['$parse',function ($parse) {
    return {
      restrict: 'E',
      templateUrl: 'scripts/entry/quill.html'
    };
  }])
  ;


}());
