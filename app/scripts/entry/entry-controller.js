angular.module('journal')
.controller('EntryController',
['$scope', '$location', 'EntryFactory','QuestionFactory', '$cookieStore', '$sce',
function($scope, $location,  EntryFactory, QuestionFactory, $cookieStore,  $sce){
/* global Date */

//probaly need a welcome controller
//for next two functions
  $scope.user = $cookieStore.get('currentUser');
  $scope.newEntry = function(){
    $location.path('/newEntry')
  };
  $scope.entriesView =function (){
    $location.path('/entries')
  };


  $scope.date = new Date();
  $scope.question = '';
  $scope.heading = '';
  $scope.body = '';
  var ranQuestion = function() {
    QuestionFactory.questionRandom()
    .success(function(data) {
      var qNumber =  Math.floor(Math.random() * (data.results.length));
      $scope.question = data.results[qNumber].question;

    });
  };
  ranQuestion();

  $scope.do_over = function() {
    ranQuestion();
  };

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
      entry.Body = $sce.trustAsHtml(entry.Body);
      entry.Date = Date.parse(entry.Date.iso);
    });
  });

  // get the addendums too!
  $scope.addendums = [];
  var fetchAddendums = function() {
  EntryFactory.getAddendums().success(function(data) {
    $scope.addendums = data.results;
    $scope.addendums.forEach(function(addendum) {
      addendum.Body = $sce.trustAsHtml(addendum.Body);
      addendum.Date = Date.parse(addendum.Date.iso);
    });
  });
  };
  fetchAddendums();
  $scope.append = function(entry){
    entry.extra = !entry.extra;
  };
  $scope.addendumsForEntry = function (entry) {
    /* global _ */
    return _.filter($scope.addendums, function (it) { return it.Post.objectId === entry.objectId; });
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
