import { APIGatewayProxyEventV2, APIGatewayProxyHandlerV2 } from "aws-lambda";
import { yup } from "core/schemas";
import { Visibility, CreateWallRequest } from "core/types";
import { validateDataAgainstSchema } from "../../helpers/schemaValidator";
import {createWall} from "../../services/wallService";

const NewWallRequestSchema = yup
  .object({
    wallName: yup.string().required("Required"),
    overhangDeg: yup
      .number()
      .typeError("Must be a number")
      .required("Required")
      .min(-90)
      .max(90),
    widthCm: yup.number().typeError("Must be a number").required("Required"),
    heightCm: yup.number().typeError("Must be a number").required("Required"),
    imageKey: yup.string().required("Required"),
    visibility: yup
      .mixed()
      .oneOf(Object.values(Visibility))
      .required("Required"),
  })
  .required()
  .noUnknown();

export const handler: APIGatewayProxyHandlerV2 = async (
  event: APIGatewayProxyEventV2
) => {
  const eventBody = JSON.parse(`${event.body}`) as CreateWallRequest;
  // @ts-ignore
  const userId = event.requestContext.authorizer?.iam.cognitoIdentity.identityId

  try {
    await validateDataAgainstSchema(eventBody, NewWallRequestSchema);
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
    const newWall = await createWall(userId, eventBody)

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({ id: newWall.id }),
    };
  } catch(error) {
    console.error('Error creating wall', error) 
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
