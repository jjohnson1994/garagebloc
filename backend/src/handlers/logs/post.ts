import { APIGatewayProxyEventV2, APIGatewayProxyHandlerV2 } from "aws-lambda";
import { LogRouteSchema } from "core/schemas";
import { LogRouteForm } from "core/types";
import { validateDataAgainstSchema } from "../../helpers/schemaValidator";
import { createLog } from "../../services/logService";

export const handler: APIGatewayProxyHandlerV2 = async (
  event: APIGatewayProxyEventV2
) => {
  const eventBody = JSON.parse(`${event.body}`) as LogRouteForm;
  const { wallId, routeId } = event.pathParameters as any;
  const userId =
    // @ts-ignore
    event.requestContext.authorizer?.iam.cognitoIdentity.identityId;

  try {
    await validateDataAgainstSchema(eventBody, LogRouteSchema);
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

  try {
    const newLog = await createLog(userId, wallId, routeId, eventBody);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(newLog),
    };
  } catch (error) {
    console.error("Error creating wall", error);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({ error: "Error creating log" }),
    };
  }
};
