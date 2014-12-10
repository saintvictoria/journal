angular.module('journal')
.factory('EntryFactory',
['PARSE_HEADERS','PARSE_URI','$http', '$upload',
function(PARSE_HEADERS,PARSE_URI,$http, $upload) {

  /**
  @param {Object} object An Entry or Addendum.
  @param {String} classname the Parse class to save
  @param {?function(string)} callback given the objectId after successful save
  */
  var save = function(object, classname, callback) {
    /* globals FileReader */
    "use strict";
    var config = {

      headers: PARSE_HEADERS.headers
    };
    /* this gives back the location header which contains the URL to the entry
    the object that is sent back gives a
    {string} createdAt, and the {string} objectI
    */
    var picture = object.Picture;
    delete object.Picture;
    var promise = $http.post(PARSE_URI+'/classes/'+classname, object, config);
    promise.success(function(data) {
      var oId = data.objectId;

      if (!picture) {
        if (callback) {
          callback(data.objectId);
        }
        return;
      }
      var fileReader = new FileReader();
      fileReader.readAsArrayBuffer(picture);
      fileReader.onload = function(e) {
        var headers = angular.copy(PARSE_HEADERS.headers);
        headers['Content-Type'] =  picture.type;
        var safeName = picture.name.replace(/[^A-Za-z_0-9\.]/g, '');
        var uploadConfig = {
          'url': PARSE_URI + '/files/' + safeName,
          'data': e.target.result,
          'headers': headers
        };
        var uploadPromise = $upload.http(uploadConfig);
        uploadPromise.success(function(data) {
          var fileData = {
            'Picture': {
              '__type': "File",
              'name': data.name
            }
          };
          var url = PARSE_URI+'/classes/' + classname + '/' + oId;
          var attachPromise =$http.put(url, fileData, config);
          attachPromise.success(function(data) {
            if (callback) {
              callback(data.objectId);
            }
          });
        });
      };
    });
  };
  /**

  */

  /**
  */
  var append = function() {

  };

  var entryList = function() {

    var config = {
      headers: PARSE_HEADERS.headers
    };

    //noinspection UnnecessaryLocalVariableJS
    var promise = $http.get(PARSE_URI+'/classes/Entry', config);
    return promise;
  };

  var addendumList = function () {

    var config = {
      headers: PARSE_HEADERS.headers
    };

    //noinspection UnnecessaryLocalVariableJS
    var promise = $http.get(PARSE_URI+'/classes/Addendum', config);
    return promise;
  };

   return {
     save: save,
     getAll: entryList,
     append: append,
     getAddendums: addendumList
   };

 }]);
