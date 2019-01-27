// var AWS = require("aws-sdk");
// var docClient = new AWS.DynamoDB.DocumentClient();

// function checkUserExist(user) {
//   var queryParams = {
//     TableName: "Users",
//     KeyConditionExpression: "#email = :email",
//     ExpressionAttributeNames: {
//       "#email": "email"
//     },
//     ExpressionAttributeValues: {
//       ":email": user.email
//     }
//   };
//   docClient.query(queryParams, function (err, data) {
//     if (err) {
//       return err;
//     } else {
//       if (data.Items && data.Items.length > 0) {
//         return true;
//       } else {
//         return false;
//       }
//     }
//   });
// }

// export const userUtils = {
//   checkUserExist : checkUserExist
// }