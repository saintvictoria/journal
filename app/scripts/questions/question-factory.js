(function () {
  angular.module('journal')
  .factory('QuestionFactory',
  ['PARSE_HEADERS','PARSE_URI','$http',
  function(PARSE_HEADERS,PARSE_URI,$http) {

    /**
    @param {Number} qId
    */
    var question = function(qId) {



    };

    /**
    @param {Date} qDate question based on the date using year, month and day.
    */
    var dateQuestion = function(qDate) {
      var config = {

        params: {
          where: {eligible_day: 'today'}
        },
        headers: PARSE_HEADERS.headers
      }
      var promiseQuestion = $http.get(PARSE_URI+'/classes/Question', config);
      /*
      var x = promiseQuestion.then(function(response){
        if (200 !== response.status) {
          console.error("bad", response);
          return null
        }
        var results = response.data.results;
        if (results && 0 !== results.length) {
          return results[0]
        } else{
          return null
        }
      });
      return x
*/
      return promiseQuestion
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
      questionById: question,
      questionByDate: dateQuestion,
      questionByAge: ageQuestion
    }

  }])


}());
