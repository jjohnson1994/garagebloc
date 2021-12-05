import dynamoDb from "../db/dynamo";

export const incrementLogCount = (userId: string) => {
  const params = {
    TableName: String(process.env.tableName),
    Key: {
      hk: userId,
      sk: 'userMetadata',
    },
    UpdateExpression: "add #logCount :inc",
    ExpressionAttributeNames: {
      "#logCount": "logCount",
    },
    ExpressionAttributeValues: {
      ":inc": 1,
    },
  };

  return dynamoDb.update(params).promise();
};

export const decrementLogCount = (userId: string) => {
  const params = {
    TableName: String(process.env.tableName),
    Key: {
      hk: userId,
      sk: 'userMetadata',
    },
    UpdateExpression: "add #logCount:inc",
    ExpressionAttributeNames: {
      "#logCount": "logCount",
    },
    ExpressionAttributeValues: {
      ":inc": -1,
    },
  };

  return dynamoDb.update(params).promise();
};
