
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

//entry list
  $scope.entries = [];
  EntryFactory.getAll().success(function(data) {
    $scope.entries = data.results;
    $scope.entries.forEach(function(entry) {
      entry.appends = [];
      entry.Date = Date.parse(entry.Date.iso);
      //query.ascending("createdAt");

    });
  });
  $scope.append = function(entry){
    entry.extra = true;
    console.log("green");
  };
  $scope.submitAppend = function(entry){
    console.log("red",entry);
  };


}]);
