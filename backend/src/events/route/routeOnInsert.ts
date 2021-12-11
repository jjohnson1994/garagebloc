import * as globalsService from "../../services/gloabls";
import * as wallService from "../../services/wallService";
import * as userService from "../../services/userService";

import { SNSHandler, SNSEvent } from "aws-lambda";
import { normalizeRow } from "../../db/dynamo";
import { Route } from "core/types";

export const handler: SNSHandler = async (event: SNSEvent) => {
  try {
    const promises = event.Records.flatMap((record) => {
      const message = JSON.parse(record.Sns.Message);
      const newImage = message.dynamodb.NewImage;
      const normalizedRow = normalizeRow<Route>(newImage);

      const { wallId, createdBy } = normalizedRow;

      const tasks: Promise<any>[] = [];

      tasks.push(wallService.incrementRouteCount(wallId));
      tasks.push(globalsService.incrementRouteCount());
      tasks.push(userService.incrementRouteCount(createdBy));

      return tasks;
    });

    await Promise.all(promises);
  } catch (error) {
    console.error("Error in routeOnInsert", error);
    throw error;
  }
};
