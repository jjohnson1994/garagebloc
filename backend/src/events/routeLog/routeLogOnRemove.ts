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
      const oldImage = message.dynamodb.OldImage;
      const normalizedRow = normalizeRow<Log>(oldImage);

      const { wallId, routeId, userId } = normalizedRow;

      const tasks: Promise<any>[] = [];

      tasks.push(wallService.decrementLogCount(wallId));
      tasks.push(routeService.decrementLogCount(wallId, routeId));
      tasks.push(globalsService.decrementLogCount());
      tasks.push(userService.decrementLogCount(userId));

      return tasks;
    });

    await Promise.all(promises);
  } catch (error) {
    console.error("Error in routeLogOnInsert", error);
    throw error
  }
};
