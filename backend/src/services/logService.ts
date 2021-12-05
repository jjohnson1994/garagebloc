import { Log, LogRouteForm } from "core/types";
import { DateTime } from "luxon";
import { v4 as uuidv4 } from "uuid";

import dynamoDb from "../db/dynamo";

export const createLog = async (
  userId: string,
  wallId: string,
  routeId: string,
  newLog: LogRouteForm
) => {
  const date = DateTime.utc().toString();
  const logId = uuidv4();

  const newLogParams = {
    TableName: String(process.env.tableName),
    Item: {
      hk: wallId,
      sk: `routeLog#route#${routeId}#log#${logId}`,
      model: "routeLog",
      ...newLog,
      routeId,
      wallId,
      logId,
      userId,
      createdAt: date,
      updatedAt: date,
      createdBy: userId,
    },
  };

  const newUserLogParams = {
    TableName: String(process.env.tableName),
    Item: {
      hk: userId,
      sk: `userRouteLog#wall#${wallId}#route#${routeId}#log#${logId}`,
      model: "userRouteLog",
      ...newLog,
      routeId,
      wallId,
      logId,
      userId,
      createdAt: date,
      updatedAt: date,
      createdBy: userId,
    },
  };

  await dynamoDb.put(newLogParams).promise();
  await dynamoDb.put(newUserLogParams).promise();

  return {
    logId,
  };
};

export const getUserRouteLogs = async (
  routeId: string,
  wallId: string,
  userId: string
): Promise<Log[]> => {
  const params = {
    TableName: String(process.env.tableName),
    KeyConditionExpression: "#hk = :hk AND begins_with(#sk, :sk)",
    ExpressionAttributeNames: {
      "#hk": "hk",
      "#sk": "sk",
    },
    ExpressionAttributeValues: {
      ":hk": userId,
      ":sk": `userRouteLog#wall#${wallId}#route#${routeId}#`,
    },
  };

  const routes = await dynamoDb.query(params).promise();

  return routes?.Items as Log[];
};

export const getUserWallLogs = async (
  wallId: string,
  userId: string
): Promise<Log[]> => {
  const params = {
    TableName: String(process.env.tableName),
    KeyConditionExpression: "#hk = :hk AND begins_with(#sk, :sk)",
    ExpressionAttributeNames: {
      "#hk": "hk",
      "#sk": "sk",
    },
    ExpressionAttributeValues: {
      ":hk": userId,
      ":sk": `userRouteLog#wall#${wallId}#`,
    },
  };

  const routes = await dynamoDb.query(params).promise();

  return routes?.Items as Log[];
};
