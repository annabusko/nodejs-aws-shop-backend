import { Construct } from "constructs";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as lambda from "aws-cdk-lib/aws-lambda-nodejs";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { ToPascalCase } from "../utility/resource-helper";

export class ProductService extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const endpoints = [
      { handler: "getProductListHandler", method: "GET", resource: "products", param: null },
      { handler: "getProductByIdHandler", method: "GET", resource: "products", param: "{productId}"},
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
      });

      const handlerIntegration = new apigateway.LambdaIntegration(handler);

      let resource = e.param ? 
        api.root.getResource(e.resource)?.addResource(e.param) :
        api.root.addResource(e.resource);

      resource?.addMethod(e.method, handlerIntegration);
    });
  }
}
