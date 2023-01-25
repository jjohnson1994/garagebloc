import { APIGatewayProxyEventV2, APIGatewayProxyHandlerV2 } from "aws-lambda";
import { getWall, getUserWalls } from "../../services/wallService";

export const handler: APIGatewayProxyHandlerV2 = async (
  event: APIGatewayProxyEventV2
) => {
  const userId =
    (event.requestContext.authorizer as any)?.iam.cognitoIdentity.identityId;

  const { wallId } = event.queryStringParameters || {} as any

  try {
    if (wallId) {
      const wall = await getWall(wallId)

      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true,
        },
        body: JSON.stringify({ wall }),
      };
    } else {
      const walls = await getUserWalls(userId)

      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true,
        },
        body: JSON.stringify({ walls }),
      };
    }
  } catch(error) {
    console.error('Error gettings walls', error) 
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({ error: "Error getting walls" }),
    };
  }
};

