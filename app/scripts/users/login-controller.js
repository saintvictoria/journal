(function () {

  angular.module('journal')
  .controller('LoginController', ['UserFactory','$scope','$location', '$cookieStore',
              function (UserFactory,  $scope, $location, $cookieStore) {

    $scope.submitUser = function (user) {
      console.log('hey we got a thing' + user);
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
