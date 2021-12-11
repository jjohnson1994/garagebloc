import { incrementWallCount } from "../../services/gloabls";
import { SNSHandler, SNSEvent } from "aws-lambda";

export const handler: SNSHandler = async (event: SNSEvent) => {
  try {
    const promises = event.Records.flatMap(() => {
      const tasks: Promise<any>[] = [];

      tasks.push(incrementWallCount());

      return tasks;
    });

    await Promise.all(promises);
  } catch (error) {
    console.error("Error in wallOnInsert", error);
    throw error;
  }
};
