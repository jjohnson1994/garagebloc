import * as iam from "@aws-cdk/aws-iam";
import * as sst from "@serverless-stack/resources";
import { CorsHttpMethod } from "@aws-cdk/aws-apigatewayv2";
import { BucketAccessControl, HttpMethods, CorsRule } from "@aws-cdk/aws-s3";

export default class MyStack extends sst.Stack {
  constructor(scope: sst.App, id: string, props?: sst.StackProps) {
    super(scope, id, props);

    const table = new sst.Table(this, "garagebloc-db", {
      fields: {
        hk: sst.TableFieldType.STRING,
        sk: sst.TableFieldType.STRING,
        model: sst.TableFieldType.STRING,
        slug: sst.TableFieldType.STRING,
      },
      primaryIndex: { partitionKey: "hk", sortKey: "sk" },
      secondaryIndexes: {
        gsi1: {
          partitionKey: "model",
          sortKey: "sk",
        },
        gsi2: {
          partitionKey: "model",
          sortKey: "hk",
        },
      },
      stream: true,
    });

    const topicWallOnInsert = new sst.Topic(this, "wallOnInsert", {
      subscribers: [
        new sst.Function(this, "wallOnInsertHandler", {
          handler: "src/events/wall/wallOnInsert.handler",
          environment: {
            tableName: table.dynamodbTable.tableName,
          },
          permissions: [table],
        }),
      ],
    });

    const topicWallOnRemove = new sst.Topic(this, "wallOnRemove", {
      subscribers: [
        new sst.Function(this, "wallOnRemoveHandler", {
          handler: "src/events/wall/wallOnRemove.handler",
          environment: {
            tableName: table.dynamodbTable.tableName,
          },
          permissions: [table],
        }),
      ],
    });

    const topicUserWallOnInsert = new sst.Topic(this, "userWallOnInsert", {
      subscribers: [
        new sst.Function(this, "userWallOnInsertHandler", {
          handler: "src/events/userWall/userWallOnInsert.handler",
          environment: {
            tableName: table.dynamodbTable.tableName,
          },
          permissions: [table],
        }),
      ],
    });

    const topicUserWallOnRemove = new sst.Topic(this, "userWallOnRemove", {
      subscribers: [
        new sst.Function(this, "userWallOnRemoveHandler", {
          handler: "src/events/userWall/userWallOnRemove.handler",
          environment: {
            tableName: table.dynamodbTable.tableName,
          },
          permissions: [table],
        }),
      ],
    });

    const topicRouteLogOnInsert = new sst.Topic(this, "routeLogOnInsert", {
      subscribers: [
        new sst.Function(this, "routeLogOnInsertHandler", {
          handler: "src/events/routeLog/routeLogOnInsert.handler",
          environment: {
            tableName: table.dynamodbTable.tableName,
          },
          permissions: [table],
        }),
      ],
    });

    const topicRouteLogOnRemove = new sst.Topic(this, "routeLogOnRemove", {
      subscribers: [
        new sst.Function(this, "routeLogOnRemoveHandler", {
          handler: "src/events/routeLog/routeLogOnRemove.handler",
          environment: {
            tableName: table.dynamodbTable.tableName,
          },
          permissions: [table],
        }),
      ],
    });

    const topicRouteOnInsert = new sst.Topic(this, "routeOnInsert", {
      subscribers: [
        new sst.Function(this, "routeOnInsertHandler", {
          handler: "src/events/route/routeOnInsert.handler",
          environment: {
            tableName: table.dynamodbTable.tableName,
          },
          permissions: [table],
        }),
      ],
    });

    const topicRouteOnRemove = new sst.Topic(this, "routeOnRemove", {
      subscribers: [
        new sst.Function(this, "routeOnRemoveHandler", {
          handler: "src/events/route/routeOnRemove.handler",
          environment: {
            tableName: table.dynamodbTable.tableName,
          },
          permissions: [table],
        }),
      ],
    });

    const dynamoConsumer = new sst.Function(
      this,
      "garagebloc-dynamodb-stream-consumer",
      {
        handler: "src/events/dynamodb/stream.handler",
        environment: {
          TOPIC_ARN_WALL_INSERT: topicWallOnInsert.snsTopic.topicArn,
          TOPIC_ARN_WALL_REMOVE: topicWallOnRemove.snsTopic.topicArn,
          TOPIC_ARN_USERWALL_INSERT: topicUserWallOnInsert.snsTopic.topicArn,
          TOPIC_ARN_USERWALL_REMOVE: topicUserWallOnRemove.snsTopic.topicArn,
          TOPIC_ARN_ROUTELOG_INSERT: topicRouteLogOnInsert.snsTopic.topicArn,
          TOPIC_ARN_ROUTELOG_REMOVE: topicRouteLogOnRemove.snsTopic.topicArn,
          TOPIC_ARN_ROUTE_INSERT: topicRouteOnInsert.snsTopic.topicArn,
          TOPIC_ARN_ROUTE_REMOVE: topicRouteOnRemove.snsTopic.topicArn,
        },
        permissions: [
          topicWallOnInsert,
          topicWallOnRemove,
          topicUserWallOnInsert,
          topicUserWallOnRemove,
          topicRouteLogOnInsert,
          topicRouteLogOnRemove,
          topicRouteOnInsert,
          topicRouteOnRemove,
        ],
      }
    );

    table.addConsumers(this, { streamConsumer: dynamoConsumer });

    const imageBucket = new sst.Bucket(
      this,
      `garagebloc-images-${process.env.NODE_ENV}`,
      {
        s3Bucket: {
          accessControl: BucketAccessControl.PUBLIC_READ,
          cors: <CorsRule[]>[
            {
              allowedHeaders: ["*"],
              allowedMethods: [HttpMethods.PUT],
              allowedOrigins: [
                "http://localhost:3000",
                "https://garagebloc.com",
              ],
              maxAge: 30,
            },
          ],
        },
      }
    );

    const api = new sst.Api(this, "garagebloc-api", {
      cors: {
        allowMethods: [CorsHttpMethod.ANY],
        allowHeaders: [
          "Content-Type",
          "X-Amz-Date",
          "Authorization",
          "X-Api-Key",
          "X-Amz-Security-Token",
        ],
        allowOrigins:
          process.env.NODE_ENV === "dev"
            ? ["http://localhost:3000"]
            : ["https://garagebloc.com"],
      },
      defaultAuthorizationType: sst.ApiAuthorizationType.AWS_IAM,
      defaultFunctionProps: {
        environment: {
          tableName: table.dynamodbTable.tableName,
          AUTH0_DOMAIN: `${process.env.AUTH0_DOMAIN}`,
        },
      },
      routes: {
        "GET /routes": "src/handlers/routes/get.handler",
        "GET /walls": "src/handlers/walls/get.handler",
        "POST /walls": "src/handlers/walls/post.handler",
        "POST /walls/{wallId}/setup": "src/handlers/walls/setup/post.handler",
        "POST /walls/{wallId}/routes": "src/handlers/routes/post.handler",
        "POST /walls/{wallId}/routes/{routeId}/logs": "src/handlers/logs/post.handler",
      },
    });

    api.attachPermissions([table, imageBucket]);

    const auth = new sst.Auth(this, "garagebloc-auth", {
      cognito: {
        userPool: {
          passwordPolicy: {
            minLength: 8,
            requireLowercase: false,
            requireUppercase: false,
            requireDigits: false,
            requireSymbols: false,
          },
          signInAliases: { email: true },
        },
      },
    });

    auth.attachPermissionsForAuthUsers([
      api,
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ["s3:PutObject", "s3:GetObject"],
        resources: [`${imageBucket.bucketArn}/*`],
      }),
    ]);

    this.addOutputs({
      ApiEndpoint: api.url,
      UserPoolId: auth.cognitoUserPool!.userPoolId,
      IdentityPoolId: auth.cognitoCfnIdentityPool.ref,
      UserPoolClientId: auth.cognitoUserPoolClient!.userPoolClientId,
      ImageBucketArn: imageBucket.bucketName,
    });
  }
}
