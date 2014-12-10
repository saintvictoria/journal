(function () {
  angular.module('journal')
  .factory('QuestionFactory',
  ['PARSE_HEADERS','PARSE_URI','$http',
  function(PARSE_HEADERS,PARSE_URI,$http) {

    /**

    */
    var randomQuestion = function() {
      var config = {
        
        headers: PARSE_HEADERS.headers
      };
      return $http.get(PARSE_URI+'/classes/Question', config);




    };

    /**
    @param {String} qDate question based on the string using year, month and day.
    */
    var dateQuestion = function(qDate) {
      var config = {

        params: {
          where: {eligible_day: qDate}
        },
        headers: PARSE_HEADERS.headers
      }
      return $http.get(PARSE_URI+'/classes/Question', config);

    };

    /**
    @param {Number} qAge question based on age of the user.
    @return always returns a random question based on the user's age.
    */
    var ageQuestion = function(qAge) {
      throw 'nope';
      var config = {
          params: {
            where: {eligible_day: '2014-12-06'}
          },
          headers: PARSE_HEADERS.headers
      }
      return $http.get(PARSE_URI+'/Question', config);


    };


    return {
      questionRandom: randomQuestion,
      questionByDate: dateQuestion,
      questionByAge: ageQuestion
    }

  }])


}());
