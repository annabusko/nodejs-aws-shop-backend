import { Construct } from "constructs";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as lambda from "aws-cdk-lib/aws-lambda-nodejs";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { ToPascalCase } from "../utility/resource-helper";
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";

const DefaultEnvVariables = {
  "PRODUCTS_TABLE": 'Products',
  "STOCKS_TABLE": 'Stocks'
}

export class ProductService extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const endpoints = [
      { handler: "getListHandler", method: "GET", resource: "products", param: null },
      { handler: "getProductByIdHandler", method: "GET", resource: "products", param: "{productId}"},
      { handler: "createProductHandler", method: "POST", resource: "products", param: null },
    ];

    const api = new apigateway.RestApi(this, "ApiGateway", {
      restApiName: "ProductsApi",
      description: "Products API",
    });

    endpoints.forEach((e) => {
      const handler = new lambda.NodejsFunction(this, ToPascalCase(e.handler), {
        runtime: Runtime.NODEJS_18_X,
        entry: `product-service/handlers/${e.handler}.ts`,
        handler: e.handler,
        environment: DefaultEnvVariables,
        initialPolicy: [
          new PolicyStatement({
            effect: Effect.ALLOW,
            actions: ["dynamodb:*"],
            resources: [
              'arn:aws:dynamodb:eu-north-1:471176946492:table/Products',
              'arn:aws:dynamodb:eu-north-1:471176946492:table/Stocks',
            ],
          }),
          new PolicyStatement({
            effect: Effect.ALLOW,
            actions: ["logs:CreateLogStream", "logs:PutLogEvents"],
            resources: [
              'arn:aws:logs:us-east-2:471176946492:log-group:/aws/lambda/NodejsAwsShopBackendStack-*',
            ],
          })
        ],
      });

      const handlerIntegration = new apigateway.LambdaIntegration(handler);

      let resource = e.param ? 
        api.root.getResource(e.resource)?.addResource(e.param) :
        api.root.getResource(e.resource) ?? api.root.addResource(e.resource);

      resource?.addMethod(e.method, handlerIntegration);
    });
  }
}
