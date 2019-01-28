var express = require('express');
var router = express.Router();
var AWS = require("aws-sdk");
const uuidV1 = require('uuid/v1');
var docClient = new AWS.DynamoDB.DocumentClient();
var checkUserExist = require('../utils/user');
const usersTableName = "Users";
/* GET users listing. */
router.get('/', function (req, res, next) {
  var params = {
    TableName: usersTableName,
    ProjectionExpression: "#id, #userName, #email, #dob, #zipcode, #description",
    ExpressionAttributeNames: {
      "#id": "id",
      "#userName": "userName",
      "#email": "email",
      "#dob": "dob",
      "#zipcode": "zipcode",
      "#description": "description"
    }
  };
  docClient.scan(params, onScan);
  function onScan(err, data) {
    if (err) {
      res.send(err);
      console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
    } else {
      res.send(data);

      // if (typeof data.LastEvaluatedKey != "undefined") {
      //   console.log("Scanning for more...");
      //   params.ExclusiveStartKey = data.LastEvaluatedKey;
      //   docClient.scan(params, onScan);
      // }
    }
  }
});
router.get('/:id', function (req, res, next) {
  var queryParams = {
    TableName: usersTableName,
    KeyConditionExpression: "#id = :id",
    ExpressionAttributeNames: {
      "#id": "id"
    },
    ExpressionAttributeValues: {
      ":id": req.params.id
    }
  };
  docClient.query(queryParams, function (err, data) {
    if (err) {
      res.send(err);
      console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
    } else {
      res.send(data);
    }
  })
});
router.post('/', function (req, res, next) {
  var user = req.body;
  // var queryParams = {
  //   TableName: usersTableName,
  //   KeyConditionExpression: "#email = :email",
  //   ExpressionAttributeNames: {
  //     "#email": "email"
  //   },
  //   ExpressionAttributeValues: {
  //     ":email": user.email
  //   }
  // };
  // docClient.query(queryParams, function (err, data) {
  //   if (err) {
  //     console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
  //   } else {
  //     if (data.Items && data.Items.length > 0) {
  //       res.status(400).send("Email already exist! Please try with other email.");
  //     } else {
  //       var params = {
  //         TableName: usersTableName,
  //         Item: {
  //           "id": user.id,
  //           "userName": user.user_name,
  //           "email": user.email,
  //           "dob": user.dob,
  //           "zipcode": user.zipcode,
  //           "description": user.description
  //         }
  //       };
  //       docClient.put(params, function (err, data) {
  //         if (err) {
  //           res.send(err);
  //           console.error("Unable to add Car", user.email, ". Error JSON:", JSON.stringify(err, null, 2));
  //         } else {
  //           res.send(data);
  //           console.log("PutItem succeeded:", user.email);
  //         }
  //       });
  //     }
  //   }
  // });
  var params = {
    TableName: usersTableName,
    Item: {
      "id": uuidV1(),
      "userName": user.user_name,
      "email": user.email,
      "dob": user.dob,
      "zipcode": user.zipcode,
      "description": user.description
    }
  };
  docClient.put(params, function (err, data) {
    if (err) {
      res.send(err);
      console.error("Unable to add Car", user.email, ". Error JSON:", JSON.stringify(err, null, 2));
    } else {
      res.send(data);
      console.log("PutItem succeeded:", user.email);
    }
  });
});

router.put('/:id', function (req, res, next) {
  var user = req.body;
  var params = {
    TableName: usersTableName,
    Key: {
      "id": req.params.id
    },
    UpdateExpression: "set userName=:n, dob=:dob, zipcode=:a",
    ExpressionAttributeValues: {
      ":n": user.user_name,
      ":dob": user.dob,
      ":a": user.zipcode
    },
    ReturnValues: "UPDATED_NEW"
  };
  docClient.update(params, function (err, data) {
    if (err) {
      console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
      res.send(err);
    } else {
      console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
      res.send(data);
    }
  });
});

router.delete('/:id', function (req, res, next) {
  var params = {
    TableName: usersTableName,
    Key: {
      "id": req.params.id
    }
  };
  docClient.delete(params, function (err, data) {
    if (err) {
      console.error("Unable to delete item. Error JSON:", JSON.stringify(err, null, 2));
      res.send(err);
    } else {
      console.log("delete succeeded:", JSON.stringify(data, null, 2));
      res.send(data);
    }
  });
});
module.exports = router;
