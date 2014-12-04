(function (){
  angular.module('journal')
  .factory('UserFactory',
  ['PARSE_HEADERS','PARSE_URI','$http','$location','$cookieStore',
  function(PARSE_HEADERS,  PARSE_URI,  $http,  $location,  $cookieStore) {

            var register = function(User) {
               $http.post('https://api.parse.com/1/users', user, PARSE_HEADERS)
               .success(function(){
                 $location.path('/welcome');

               });

            };

            var login = function(user) {
              var parameters = 'username='+user.name+'&password='+user.password;
              $http.get('https://api.parse.com/1/login/?'+parameters, PARSE_HEADERS)
              .success(function(data){
                $cookieStore.put('currentUser', data);
                return checkUser();

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
              register: register,
              login: login,
              logout: logout,
              checkUser:checkUser

            }
         }

     ]);


}());
