var express = require("express");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;

var TOPICS_COLLECTION = "topics";

var app = express();
app.use(bodyParser.json());

// Create link to Angular build directory
var distDir = __dirname + "/dist/";
app.use(express.static(distDir));

// Create a database variable outside of the database connection callback to reuse the connection pool in your app.
var db;

// Connect to the database before starting the application server.
mongodb.MongoClient.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/test", function (err, client) {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  // Save database object from the callback for reuse.
  db = client.db();
  console.log("Database connection ready");

  // Initialize the app.
  var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
  });
});

// TOPICS API ROUTES BELOW

// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({"error": message});
}

/*  "/api/topics"
 *    GET: finds all topics
 *    POST: creates a new topic
 */

app.get("/api/topics", function(req, res) {
  db.collection(TOPICS_COLLECTION).find({}).toArray(function(err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get topics.");
    } else {
      res.status(200).json(docs);
    }
  });
});

app.post("/api/topics", function(req, res) {
  var newContact = req.body;
  newContact.createDate = new Date();

  if (!req.body.name) {
    handleError(res, "Invalid user input", "Must provide a topic.", 400);
  } else {
    db.collection(TOPICS_COLLECTION).insertOne(newContact, function(err, doc) {
      if (err) {
        handleError(res, err.message, "Failed to create new topic.");
      } else {
        res.status(201).json(doc.ops[0]);
      }
    });
  }
});

/*  "/api/topics/:id"
 *    GET: find topic by id
 *    PUT: update topic by id
 *    DELETE: deletes topic by id
 */

app.get("/api/topics/:id", function(req, res) {
  db.collection(TOPICS_COLLECTION).findOne({ _id: new ObjectID(req.params.id) }, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to get topic");
    } else {
      res.status(200).json(doc);
    }
  });
});

app.put("/api/topics/:id", function(req, res) {
  var updateDoc = req.body;
  delete updateDoc._id;

  db.collection(TOPICS_COLLECTION).updateOne({_id: new ObjectID(req.params.id)}, updateDoc, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to update topic");
    } else {
      updateDoc._id = req.params.id;
      res.status(200).json(updateDoc);
    }
  });
});

app.delete("/api/topics/:id", function(req, res) {
  db.collection(TOPICS_COLLECTION).deleteOne({_id: new ObjectID(req.params.id)}, function(err, result) {
    if (err) {
      handleError(res, err.message, "Failed to delete topic");
    } else {
      res.status(200).json(req.params.id);
    }
  });
});

/*  "/api/topics/random"
 *    GET: find topic by random id
 */

app.get("/api/topics/random", function(req, res) {
  db.collection(TOPICS_COLLECTION).findOne({ _id: new ObjectID(req.params.id) }, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to get topic");
    } else {
      res.status(200).json(doc);
    }
  });
});
