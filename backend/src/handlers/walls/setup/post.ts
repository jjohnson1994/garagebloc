import { APIGatewayProxyEventV2, APIGatewayProxyHandlerV2 } from "aws-lambda";
import { SetupWallFormSchema } from "core/schemas";
import { SetupWallForm } from "core/types";
import { validateDataAgainstSchema } from "../../../helpers/schemaValidator";
import { getWallAdminUserId, setupWall } from "../../../services/wallService";

export const handler: APIGatewayProxyHandlerV2 = async (
  event: APIGatewayProxyEventV2
) => {
  const eventBody = JSON.parse(`${event.body}`) as SetupWallForm;
  const { wallId } = event.pathParameters as any;
  const userId = (event.requestContext.authorizer as any)?.iam.cognitoIdentity
    .identityId;

  try {
    await validateDataAgainstSchema(eventBody, SetupWallFormSchema);
  } catch (error) {
    return {
      statusCode: 400,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({ error: "Bad Request, schema validation failed" }),
    };
  }

  const wallAdminUserId = await getWallAdminUserId(wallId);

  if (wallAdminUserId !== userId) {
    return {
      statusCode: 403,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({
        error: "Forbidden",
      }),
    };
  }

  try {
    await setupWall(wallId, eventBody);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({ success: true }),
    };
  } catch (error) {
    console.error("Error setting up wall", error);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({ error: "Error setting up wall" }),
    };
  }
};
