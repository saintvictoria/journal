angular.module('journal')
.factory('EntryFactory',
['PARSE_HEADERS','PARSE_URI','$http',
function(PARSE_HEADERS,PARSE_URI,$http) {

  /**
  @param {Entry} entry
  */
  var save = function(entry) {
    var config = {

      headers: PARSE_HEADERS.headers
    }
    /* this gives back the location header which contains the URL to the entry
    the object that is sent back gives a
    {string} createdAt, and the {string} objectId.
    */
    return $http.post(PARSE_URI+'/classes/Entry', entry, config);

  };
  /**

  */
  var entryList = function() {

  };
  /**
  @param {Append} append
  */
  var append = function(append) {

  };


   return {
     save: save,
     getAll: entryList,
     append: append


   }

 }]);
