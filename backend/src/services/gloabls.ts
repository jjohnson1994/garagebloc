import dynamoDb from "../db/dynamo";

export const incrementLogCount = () => {
  const params = {
    TableName: String(process.env.tableName),
    Key: {
      hk: 'globals',
      sk: "metadata",
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
}

export const decrementLogCount = () => {
  const params = {
    TableName: String(process.env.tableName),
    Key: {
      hk: 'globals',
      sk: "metadata",
    },
    UpdateExpression: "add #logCount :inc",
    ExpressionAttributeNames: {
      "#logCount": "logCount",
    },
    ExpressionAttributeValues: {
      ":inc": -1,
    },
  };

  return dynamoDb.update(params).promise();
}

export const incrementWallCount = () => {
  const params = {
    TableName: String(process.env.tableName),
    Key: {
      hk: 'globals',
      sk: "metadata",
    },
    UpdateExpression: "add #wallCount :inc",
    ExpressionAttributeNames: {
      "#wallCount": "wallCount",
    },
    ExpressionAttributeValues: {
      ":inc": 1,
    },
  };

  return dynamoDb.update(params).promise();
}

export const decrementWallCount = () => {
  const params = {
    TableName: String(process.env.tableName),
    Key: {
      hk: 'globals',
      sk: "metadata",
    },
    UpdateExpression: "add #wallCount :inc",
    ExpressionAttributeNames: {
      "#wallCount": "wallCount",
    },
    ExpressionAttributeValues: {
      ":inc": -1,
    },
  };

  return dynamoDb.update(params).promise();
}
