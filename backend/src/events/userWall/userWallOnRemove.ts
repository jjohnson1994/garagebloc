import { Wall } from "core/types";
import { normalizeRow } from "../../db/dynamo";
import { decrementMemberCount } from "../../services/wallService";
import { SNSHandler, SNSEvent } from "aws-lambda";

export const handler: SNSHandler = async (event: SNSEvent) => {
  try {
    const promises = event.Records.flatMap((record) => {
      const message = JSON.parse(record.Sns.Message);
      const oldImage = message.dynamodb.OldImage;
      const normalizedRow = normalizeRow<Wall>(oldImage);

      const { wallId } = normalizedRow;

      const tasks: Promise<any>[] = [];

      tasks.push(decrementMemberCount(wallId));

      return tasks;
    });

    await Promise.all(promises);
  } catch (error) {
    console.error("Error in userWallOnRemove", error);
    throw error;
  }
};

