#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { NodejsAwsShopBackendStack } from "../lib/nodejs-aws-shop-backend-stack";
import { ImportServiceStack } from "../lib/import-service-stack";

const app = new cdk.App();
new NodejsAwsShopBackendStack(app, "NodejsAwsShopBackendStack", {
  env: { account: "471176946492", region: "us-east-2" },
});

new ImportServiceStack(app, 'ImportServiceStack', {
  env: { account: "471176946492", region: "us-east-2" },
})
