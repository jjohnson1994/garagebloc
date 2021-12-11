import { Wall } from "core/types";
import { normalizeRow } from "../../db/dynamo";
import { incrementMemberCount } from "../../services/wallService";
import { SNSHandler, SNSEvent } from "aws-lambda";

export const handler: SNSHandler = async (event: SNSEvent) => {
  try {
    const promises = event.Records.flatMap((record) => {
      const message = JSON.parse(record.Sns.Message);
      const newImage = message.dynamodb.NewImage;
      const normalizedRow = normalizeRow<Wall>(newImage);

      const { wallId } = normalizedRow;

      const tasks: Promise<any>[] = [];

      tasks.push(incrementMemberCount(wallId));

      return tasks;
    });

    await Promise.all(promises);
  } catch (error) {
    console.error("Error in userWallOnInsert", error);
    throw error;
  }
};
