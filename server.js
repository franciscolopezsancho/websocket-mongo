
var http = require("http");
/**
 * How to subscribe for new MongoDB documents in Node.js using tailable cursor
 */
 
// subscriber function
var subscribe = function(){
 
  var args = [].slice.call(arguments);
  var next = args.pop();
  var filter = args.shift() || {};
  
 
  
  // connect to MongoDB
 require('mongodb').MongoClient.connect('mongodb://localhost/test', function(err, db){
    
    // make sure you have created capped collection "messages" on db "test"
	console.log("going for colletcion")
    db.collection('messages', function(err, coll) {
 
      // seek to latest object
      var seekCursor = coll.find(filter).sort({$natural: -1}).limit(1);
      seekCursor.nextObject(function(err, latest) {
        if (latest) {
          filter._id = { $gt: latest._id }
        }
        
        // set MongoDB cursor options
        var cursorOptions = {
          tailable: true,
          awaitdata: true,
          numberOfRetries: -1
        };
        
        // create stream and listen
        var stream = coll.find(filter, cursorOptions).sort({$natural: -1}).stream();
        
		console.log("some data found"+stream)
        // call the callback
        stream.on('data', next);
			

      });
    });
 
  });
  
};

function onRequest(request, response) {
  console.log("Request received.");
  response.writeHead(200, {"Content-Type": "text/plain"});
   subscribe( function(document) {
  console.log("after reques" +document);
  
});
  response.write("new request");
  response.end();
};



http.createServer(onRequest).listen(8888);