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
    {string} createdAt, and the {string} objectId.

    https://api.parse.com/1/files/pic.jpg

    "url": "http://files.parsetfss.com/bc9f32df-2957-4bb1-93c9-ec47d9870a05/tfss-db295fb2-8a8b-49f3-aad3-dd911142f64f-hello.txt",
    "name": "db295fb2-8a8b-49f3-aad3-dd911142f64f-hello.txt"

    Post:
    "name": "Andrew",
    "picture": {
    "name": "...profile.png",
    "__type": "File"


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
