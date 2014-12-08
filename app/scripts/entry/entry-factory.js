angular.module('journal')
.factory('EntryFactory',
['PARSE_HEADERS','PARSE_URI','$http', '$upload',
function(PARSE_HEADERS,PARSE_URI,$http, $upload) {

  /**
  @param {Entry} entry
  */
  var save = function(entry) {
    var config = {

      headers: PARSE_HEADERS.headers
    }
    /* this gives back the location header which contains the URL to the entry
    the object that is sent back gives a
    {string} createdAt, and the {string} objectI
    */
    var picture = entry.Picture;
    delete entry.Picture;
    var promise = $http.post(PARSE_URI+'/classes/Entry', entry, config);
    promise.success(function(data) {
      console.log("saved ok", data);
      var oId = data.objectId;
      var fileReader = new FileReader();
      fileReader.readAsArrayBuffer(picture);
      fileReader.onload = function(e) {
        var headers = angular.copy(PARSE_HEADERS.headers);
        headers['Content-Type'] =  picture.type;
        var uploadConfig = {
          'url': PARSE_URI + '/files/' + picture.name,
          'data': e.target.result,
          'headers': headers
        };
        var uploadPromise = $upload.http(uploadConfig);
        uploadPromise.success(function(data) {
          console.log("upload ok", data);
          var fileData = {
            'Picture': {
              '__type': "File",
              'name': data.name
            }
          };
          var url = PARSE_URI+'/classes/Entry/'+ oId;
          var attachPromise =$http.put(url, fileData, config);
          attachPromise.success(function(data) {
            console.log('woohoo', data);
          });

        });
      }
    });

  };
  /**

  */
  var entryList = function() {

    var config = {
      headers: PARSE_HEADERS.headers
    }

    var promise = $http.get(PARSE_URI+'/classes/Entry', config);
    return promise;



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
