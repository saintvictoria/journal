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
  $scope.submit = function() {
    var completeEntry = {
      'Date': {
        'iso': $scope.date,
        '__type': 'Date'
      },
      'Heading': $scope.heading,
      'QuestionText': $scope.question,
      'Body': $scope.body,
      'Picture': $scope.picture
    };
    EntryFactory.save(completeEntry, 'Entry', function() {
      $location.path('/entries')

    });
  };

//entry list
  $scope.entries = [];
  EntryFactory.getAll().success(function(data) {
    $scope.entries = data.results;
    $scope.entries.forEach(function(entry) {
      entry.appends = [];
      entry.Date = Date.parse(entry.Date.iso);
    });
  });

  // get the addendums too!
  $scope.addendums = [];
  var fetchAddendums = function() {
  EntryFactory.getAddendums().success(function(data) {
    $scope.addendums = data.results;
    $scope.addendums.forEach(function(addendum) {
      addendum.Date = Date.parse(addendum.Date.iso);
    });
  });
  };
  fetchAddendums();
  $scope.append = function(entry){
    entry.extra = true;
  };

  $scope.submitAppend = function(entry){
    var completeAddendum = {
      'Date': {
        'iso': $scope.date,
        '__type': 'Date'
      },
      'Body': entry.appendBody,
      'Picture': entry.picture,
      'Post': {
        '__type': 'Pointer',
        'className': 'Entry',
        'objectId': entry.objectId
      }
    };
    EntryFactory.save(completeAddendum, 'Addendum', function() {
      entry.extra = false;
      entry.appendBody = '';
      entry.picture = null;
      fetchAddendums();
    });
  };


}]);
