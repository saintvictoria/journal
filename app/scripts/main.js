(function (){

  angular.module ('journal',['ngRoute','angularFileUpload'])
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
    //  controller: 'RegisterController"
      controller: function ($scope, $location) {
        $scope.register = function(){
          $location.path('/welcome')
        };

      }
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
      controller: function($scope, $location){
        $scope.newEntry = function(){
          $location.path('/newEntry')
        };
        $scope.user = {'name':'Jim'};
        $scope.entriesView =function (){
          $location.path('/entries')
        };

      }
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
  .directive('fileapi', function () {
    var linker = function (scope, element, attrs) {
      element.bind('change', function (event) {
        var files = event.target.files;
        scope.image = files[0];
        //element.val(null);  // clear input
      });
    };
    return {
      restrict: 'A',
      link: linker
    };
  });


}());
