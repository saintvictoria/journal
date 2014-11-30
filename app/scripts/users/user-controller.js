(function () {

  angular.module('journal')
  .controller('User', ['UserFactory','$scope',
              function (UserFactory,  $scope) {

    $scope.addUser = function (user) {
      UserFactory.register(user);
    };

    $scope.login = function (user) {
      UserFactory.login(user);
    };

    $scope.logout = function () {
      UserFactory.logout();
    };
    
    UserFactory.checkUser();

  }
  ]);

}());
