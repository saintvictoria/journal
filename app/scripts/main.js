(function (){
  Parse.initialize("IWbER00hd2pgcj7vTr9JltVyZkxOIFlVlXvJILkw",
    "ZeSpqSXsigsmYIzsmIjLIKAxwThxUx4dQjmQ1uCr");

  angular.module ('journal',['ngRoute','ngCookies'])
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
      //  controller: 'NewEntryController'
      controller: function ($scope, $location, QuestionFactory) {
        $scope.date = new Date();
        $scope.question = '';
        QuestionFactory.questionByDate($scope.date)
        .success(function(data) {
          $scope.question = data.results[0].question;

        });
        $scope.heading = '';
        $scope.body = '';
        $scope.picture = null;
      }
    })
    .when('/entries', {
      templateUrl: 'entry-list.html',
      //controller: 'ForgotPassword'
      controller: function($scope, $location) {
        $scope.entries =[
        {
          'heading': 'hello',
          'body': 'js is hard',
          'appends':[
          {
            'date':'sunday',
            'body':'yellow'

          },
          {
            'date':'friday',
            'body':'red'

          }
          ]
        },
        {
          'heading': 'hello 1',
          'body': 'js is hard',
          'appends':[]
        }
        ];
        $scope.append = function(entry){
          entry.extra = true;
          console.log("green");
        };
        $scope.submitAppend = function(entry){
          console.log("red",entry);
        };

      }
    })
    .otherwise({
      templateUrl: '404.html',
      controller: function (){}
    })


  }]);








}());
