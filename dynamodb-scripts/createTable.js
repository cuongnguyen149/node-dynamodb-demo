var AWS = require("aws-sdk");
AWS.config.update({
    "accessKeyId": "AKIAJSGWA37IMIW6AC7Q",
    "secretAccessKey": "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",
    region: "us-east-1",
    // endpoint: "http://localhost:8000"
});
var dynamodb = new AWS.DynamoDB();
const tableName = "Users";
var params = {
    TableName: tableName,
    KeySchema: [
        { AttributeName: "id", KeyType: "HASH" },  //Partition key
    ],
    AttributeDefinitions: [
        { AttributeName: "id", AttributeType: "S" },
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5
    }
};
dynamodb.createTable(params, function (err, data) {
    if (err) {
        console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
    }
});