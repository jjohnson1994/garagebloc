import { APIGatewayProxyEventV2, APIGatewayProxyHandlerV2 } from "aws-lambda";
import { NewRouteFormSchema } from "core/schemas";
import { CreateRouteForm } from "core/types";
import { validateDataAgainstSchema } from "../../helpers/schemaValidator";
import { createRoute } from "../../services/routeService";

export const handler: APIGatewayProxyHandlerV2 = async (
  event: APIGatewayProxyEventV2
) => {
  const eventBody = JSON.parse(`${event.body}`) as CreateRouteForm;
  const { wallId } = event.pathParameters as any;
  const userId =
    // @ts-ignore
    event.requestContext.authorizer?.iam.cognitoIdentity.identityId;

  try {
    await validateDataAgainstSchema(eventBody, NewRouteFormSchema);
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
    const newRoute = await createRoute(userId, wallId, eventBody);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(newRoute),
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
      body: JSON.stringify({ error: "Error creating wall" }),
    };
  }
};
