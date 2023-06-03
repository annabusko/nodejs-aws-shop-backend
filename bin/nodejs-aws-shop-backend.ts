#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { NodejsAwsShopBackendStack } from "../lib/nodejs-aws-shop-backend-stack";

const app = new cdk.App();
new NodejsAwsShopBackendStack(app, "NodejsAwsShopBackendStack", {
  env: { account: "471176946492", region: "us-east-2" },
});
