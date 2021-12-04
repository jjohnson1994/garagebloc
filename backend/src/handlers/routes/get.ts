import { APIGatewayProxyEventV2, APIGatewayProxyHandlerV2 } from "aws-lambda";
import { getRouteById, getRouteForWall } from "../../services/routeService";
import { getUserRouteLogs } from "../../services/logService";

export const handler: APIGatewayProxyHandlerV2 = async (
  event: APIGatewayProxyEventV2
) => {
  const userId =
    // @ts-ignore
    event.requestContext.authorizer?.iam.cognitoIdentity.identityId;

  const { wallId, routeId } = event.queryStringParameters || ({} as any);

  try {
    if (routeId) {
      const route = await getRouteById(routeId);
      const userLogs = await getUserRouteLogs(routeId, route.wallId, userId);

      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true,
        },
        body: JSON.stringify({ route: { ...route, userLogs } }),
      };
    } else {
      const routes = await getRouteForWall(wallId);

      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true,
        },
        body: JSON.stringify({ routes }),
      };
    }
  } catch (error) {
    console.error("Error gettings routes", error);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({ error: "Error getting routes" }),
    };
  }
};
