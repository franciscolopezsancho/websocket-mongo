//##################### WEBSOCKET SERVER ##################
var http = require("http");
var WebSocketServer = require('ws').Server
, http = require('http')
, express = require('express')
, app = express();
app.use(express.static(__dirname + '/public'));

var server = http.createServer(app);
server.listen(8081);

var wss = new WebSocketServer({server: server});
wss.on('connection', function(ws) {
		if(query != ""){
			query = "";
		}
		ws.on('message', function(message) {
			console.log("messaging");
			query = message; 
			stream.destroy();
			subscribe( function(document) {
				ws.send(JSON.stringify({"last":document}), function() { /* ignore errors */ });
				});
			retriveAll(function(send){ ws.send(JSON.stringify({"all":send}));},query)
			});

		subscribe( function(document) {
			ws.send(JSON.stringify({"last":document}), function() { /* ignore errors */ });
			});

		retriveAll(function(send){ ws.send(JSON.stringify({"all":send}));},query)
		});

//######### MONGO CONNECTION #################

var mongo_collection = "rawCapped";
var mongo_server_url = "54.77.66.88";
var mongo_db="datasift"
var query = "";
/**
 * How to subscribe for new MongoDB documents in Node.js using tailable cursor
 */

// subscriber function
function subscribe(){

	var args = [].slice.call(arguments);
	var next = args.pop();
	var filter = {"interaction.interaction.tags":new RegExp( query, 'i')};



	// connect to MongoDB
	require('mongodb').MongoClient.connect('mongodb://'+mongo_server_url+'/'+mongo_db, function(err, db){

			// make sure you have created capped collection "messages" on db "test"
			console.log("going for colletcion")
			db.collection(mongo_collection, function(err, coll) {

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
				stream = coll.find(filter, cursorOptions).sort({$natural: -1}).stream();
				console.log("QUERY " +query)
				console.log("some data found"+stream)
				// call the callback
				stream.on('data', next);
				});
			});

	});

};

var retriveAll = function(anonymus_function,query){
	require('mongodb').MongoClient.connect('mongodb://'+mongo_server_url+'/'+mongo_db, function(err, db){
			var result = [];
			db.collection(mongo_collection).find({"interaction.interaction.tags":new RegExp( query, 'i')}).sort({$natural: -1}).limit(100).toArray(function(err, docs) {
				anonymus_function(docs)
				});
			setTimeout(function(){db.close()},10000)
			})};
