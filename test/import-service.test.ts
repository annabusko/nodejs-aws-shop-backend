import { APIGatewayProxyEvent, APIGatewayProxyEventPathParameters } from "aws-lambda";
import { HttpStatuses } from "../utility/requestHandlerUtilities";
import { importProductsFileHandler  } from "../import-service/handlers/importProductsFileHandler";

describe("Lambda GetProductListHandler", () => {
  it("should return 'Ok'", async () => {
    const testFileName = 'test.csv';
    const event = { queryStringParameters: {name: testFileName} as APIGatewayProxyEventPathParameters} as APIGatewayProxyEvent;
    const response = await importProductsFileHandler (event);

    expect(response.statusCode).toBe(HttpStatuses.Ok);
    expect(response.body.length > 0);
  });
});