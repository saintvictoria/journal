(function (){
  angular.module ('journal',['ngRoute','ngCookies'])
  .constant('PARSE_HEADERS', {
    headers: {
      'X-Parse-Application-Id':'IWbER00hd2pgcj7vTr9JltVyZkxOIFlVlXvJILkw',
      'X-Parse-REST-API-Key': 'Bf1DLpWdq9Bb4o02q1Vi4j2eBovTBLhvz6mUB3tJ',
      'Content-Type': 'application/json'
    }
  })

  .constant('PARSE_URI','https://api.parse.com/1/classes')



  .config(['$routeProvider',
  function ($routeProvider){

    $routeProvider
    .when('/', {
      templateUrl: 'users-login.html',
      controller: 'LoginController'
    })
    .when('/register', {
      templateUrl: 'register-user.html',
    //  controller: 'RegisterController'
    controller: function (){}
    })
    .when('/entry', {
      templateUrl: 'new-entry.html',
      //  controller: 'NewEntryController'
      controller: function (){
        this.entryDate = new Date();
        this.heading = '';
        this.body = '';
        this.picture = null;
      }
    })
    .otherwise({
      templateUrl: '404.html',
      controller: function (){}
    })


  }]);








}());
