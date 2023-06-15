import { Construct } from "constructs";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as lambda from "aws-cdk-lib/aws-lambda-nodejs";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { ToPascalCase } from "../utility/resource-helper";
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { S3EventSource } from "aws-cdk-lib/aws-lambda-event-sources";
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3n from 'aws-cdk-lib/aws-s3-notifications';

export class ImportService extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const endpoints = [
      { handler: "importProductsFileHandler", method: "GET", resource: "import", param: null, queryParam: 'name' }
    ];

    const api = new apigateway.RestApi(this, "ImportApiGateway", {
      restApiName: "ImportServiceApi",
      description: "Import Service API",
    });

    endpoints.forEach((e) => {
      const handler = new lambda.NodejsFunction(this, ToPascalCase(e.handler), {
        runtime: Runtime.NODEJS_18_X,
        entry: `import-service/handlers/${e.handler}.ts`,
        handler: e.handler,
        initialPolicy: [
          new PolicyStatement({
            effect: Effect.ALLOW,
            actions: ["s3:*"],
            resources: [
              'arn:aws:s3:::annabusko-nodejs-task-5',
            ],
          }),
          new PolicyStatement({
            effect: Effect.ALLOW,
            actions: ["logs:CreateLogStream", "logs:PutLogEvents"],
            resources: [
              'arn:aws:logs:us-east-2:471176946492:log-group:/aws/lambda/ImportServiceStack-*',
            ],
          })
        ],
      });

      const handlerIntegration = new apigateway.LambdaIntegration(handler);

      let resource = e.param ? 
        api.root.getResource(e.resource)?.addResource(e.param) :
        api.root.addResource(e.resource);

      resource?.addMethod(e.method, handlerIntegration);
    });

    const handler = new lambda.NodejsFunction(this, "FileParserHandler", {
      runtime: Runtime.NODEJS_18_X,
      entry: `import-service/handlers/fileParserHandler.ts`,
      handler: 'fileParserHandler',
      initialPolicy: [
        new PolicyStatement({
          effect: Effect.ALLOW,
          actions: ["s3:*"],
          resources: [
            'arn:aws:s3:::annabusko-nodejs-task-5',
          ],
        }),
        new PolicyStatement({
          effect: Effect.ALLOW,
          actions: ["logs:CreateLogStream", "logs:PutLogEvents"],
          resources: [
            'arn:aws:logs:us-east-2:471176946492:log-group:/aws/lambda/ImportServiceStack-*',
          ],
        })
      ],
    });

    const bucket = s3.Bucket.fromBucketName(this, 'ImportBucket', 'annabusko-nodejs-task-5');
    bucket.addEventNotification(s3.EventType.OBJECT_CREATED, new s3n.LambdaDestination(handler));
  }
}
