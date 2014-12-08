
angular.module('journal')
.controller('EntryController',
['$scope', '$location', 'EntryFactory','QuestionFactory',
function($scope, $location,  EntryFactory, QuestionFactory) {

  $scope.date = new Date();
  $scope.question = '';
  QuestionFactory.questionByDate('today')
  .success(function(data) {
    $scope.question = data.results[0].question;

  });

  $scope.heading = '';
  $scope.body = '';
  $scope.image = null;
  $scope.submit = function() {
    var completeEntry = {
      'Date': {
        'iso': $scope.date,
        '__type': 'Date'
      },
      'Heading': $scope.heading,
      'QuestionText': $scope.question,
      'Body': $scope.body,
      'Picture': $scope.image
    };
    EntryFactory.save(completeEntry);
  };
}




]);
