import { Log } from "core/types";
import { normalizeRow } from "../../db/dynamo";
import * as wallService from "../../services/wallService";
import * as routeService from "../../services/routeService";
import * as globalsService from "../../services/gloabls";
import * as userService from "../../services/userService";
import { SNSHandler, SNSEvent } from "aws-lambda";

export const handler: SNSHandler = async (event: SNSEvent) => {
  try {
    const promises = event.Records.flatMap((record) => {
      const message = JSON.parse(record.Sns.Message);
      const newImage = message.dynamodb.NewImage;
      const normalizedRow = normalizeRow<Log>(newImage);

      const { wallId, routeId, userId } = normalizedRow;

      const tasks: Promise<any>[] = [];

      tasks.push(wallService.incrementLogCount(wallId));
      tasks.push(routeService.incrementLogCount(wallId, routeId));
      tasks.push(globalsService.incrementLogCount());
      tasks.push(userService.incrementLogCount(userId));

      return tasks;
    });

    await Promise.all(promises);
  } catch (error) {
    console.error("Error in routeLogOnInsert", error);
    throw error
  }
};
