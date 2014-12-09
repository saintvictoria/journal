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
              console.log(user);
              var parameters = 'username='+user.username+'&password='+user.password;
              $http.get('https://api.parse.com/1/login/?'+parameters, PARSE_HEADERS)
              .success(function(data){
                 var user1 = $cookieStore.put('currentUser', data);
                 console.log(user1);
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
