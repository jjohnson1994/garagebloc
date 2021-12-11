import { CreateRouteForm, Route } from "core/types";
import { DateTime } from "luxon";
import { v4 as uuidv4 } from "uuid";

import dynamoDb from "../db/dynamo";

export const createRoute = async (
  userId: string,
  wallId: string,
  newRoute: CreateRouteForm
) => {
  const date = DateTime.utc().toString();
  const routeId = uuidv4();

  const newRouteParams = {
    TableName: String(process.env.tableName),
    Item: {
      hk: wallId,
      sk: routeId,
      model: "route",
      ...newRoute,
      gradeTally: {
        [newRoute.grade]: 1,
      },
      logCount: 0,
      routeId,
      wallId,
      createdAt: date,
      updatedAt: date,
      createdBy: userId,
    },
  };

  await dynamoDb.put(newRouteParams).promise();

  return {
    routeId,
  };
};

export const getRouteById = async (routeId: string): Promise<Route> => {
  const params = {
    TableName: String(process.env.tableName),
    IndexName: "gsi1",
    KeyConditionExpression: "#model = :model AND #sk = :sk",
    ExpressionAttributeNames: {
      "#model": "model",
      "#sk": "sk",
    },
    ExpressionAttributeValues: {
      ":model": "route",
      ":sk": routeId,
    },
  };

  const routes = await dynamoDb.query(params).promise();

  return routes?.Items?.[0] as Route;
};

export const getRouteForWall = async (wallId: string): Promise<Route[]> => {
  const params = {
    TableName: String(process.env.tableName),
    IndexName: "gsi2",
    KeyConditionExpression: "#model = :model AND #hk = :hk",
    ExpressionAttributeNames: {
      "#model": "model",
      "#hk": "hk",
    },
    ExpressionAttributeValues: {
      ":model": "route",
      ":hk": wallId,
    },
  };

  const routes = await dynamoDb.query(params).promise();

  return routes?.Items as Route[];
};

export const incrementLogCount = (wallId: string, routeId: string) => {
  const params = {
    TableName: String(process.env.tableName),
    Key: {
      hk: wallId,
      sk: routeId,
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

export const decrementLogCount = (wallId: string, routeId: string) => {
  const params = {
    TableName: String(process.env.tableName),
    Key: {
      hk: wallId,
      sk: routeId,
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
