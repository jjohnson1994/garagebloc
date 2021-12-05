import { CreateWallRequest, Wall } from "core/types";
import { DateTime } from "luxon";
import { v4 as uuidv4 } from "uuid";

import dynamoDb from "../db/dynamo";

export const createWall = async (
  userId: string,
  newWall: CreateWallRequest
) => {
  const date = DateTime.utc().toString();
  const wallId = uuidv4();

  const newWallParams = {
    TableName: String(process.env.tableName),
    Item: {
      hk: wallId,
      sk: "metadata",
      model: "wall",
      ...newWall,
      logCount: 0,
      routeCount: 0,
      memberCount: 0,
      wallId,
      createdAt: date,
      updatedAt: date,
      createdBy: userId,
    },
  };

  const newUserWallParams = {
    TableName: String(process.env.tableName),
    Item: {
      hk: userId,
      sk: wallId,
      model: "userWall",
      ...newWall,
      userId,
      wallId,
      createdAt: date,
      updatedAt: date,
      createdBy: userId,
    },
  };

  await dynamoDb.put(newWallParams).promise();
  await dynamoDb.put(newUserWallParams).promise();

  return {
    id: wallId,
  };
};

export const getWall = async (wallId: string): Promise<Wall> => {
  const params = {
    TableName: String(process.env.tableName),
    KeyConditionExpression: "#hk = :hk AND begins_with(#sk, :sk)",
    ExpressionAttributeNames: {
      "#hk": "hk",
      "#sk": "sk",
    },
    ExpressionAttributeValues: {
      ":hk": wallId,
      ":sk": "metadata",
    },
  };

  const walls = await dynamoDb.query(params).promise();

  return walls?.Items?.[0] as unknown as Wall;
};

export const getUserWalls = async (userId: string): Promise<Wall[]> => {
  const params = {
    TableName: String(process.env.tableName),
    IndexName: "gsi2",
    KeyConditionExpression: "#model = :model AND begins_with(#hk, :hk)",
    ExpressionAttributeNames: {
      "#model": "model",
      "#hk": "hk",
    },
    ExpressionAttributeValues: {
      ":model": "userWall",
      ":hk": userId,
    },
  };

  const { Items: userWalls } = await dynamoDb.query(params).promise();

  if (!userWalls) {
    return [];
  }

  const walls = await Promise.all(
    userWalls.map(async (userWall): Promise<Wall> => {
      const wall = await getWall(userWall.wallId);

      return {
        ...userWall,
        ...wall,
      };
    })
  );

  return walls as Wall[];
};

export const incrementLogCount = (wallId: string) => {
  const params = {
    TableName: String(process.env.tableName),
    Key: {
      hk: wallId,
      sk: "metadata",
    },
    UpdateExpression: "set #logCount = #logCount + :inc",
    ExpressionAttributeNames: {
      "#logCount": "logCount",
    },
    ExpressionAttributeValues: {
      ":inc": 1,
    },
  };

  return dynamoDb.update(params).promise();
};

export const decrementLogCount = (wallId: string) => {
  const params = {
    TableName: String(process.env.tableName),
    Key: {
      hk: wallId,
      sk: "metadata",
    },
    UpdateExpression: "set #logCount = #logCount - :inc",
    ExpressionAttributeNames: {
      "#logCount": "logCount",
    },
    ExpressionAttributeValues: {
      ":inc": 1,
    },
  };

  return dynamoDb.update(params).promise();
};

export const incrementMemberCount = (wallId: string) => {
  const params = {
    TableName: String(process.env.tableName),
    Key: {
      hk: wallId,
      sk: "metadata",
    },
    UpdateExpression: "set #memberCount = #memberCount + :inc",
    ExpressionAttributeNames: {
      "#memberCount": "memberCount",
    },
    ExpressionAttributeValues: {
      ":inc": 1,
    },
  };

  return dynamoDb.update(params).promise();
};

export const decrementMemberCount = (wallId: string) => {
  const params = {
    TableName: String(process.env.tableName),
    Key: {
      hk: wallId,
      sk: "metadata",
    },
    UpdateExpression: "set #memberCount = #memberCount - :inc",
    ExpressionAttributeNames: {
      "#memberCount": "memberCount",
    },
    ExpressionAttributeValues: {
      ":inc": 1,
    },
  };

  return dynamoDb.update(params).promise();
};
