(function () {

  angular.module('journal')
  .controller('LoginController', ['UserFactory','$scope','$location',
              function (UserFactory,  $scope, $location) {

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



    UserFactory.checkUser();

  }
  ]);

}());
